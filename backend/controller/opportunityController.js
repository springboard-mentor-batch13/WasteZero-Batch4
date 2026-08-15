import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Pickup from "../models/Pickup.js";
import { notifyAdmins, notifyUser, notifyUsers } from "../utils/notify.js";
import { recordAdminAction } from "../utils/adminLog.js";
import {
  opportunityErrorResponse,
  parseArrayField,
  validateOpportunityPayload,
} from "../utils/opportunityValidation.js";

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "opportunities",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const fileToDataUrl = (file) => {
  if (!file) return "";
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const getOpportunityImageUrl = async (file) => {
  if (!file) return "";

  if (hasCloudinaryConfig()) {
    try {
      const uploaded = await uploadToCloudinary(file.buffer);
      return uploaded.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);
    }
  }

  return fileToDataUrl(file);
};

const canManageOpportunity = (opportunity, user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  const ngoId = opportunity.ngo_id?._id || opportunity.ngo_id;
  return ngoId.toString() === user._id.toString();
};

const isOpportunityOwner = (opportunity, user) => {
  if (!user) return false;
  // Admins have platform-wide oversight - they can manage applications for
  // any opportunity, not just ones they personally posted. NGOs are still
  // restricted to their own.
  if (user.role === "admin") return true;
  if (user.role !== "ngo") return false;
  const ngoId = opportunity.ngo_id?._id || opportunity.ngo_id;
  return ngoId.toString() === user._id.toString();
};

const createOpportunity = async (req, res) => {
  const { title, description, required_skills, wasteTypes, duration, location, date } =
    req.body;

  try {
    validateOpportunityPayload(req.body);
    const image_url = await getOpportunityImageUrl(req.file);
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: parseArrayField(required_skills, 'required_skills'),
      wasteTypes: parseArrayField(wasteTypes, 'wasteTypes'),
      duration,
      location,
      date,
      image_url,
    });

    // Let volunteers know a new opportunity is up - prioritize the ones
    // whose preferred waste types actually match it; if nobody's set that
    // preference yet, fall back to notifying every volunteer so the
    // feature isn't silently a no-op on a fresh dataset.
    try {
      const oppWasteTypes = opportunity.wasteTypes || [];
      let recipients = await User.find({
        role: 'volunteer',
        ...(oppWasteTypes.length ? { preferredWasteTypes: { $in: oppWasteTypes } } : {}),
      }).select('_id');

      if (!recipients.length) {
        recipients = await User.find({ role: 'volunteer' }).select('_id');
      }

      await notifyUsers({
        userIds: recipients.map((volunteer) => volunteer._id),
        type: 'new_opportunity',
        message: `New opportunity posted: ${opportunity.title} in ${opportunity.location}.`,
        link: `/opportunities/${opportunity._id}`,
      });

      await notifyAdmins({
        type: 'new_opportunity',
        message: `${req.user.name} posted a new opportunity: ${opportunity.title}.`,
        link: `/opportunities/${opportunity._id}`,
        excludeUserId: req.user._id,
      });
    } catch (notifyError) {
      // Never let a notification failure block opportunity creation itself.
      console.error('Error notifying volunteers of new opportunity:', notifyError);
    }

    res.status(201).json(opportunity);
  } catch (error) {
    const response = opportunityErrorResponse(error, 'Unable to create opportunity.');
    res.status(response.status).json({ message: response.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { status, search, city } = req.query;
    let query = {};

    // NGOs manage their own workboard; volunteers and admins can browse all.
    if (req.user.role === 'ngo') {
      query.ngo_id = req.user._id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (city && city !== 'all') {
      query.location = { $regex: escapeRegex(city), $options: 'i' };
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      const searchConditions = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { required_skills: { $regex: safeSearch, $options: 'i' } },
      ];

      // Only search location if city filter is not already applied
      if (!city || city === 'all') {
        searchConditions.push({ location: { $regex: safeSearch, $options: 'i' } });
      }

      query.$or = searchConditions;
    }

    const opportunities = await Opportunity.find(query)
      .populate('ngo_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "name email",
    );
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    if (req.user.role === 'ngo' && !isOpportunityOwner(opportunity, req.user)) {
      return res.status(403).json({ message: 'NGOs can only view their own opportunities' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    validateOpportunityPayload(req.body, { partial: true });
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to modify this opportunity" });
    }

    if (req.body.title !== undefined) opportunity.title = req.body.title.trim();

    if (req.body.description !== undefined) opportunity.description = req.body.description.trim();

    if (req.body.duration !== undefined) opportunity.duration = req.body.duration;

    if (req.body.location !== undefined) opportunity.location = req.body.location.trim();

    if (req.body.date !== undefined) opportunity.date = req.body.date || null;

    if (req.body.status) opportunity.status = req.body.status;

    if (req.body.required_skills !== undefined) {
      opportunity.required_skills = parseArrayField(req.body.required_skills, 'required_skills');
    }

    if (req.body.wasteTypes !== undefined) {
      opportunity.wasteTypes = parseArrayField(req.body.wasteTypes, 'wasteTypes');
    }

    if (req.file) {
      opportunity.image_url = await getOpportunityImageUrl(req.file);
    }
    const updated = await opportunity.save();
    res.json(updated);
  } catch (error) {
    const response = opportunityErrorResponse(error, 'Unable to update opportunity.');
    res.status(response.status).json({ message: response.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to modify this opportunity" });
    }

    const affectedApplications = await Application.find({
      opportunity_id: req.params.id,
      status: { $in: ['pending', 'accepted'] },
    }).select('volunteer_id status');

    await Promise.all(
      affectedApplications.map((application) =>
        notifyUser({
          userId: application.volunteer_id,
          type: 'opportunity_deleted',
          message: `The opportunity "${opportunity.title}" was removed by its organizer. Your ${application.status} application has been archived.`,
          link: '/applications',
        }),
      ),
    );

    const archivedAt = new Date();
    await Application.updateMany(
      { opportunity_id: req.params.id },
      {
        $set: {
          archivedAt,
          opportunity_snapshot: {
            title: opportunity.title,
            ngo_id: opportunity.ngo_id,
            deletedAt: archivedAt,
          },
        },
      },
    );
    await opportunity.deleteOne();
    await recordAdminAction({
      adminUser: req.user,
      action: 'opportunity_deleted',
      targetType: 'Opportunity',
      targetId: opportunity._id,
      details: { title: opportunity.title, notifiedApplicants: affectedApplications.length },
    });
    res.json({
      message: 'Opportunity deleted; related applications were archived and volunteers notified.',
      notifiedApplicants: affectedApplications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyForOpportunity = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can apply for opportunities' });
    }

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.status !== "open") {
      return res.status(400).json({ message: "This opportunity is not open for applications" });
    }

    const existing = await Application.findOne({
      opportunity_id: req.params.id,
      volunteer_id: req.user._id,
    });
    if (existing) return res.status(400).json({ message: "Already applied" });
    const application = await Application.create({
      opportunity_id: req.params.id,
      volunteer_id: req.user._id,
    });

    try {
      await Promise.all([
        notifyUser({
          userId: opportunity.ngo_id,
          type: 'new_application',
          message: `${req.user.name} applied for "${opportunity.title}".`,
          link: `/opportunities/${opportunity._id}`,
        }),
        notifyAdmins({
          type: 'new_application',
          message: `${req.user.name} applied for "${opportunity.title}".`,
          link: `/opportunities/${opportunity._id}`,
          excludeUserId: opportunity.ngo_id,
        }),
      ]);
    } catch (notifyError) {
      console.error('Error notifying users of new application:', notifyError);
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityApplications = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "name email",
    );
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    const canReview = isOpportunityOwner(opportunity, req.user);
    const canViewStatus = req.user?.role === "admin";

    if (!canReview && !canViewStatus) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    let applicationsQuery = Application.find({
      opportunity_id: req.params.id,
    })
      .populate("reviewed_by", "name email role")
      .sort({ createdAt: -1 });

    if (canReview) {
      applicationsQuery = applicationsQuery.populate("volunteer_id", "name email role location skills");
    }

    const applications = await applicationsQuery;
    const summary = {
      total: applications.length,
      pending: applications.filter((application) => application.status === "pending").length,
      accepted: applications.filter((application) => application.status === "accepted").length,
      rejected: applications.filter((application) => application.status === "rejected").length,
      ngo: opportunity.ngo_id,
    };

    res.json({
      mode: canReview ? "review" : "admin",
      summary,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remark, rejection_remark } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const application = await Application.findById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    const opportunity = await Opportunity.findById(application.opportunity_id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!isOpportunityOwner(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    application.reviewed_by = req.user._id;
    application.reviewed_at = new Date();

    if (status === 'rejected') {
      application.rejection_remark = rejection_remark || remark || '';
    }

    const updated = await application.save();
    await updated.populate("volunteer_id", "name email role location skills");
    await updated.populate("reviewed_by", "name email role");

    try {
      await notifyUser({
        userId: updated.volunteer_id._id,
        type: 'application_status',
        message: status === 'accepted'
          ? `Your application for "${opportunity.title}" was accepted!`
          : `Your application for "${opportunity.title}" was declined.`,
        link: '/applications',
      });
    } catch (notifyError) {
      console.error('Error notifying volunteer of application decision:', notifyError);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can view volunteer applications' });
    }
    const apps = await Application.find({
      volunteer_id: req.user._id,
    })
      .populate("opportunity_id", "title ngo_id status")
      .populate("opportunity_snapshot.ngo_id", "name email")
      .populate("reviewed_by", "name email role");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    const pickupQuery = role === 'ngo'
      ? { assigned_to: userId }
      : role === 'volunteer'
        ? { requester_id: userId }
        : {};
    const opportunityQuery = role === 'ngo' ? { ngo_id: userId } : {};
    const applicationQuery = role === 'volunteer' ? { volunteer_id: userId } : {};
    const [
      totalPickups,
      completedPickups,
      assignedPickups,
      opportunityCount,
      activeOpportunityCount,
      acceptedApplicationCount,
    ] = await Promise.all([
      Pickup.countDocuments(pickupQuery),
      Pickup.countDocuments({ ...pickupQuery, status: 'completed' }),
      Pickup.countDocuments({ ...pickupQuery, status: 'assigned' }),
      Opportunity.countDocuments(opportunityQuery),
      Opportunity.countDocuments({ ...opportunityQuery, status: 'open' }),
      Application.countDocuments({ ...applicationQuery, status: 'accepted' }),
    ]);
    const summary = {
      totalPickups,
      completedPickups,
      assignedPickups,
      opportunityCount,
      activeOpportunityCount,
      acceptedApplicationCount,
      applicationCount: 0,
    };

    if (role === 'ngo') {
      const ngoOpportunities = await Opportunity.find({ ngo_id: userId }).select('_id');
      const oppIds = ngoOpportunities.map(opp => opp._id);

      const applications = await Application.find({ opportunity_id: { $in: oppIds } })
        .populate('opportunity_id', 'title description location status')
        .populate('volunteer_id', 'name email phone location skills')
        .sort({ createdAt: -1 });

      summary.applicationCount = applications.length;

      return res.json({ success: true, data: applications, summary });
    }

    if (role === 'volunteer') {
      const applications = await Application.find({ volunteer_id: userId })
        .populate({
          path: 'opportunity_id',
          select: 'title location ngo_id',
          populate: { path: 'ngo_id', select: 'name email' }
        })
        .sort({ createdAt: -1 });

      summary.applicationCount = applications.length;

      return res.json({ success: true, data: applications, summary });
    }

    if (role === 'admin') {
      const applications = await Application.find()
        .populate({
          path: 'opportunity_id',
          select: 'title ngo_id',
          populate: { path: 'ngo_id', select: 'name email' }
        })
        .populate('volunteer_id', 'name email')
        .sort({ createdAt: -1 });

      summary.applicationCount = applications.length;

      return res.json({ success: true, data: applications, summary });
    }

    return res.status(403).json({ message: 'Unauthorized role' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getUserApplications,
  getDashboardData,
};
