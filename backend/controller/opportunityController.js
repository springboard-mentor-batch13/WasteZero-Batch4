import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";

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

const canManageOpportunity = (opportunity, user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return opportunity.ngo_id.toString() === user._id.toString();
};

const createOpportunity = async (req, res) => {
  const { title, description, required_skills, duration, location, date } =
    req.body;

  try {
    let image_url = "";
    if (req.file && hasCloudinaryConfig()) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      image_url = uploaded.secure_url;
    }

    let skills = [];
    if (required_skills) {
      try {
        skills = Array.isArray(required_skills)
          ? required_skills
          : typeof required_skills === 'string'
          ? JSON.parse(required_skills)
          : [];
      } catch (parseError) {
        skills = [];
      }
    }

    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: skills,
      duration,
      location,
      date,
      image_url,
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { status, search, city } = req.query;
    let query = {};

    if (req.user?.role === 'ngo') {
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

    if (req.file && hasCloudinaryConfig()) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      opportunity.image_url = uploaded.secure_url;
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

    await Application.deleteMany({ opportunity_id: req.params.id });
    await opportunity.deleteOne();
    res.json({ message: "Opportunity and related applications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyForOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const existing = await Application.findOne({
      opportunity_id: req.params.id,
      volunteer_id: req.user._id,
    });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      opportunity_id: req.params.id,
      ngo_id: opportunity.ngo_id,
      volunteer_id: req.user._id,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      volunteer_id: req.user._id,
    }).populate("opportunity_id");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNgoApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      ngo_id: req.user._id,
    })
      .populate("opportunity_id", "title description location")
      .populate("volunteer_id", "name email")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.user.role === "ngo" && application.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to manage this application" });
    }

    application.status = "accepted";
    await application.save();

    const populated = await application.populate([
      { path: "opportunity_id", select: "title" },
      { path: "volunteer_id", select: "name email" }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.user.role === "ngo" && application.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to manage this application" });
    }

    application.status = "rejected";
    await application.save();

    const populated = await application.populate([
      { path: "opportunity_id", select: "title" },
      { path: "volunteer_id", select: "name email" }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminApplicationStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });
    const pendingApplications = await Application.countDocuments({ status: "pending" });

    const applicationsByNgo = await Application.aggregate([
      {
        $group: {
          _id: "$ngo_id",
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      summary: {
        total: totalApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
        pending: pendingApplications
      },
      byNgo: applicationsByNgo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { status, ngoId } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (ngoId) {
      query.ngo_id = ngoId;
    }

    const applications = await Application.find(query)
      .populate("opportunity_id", "title location")
      .populate("volunteer_id", "name email")
      .populate("ngo_id", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
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
  getUserApplications,
  getNgoApplications,
  acceptApplication,
  rejectApplication,
  getAdminApplicationStats,
  getAllApplications,
};
