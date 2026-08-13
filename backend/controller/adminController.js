import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Pickup from '../models/Pickup.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const getAdminOverview = async (req, res) => {
  try {
    const [users, opportunities, applications, pickups, messages, recentUsers, recentOpportunities, recentPickups] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 }, active: { $sum: { $cond: [{ $ne: ['$isActive', false] }, 1, 0] } } } }]),
      Opportunity.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Pickup.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Message.countDocuments(),
      User.find().select('name email role isActive createdAt').sort({ createdAt: -1 }).limit(5).lean(),
      Opportunity.find().populate('ngo_id', 'name').sort({ createdAt: -1 }).limit(5).lean(),
      Pickup.find().populate('requester_id', 'name').sort({ createdAt: -1 }).limit(5).lean(),
    ]);
    res.json({ success: true, data: { users, opportunities, applications, pickups, messages, recentUsers, recentOpportunities, recentPickups } });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAdminUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role && req.query.role !== 'all') filter.role = req.query.role;
    if (req.query.status === 'active') filter.isActive = { $ne: false };
    if (req.query.status === 'suspended') filter.isActive = false;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { location: { $regex: req.query.search, $options: 'i' } },
    ];
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateAdminUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isSelf = String(user._id) === String(req.user._id);
    if (isSelf && (req.body.isActive === false || (req.body.role && req.body.role !== 'admin'))) {
      return res.status(400).json({ message: 'You cannot suspend or demote your own admin account' });
    }
    if (req.body.role && ['volunteer', 'ngo', 'admin'].includes(req.body.role)) user.role = req.body.role;
    if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
    await user.save();
    const safeUser = await User.findById(user._id).select('-password').lean();
    res.json({ success: true, message: 'User updated successfully', data: safeUser });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAdminActivity = async (req, res) => {
  try {
    const [applications, pickups, notifications] = await Promise.all([
      Application.find().populate('volunteer_id', 'name').populate('opportunity_id', 'title').sort({ updatedAt: -1 }).limit(20).lean(),
      Pickup.find().populate('requester_id', 'name').populate('assigned_to', 'name').sort({ updatedAt: -1 }).limit(20).lean(),
      Notification.find().populate('user_id', 'name role').sort({ createdAt: -1 }).limit(20).lean(),
    ]);
    res.json({ success: true, data: { applications, pickups, notifications } });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
