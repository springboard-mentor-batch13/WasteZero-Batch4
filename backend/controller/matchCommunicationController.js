import Opportunity from '../models/Opportunity.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { canCommunicateWith, getAllowedContactIds } from '../utils/communicationAccess.js';

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

    if (![user1, user2].includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'You cannot access this conversation.' });
    }

    const contactId = user1 === req.user._id.toString() ? user2 : user1;
    if (!(await canCommunicateWith(req.user, contactId))) {
      return res.status(403).json({
        success: false,
        message: 'Chat becomes available after the volunteer application is accepted.',
      });
    }

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

export const getConversationContacts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const allowedContactIds = await getAllowedContactIds(req.user);
    const users = await User.find({ _id: { $in: allowedContactIds } })
      .select('name email role')
      .sort({ name: 1 })
      .lean();

    const recentMessages = await Message.find({
      $or: [{ sender_id: currentUserId }, { receiver_id: currentUserId }],
    })
      .sort({ timestamp: -1 })
      .lean();

    const latestByUser = new Map();
    for (const message of recentMessages) {
      const partnerId = (
        message.sender_id.toString() === currentUserId.toString()
          ? message.receiver_id
          : message.sender_id
      ).toString();

      if (!latestByUser.has(partnerId)) {
        latestByUser.set(partnerId, message);
      }
    }

    const contacts = users
      .map((user) => {
        const latest = latestByUser.get(user._id.toString());
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastMessage: latest?.content || '',
          lastMessageAt: latest?.timestamp || null,
        };
      })
      .sort((a, b) => {
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
        }
        if (a.lastMessageAt) return -1;
        if (b.lastMessageAt) return 1;
        return a.name.localeCompare(b.name);
      });

    res.status(200).json({ success: true, data: contacts });
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
