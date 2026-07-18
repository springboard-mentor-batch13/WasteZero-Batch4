import Otp from '../models/Otp.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

const isStrongPassword = (password) => password.length >= 6 && /\d/.test(password);

const createOtpForEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return otp;
};

export const sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = await createOtpForEmail(user.email);

    const canSendEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    res.json({
      message: canSendEmail
        ? `OTP sent to ${user.email}`
        : 'Email is not configured. Use the returned OTP to continue.',
      otp: canSendEmail ? undefined : otp,
    });

    if (!canSendEmail) return;

    sendEmail({
      to: user.email,
      subject: 'WasteZero - Your OTP for Password Change',
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    }).catch(err => console.error('Email error:', err));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = await createOtpForEmail(user.email);

    const canSendEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    res.json({
      message: canSendEmail
        ? `OTP sent to ${user.email}`
        : 'Email is not configured. Use the returned OTP to continue.',
      otp: canSendEmail ? undefined : otp,
    });

    if (!canSendEmail) return;

    sendEmail({
      to: user.email,
      subject: 'WasteZero - Password reset OTP',
      text: `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    }).catch(err => console.error('Email error:', err));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetForgotPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (!isStrongPassword(newPassword))
    return res.status(400).json({ message: 'Password must be at least 6 characters and contain one number' });

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otpRecord = await Otp.findOne({ email: user.email });
    if (!otpRecord)
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpMatch)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email: user.email });

    res.json({ message: 'Password reset successfully. Please sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtpAndChangePassword = async (req, res) => {
  const { otp, currentPassword, newPassword, confirmPassword } = req.body;

  if (!otp || !currentPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (!isStrongPassword(newPassword))
    return res.status(400).json({ message: 'Password must be at least 6 characters and contain one number' });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isCurrentMatch = await user.matchPassword(currentPassword);
    if (!isCurrentMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    const otpRecord = await Otp.findOne({ email: user.email });
    if (!otpRecord)
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpMatch)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email: user.email });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
