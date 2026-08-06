import express from 'express';
import {
  resetForgotPassword,
  sendForgotPasswordOtp,
  sendOtp,
  sendRegisterOtp,
  verifyOtpAndChangePassword,
} from '../controller/otpController.js';
import { protect } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();
const otpLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });

router.post('/send', otpLimiter, protect, sendOtp);
router.post('/verify-and-change', otpLimiter, protect, verifyOtpAndChangePassword);
router.post('/forgot-password/send', otpLimiter, sendForgotPasswordOtp);
router.post('/forgot-password/reset', otpLimiter, resetForgotPassword);
router.post('/register/send', otpLimiter, sendRegisterOtp);

export default router;
