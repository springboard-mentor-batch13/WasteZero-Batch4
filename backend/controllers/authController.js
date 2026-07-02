import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Shape a user document for safe API output (no password).
const toPublic = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  skills: user.skills,
  location: user.location,
  bio: user.bio,
  createdAt: user.createdAt,
});

// @route  POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, skills, location, bio } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role, skills, location, bio });
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({ success: true, token, user: toPublic(user) });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password has select:false, so request it explicitly.
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.json({ success: true, token, user: toPublic(user) });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  res.json({ success: true, user: toPublic(req.user) });
};

export { toPublic };
