import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import escapeRegex from "../utils/escapeRegex.js";
import parseSkills from "../utils/parseSkills.js";

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

const canManageApplication = async (application, user) => {
  if (!user || !application) return false;
  if (user.role === "admin") return true;

  const opportunity = await Opportunity.findById(application.opportunity_id);
  return Boolean(opportunity && canManageOpportunity(opportunity, user));
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
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: parseSkills(required_skills),
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
      query.location = { $regex: escapeRegex(city), $options: 'i' };
    }

    if (search) {
      const escapedSearch = escapeRegex(search);
      const searchConditions = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { required_skills: { $regex: escapedSearch, $options: 'i' } },
      ];

      if (!city || city === 'all') {
        searchConditions.push({ location: { $regex: escapedSearch, $options: 'i' } });
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

    if (Object.prototype.hasOwnProperty.call(req.body, "required_skills")) {
      opportunity.required_skills = parseSkills(req.body.required_skills);
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
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.status !== "open")
      return res.status(400).json({ message: "This opportunity is not open for applications" });

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
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ opportunity_id: req.params.id })
      .populate("volunteer_id", "name email skills location bio")
      .populate("opportunity_id", "title status location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const allowedStatuses = ["pending", "accepted", "rejected"];

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid application status" });
  }

  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    if (!(await canManageApplication(application, req.user))) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = req.body.status;
    const updated = await application.save();
    await updated.populate("volunteer_id", "name email skills location bio");
    await updated.populate("opportunity_id", "title status location");

    res.json(updated);
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

export {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getOpportunityApplications,
  getUserApplications,
  updateApplicationStatus,
};
