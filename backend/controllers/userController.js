import User from '../models/User.js';
import { toPublic } from './authController.js';

// @route  GET /api/users/profile  (protected)
export const getProfile = async (req, res) => {
  res.json({ success: true, user: toPublic(req.user) });
};

// @route  PUT /api/users/profile  (protected)
export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'skills', 'location', 'bio', 'address', 'coordinates'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user: toPublic(user) });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/users  (admin only)
export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users: users.map(toPublic) });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/users/:id  (admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: toPublic(user) });
  } catch (err) {
    next(err);
  }
};
