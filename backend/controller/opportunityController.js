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
  const { title, description, required_skills, duration, location, date } =
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
    const { status } = req.body;
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
    const updated = await application.save();
    await updated.populate("volunteer_id", "name email role location skills");
    await updated.populate("reviewed_by", "name email role");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      volunteer_id: req.user._id,
    })
      .populate("opportunity_id", "title ngo_id status")
      .populate("reviewed_by", "name email role");
    res.json(apps);
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
};
