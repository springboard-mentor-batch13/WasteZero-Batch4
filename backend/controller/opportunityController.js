import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { notifyAdmins, notifyUser } from "../utils/notify.js";

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
  if (!user || user.role !== "ngo") return false;
  const ngoId = opportunity.ngo_id?._id || opportunity.ngo_id;
  return ngoId.toString() === user._id.toString();
};

const createOpportunity = async (req, res) => {
  const { title, description, required_skills, wasteTypes, duration, location, date } =
    req.body;

  try {
    const image_url = await getOpportunityImageUrl(req.file);
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: Array.isArray(required_skills)
        ? required_skills
        : required_skills
          ? JSON.parse(required_skills)
          : [],
      wasteTypes: Array.isArray(wasteTypes)
        ? wasteTypes
        : wasteTypes
          ? JSON.parse(wasteTypes)
          : [],
      duration,
      location,
      date,
      image_url,
    });

    try {
      const oppWasteTypes = opportunity.wasteTypes || [];
      let recipients = await User.find({
        role: 'volunteer',
        ...(oppWasteTypes.length ? { preferredWasteTypes: { $in: oppWasteTypes } } : {}),
      }).select('_id');

      if (!recipients.length) {
        recipients = await User.find({ role: 'volunteer' }).select('_id');
      }

      await Promise.all(
        recipients.map((volunteer) =>
          notifyUser({
            userId: volunteer._id,
            type: 'new_opportunity',
            message: `New opportunity posted: ${opportunity.title} in ${opportunity.location}.`,
            link: `/opportunities/${opportunity._id}`,
          }),
        ),
      );

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
    res.status(500).json({ message: error.message });
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
      query.location = { $regex: city, $options: 'i' };
    }

    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { required_skills: { $regex: search, $options: 'i' } },
      ];

      // Only search location if city filter is not already applied
      if (!city || city === 'all') {
        searchConditions.push({ location: { $regex: search, $options: 'i' } });
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
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to modify this opportunity" });
    }

    if (req.body.title) opportunity.title = req.body.title;

    if (req.body.description) opportunity.description = req.body.description;

    if (req.body.duration) opportunity.duration = req.body.duration;

    if (req.body.location) opportunity.location = req.body.location;

    if (req.body.date) opportunity.date = req.body.date;

    if (req.body.status) opportunity.status = req.body.status;

    if (req.body.required_skills) {
      opportunity.required_skills = Array.isArray(req.body.required_skills)
        ? req.body.required_skills
        : JSON.parse(req.body.required_skills);
    }

    if (req.body.wasteTypes) {
      opportunity.wasteTypes = Array.isArray(req.body.wasteTypes)
        ? req.body.wasteTypes
        : JSON.parse(req.body.wasteTypes);
    }

    if (req.file) {
      opportunity.image_url = await getOpportunityImageUrl(req.file);
    }
    const updated = await opportunity.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("ngo_id", "name email");
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    const isOwner = isOpportunityOwner(opportunity, req.user);
    const isAdminOwner = req.user?.role === "admin" &&
      opportunity.ngo_id?._id?.toString() === req.user._id.toString();
    const isAdminViewing = req.user?.role === "admin" && !isAdminOwner;

    if (!isOwner && !isAdminOwner && !isAdminViewing) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const canReview = isOwner || isAdminOwner;

    let applicationsQuery = Application.find({ opportunity_id: req.params.id })
      .populate("reviewed_by", "name email role")
      .sort({ createdAt: -1 });

    if (canReview) {
      applicationsQuery = applicationsQuery.populate(
        "volunteer_id", "name email role location skills"
      );
    }

    const applications = await applicationsQuery;
    const summary = {
      total: applications.length,
      pending: applications.filter(a => a.status === "pending").length,
      accepted: applications.filter(a => a.status === "accepted").length,
      rejected: applications.filter(a => a.status === "rejected").length,
      ngo: opportunity.ngo_id,
    };

    res.json({
      mode: canReview ? "review" : "admin",
      canReview,
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
    const isOwner = isOpportunityOwner(opportunity, req.user);
    const isAdminOwner = req.user.role === 'admin' &&
      opportunity.ngo_id.toString() === req.user._id.toString();

    if (!isOwner && !isAdminOwner) {
      return res.status(403).json({
        message: "Not authorized — you can only review applications for opportunities you created"
      });
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

    // Notify volunteer about decision
    await notifyUser({
      userId: application.volunteer_id,
      type: 'application_update',
      message: status === 'accepted'
        ? `Your application for "${opportunity.title}" has been accepted!`
        : `Your application for "${opportunity.title}" was not accepted.`,
      link: `/opportunities/${opportunity._id}`,
    });

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

    if (role === 'ngo') {
      const ngoOpportunities = await Opportunity.find({ ngo_id: userId }).select('_id');
      const oppIds = ngoOpportunities.map(opp => opp._id);

      const applications = await Application.find({ opportunity_id: { $in: oppIds } })
        .populate('opportunity_id', 'title description location status')
        .populate('volunteer_id', 'name email phone location skills')
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
    }

    if (role === 'volunteer') {
      const applications = await Application.find({ volunteer_id: userId })
        .populate({
          path: 'opportunity_id',
          select: 'title location ngo_id',
          populate: { path: 'ngo_id', select: 'name email' }
        })
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
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

      return res.json({ success: true, data: applications });
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
