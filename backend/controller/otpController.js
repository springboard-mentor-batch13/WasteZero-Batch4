import Otp from '../models/Otp.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

const isStrongPassword = (password) => password.length >= 6 && /\d/.test(password);

// A block-list of common disposable / temp-mail domains. This is not
// exhaustive, but it stops the majority of throwaway addresses used to
// bypass registration (mailinator, tempmail, guerrillamail style services).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'sharklasers.com',
  '10minutemail.com', '10minutemail.net', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'throwawaymail.com', 'fakeinbox.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'moakt.com', 'discard.email', 'mintemail.com',
  'mailnesia.com', 'mytemp.email', 'emailondeck.com', 'mail-temp.com',
  'tempmailo.com', 'tempinbox.com', 'spamgourmet.com', 'mohmal.com',
  'anonbox.net', 'burnermail.io', 'temp-mail.io', 'inboxkitten.com',
]);

const isDisposableEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return Boolean(domain && DISPOSABLE_EMAIL_DOMAINS.has(domain));
};

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

const sendOtpResponse = async ({ res, email, otp, subject, text }) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const canSendEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!canSendEmail) {
    return res.json({
      message: isDevelopment
        ? 'Email is not configured. Use the OTP shown below to continue.'
        : 'Email service is not configured. Please try again later.',
      otp: isDevelopment ? otp : undefined,
    });
  }

  try {
    await sendEmail({ to: email, subject, text });
    return res.json({ message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('Email error:', error.message);

    if (isDevelopment) {
      return res.json({
        message: 'Email could not be delivered. Use the OTP shown below to continue.',
        otp,
      });
    }

    return res.status(502).json({
      message: 'Could not send OTP email. Please try again later.',
    });
  }
};

// Reusable check used by authController.registerUser to confirm the email
// was actually verified via OTP before the account is created.
export const verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const otpRecord = await Otp.findOne({ email: normalizedEmail });

  if (!otpRecord) return { valid: false, message: 'OTP not found. Please request a new one.' };
  if (otpRecord.expiresAt < new Date()) return { valid: false, message: 'OTP has expired. Please request a new one.' };

  const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isOtpMatch) return { valid: false, message: 'Invalid OTP. Please try again.' };

  await Otp.deleteMany({ email: normalizedEmail });
  return { valid: true };
};

export { isDisposableEmail };

export const sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = await createOtpForEmail(user.email);

    return sendOtpResponse({
      res,
      email: user.email,
      otp,
      subject: 'WasteZero - Your OTP for Password Change',
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sends an OTP to verify an email address before an account is created.
// This is what stops registration with fake / temporary inboxes: the OTP
// must be read from the real inbox and submitted back before /auth/register
// will create the user.
export const sendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const otp = await createOtpForEmail(normalizedEmail);

    return sendOtpResponse({
      res,
      email: normalizedEmail,
      otp,
      subject: 'WasteZero - Verify your email',
      text: `Your email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
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

    return sendOtpResponse({
      res,
      email: user.email,
      otp,
      subject: 'WasteZero - Password reset OTP',
      text: `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
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
