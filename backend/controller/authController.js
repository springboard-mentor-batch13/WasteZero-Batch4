import User from "../models/User.js";
import { isDisposableEmail, verifyEmailOtp } from './otpController.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookie.js';
import jwt from 'jsonwebtoken';

// Only these roles are self-service at signup. Admin accounts are never
// created through the public registration form.
const REGISTERABLE_ROLES = ['volunteer', 'ngo'];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password, location, skills, bio, role, otp } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'Email verification OTP is required. Please verify your email first.' });
    }

    const otpCheck = await verifyEmailOtp(normalizedEmail, otp);
    if (!otpCheck.valid) {
      return res.status(400).json({ message: otpCheck.message });
    }

    // Check only after OTP ownership is proven, so this endpoint cannot be
    // used to enumerate registered email addresses.
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'Registration could not be completed.' });
    }

    const safeRole = REGISTERABLE_ROLES.includes(role) ? role : 'volunteer';

    const user = await User.create({
      name, email: normalizedEmail, password,
      role: safeRole,
      location: location || '',
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      bio: bio || '',
    });

    setAuthCookie(res, user._id);
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, location: user.location, skills: user.skills, bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      setAuthCookie(res, user._id);
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, location: user.location, skills: user.skills, bio: user.bio,token: generateToken(user._id),
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
      if (req.body.email) {
        const normalizedEmail = req.body.email.trim().toLowerCase();
        const duplicate = await User.exists({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });
        if (duplicate) {
          return res.status(409).json({ message: 'Email address is already in use.' });
        }
        user.email = normalizedEmail;
      }
      user.name = req.body.name || user.name;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      if (req.body.preferredWasteTypes !== undefined) {
        user.preferredWasteTypes = Array.isArray(req.body.preferredWasteTypes)
          ? req.body.preferredWasteTypes
          : user.preferredWasteTypes;
      }
      if (req.body.password) user.password = req.body.password;
      const updated = await user.save();
      res.json({
        _id: updated._id, name: updated.name, email: updated.email,
        role: updated.role, location: updated.location, skills: updated.skills, bio: updated.bio,
        preferredWasteTypes: updated.preferredWasteTypes, isAvailable: updated.isAvailable,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers have an availability status.' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAvailable = !!req.body.isAvailable;
    const updated = await user.save();

    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      role: updated.role, location: updated.location, skills: updated.skills, bio: updated.bio,
      preferredWasteTypes: updated.preferredWasteTypes, isAvailable: updated.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Signed out successfully' });
};

export{ registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updateAvailability };
