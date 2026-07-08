import Otp from '../models/Otp.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

// POST /api/otp/send
// Called when user clicks "Change Password" — sends OTP to their email
export const sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email: user.email });

    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Save OTP — expires in 10 minutes
    await Otp.create({
      email: user.email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // ✅ Respond IMMEDIATELY — don't wait for email
    res.json({ message: `OTP sent to ${user.email}` });

    // Send email in background AFTER responding
    sendEmail({
      to: user.email,
      subject: 'WasteZero — Your OTP for Password Change',
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    }).catch(err => console.error('Email error:', err));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST /api/otp/verify-and-change
// Verifies OTP then changes the password
export const verifyOtpAndChangePassword = async (req, res) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'OTP, new password and confirm password are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (newPassword.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find OTP record
    const otpRecord = await Otp.findOne({ email: user.email });
    if (!otpRecord) return res.status(400).json({ message: 'OTP not found. Please request a new one.' });

    // Check if expired
    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    // Update password — pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: user.email });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};