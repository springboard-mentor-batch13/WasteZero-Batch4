import Opportunity from '../models/Opportunity.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const getMatchedOpportunities = async (req, res) => {
  try {
    const { location, skills } = req.query;
    let query = { status: 'open' };
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.required_skills = { $in: skillsArray };
    }
    const matchedOpportunities = await Opportunity.find(query);
    res.status(200).json({ success: true, data: matchedOpportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender_id: user1, receiver_id: user2 },
        { sender_id: user2, receiver_id: user1 }
      ]
    }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId }).sort({ sent_at: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};