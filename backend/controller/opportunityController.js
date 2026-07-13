import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';

const createOpportunity = async (req, res) => {
  const { title, description, required_skills, duration, location, date, image_url } = req.body;
  try {
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id, title, description,
      required_skills: required_skills || [], duration, location, date,
      image_url: image_url || '',
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
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
    const opportunity = await Opportunity.findById(req.params.id).populate('ngo_id', 'name email');
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    ['title','description','required_skills','duration','location','date','status','image_url']
      .forEach(f => { if (req.body[f] !== undefined) opportunity[f] = req.body[f]; });
    const updated = await opportunity.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    await Application.deleteMany({ opportunity_id: req.params.id });
    await opportunity.deleteOne();
    res.json({ message: 'Opportunity and related applications deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyForOpportunity = async (req, res) => {
  try {
    const existing = await Application.findOne({ opportunity_id: req.params.id, volunteer_id: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const application = await Application.create({ opportunity_id: req.params.id, volunteer_id: req.user._id });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ volunteer_id: req.user._id }).populate('opportunity_id');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOpportunity, getOpportunities, getOpportunityById, updateOpportunity, deleteOpportunity, applyForOpportunity, getUserApplications };
