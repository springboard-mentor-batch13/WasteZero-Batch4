import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res) => {
  const { name, email, password, location, skills, bio } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name, email, password,
      role: 'volunteer',
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
    const user = await User.findOne({ email });
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
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
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
