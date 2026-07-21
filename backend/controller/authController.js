import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { isDisposableEmail, verifyEmailOtp } from './otpController.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Only these roles are self-service at signup. Admin accounts are never
// created through the public registration form.
const REGISTERABLE_ROLES = ['volunteer', 'ngo'];

const registerUser = async (req, res) => {
  const { name, email, password, location, skills, bio, role, otp } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    if (!otp) {
      return res.status(400).json({ message: 'Email verification OTP is required. Please verify your email first.' });
    }

    const otpCheck = await verifyEmailOtp(normalizedEmail, otp);
    if (!otpCheck.valid) {
      return res.status(400).json({ message: otpCheck.message });
    }

    const safeRole = REGISTERABLE_ROLES.includes(role) ? role : 'volunteer';

    const user = await User.create({
      name, email: normalizedEmail, password,
      role: safeRole,
      location: location || '',
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      bio: bio || '',
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, location: user.location, skills: user.skills, bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, location: user.location, skills: user.skills, bio: user.bio,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const normalizedEmail = req.body.email?.trim().toLowerCase();

      if (normalizedEmail && normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      user.name = req.body.name || user.name;
      user.email = normalizedEmail || user.email;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      if (req.body.password) user.password = req.body.password;
      const updated = await user.save();
      res.json({
        _id: updated._id, name: updated.name, email: updated.email,
        role: updated.role, location: updated.location, skills: updated.skills, bio: updated.bio,
        token: generateToken(updated._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{ registerUser, loginUser, getUserProfile, updateUserProfile };
