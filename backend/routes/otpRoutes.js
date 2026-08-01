import express from 'express';
import {
  resetForgotPassword,
  sendForgotPasswordOtp,
  sendOtp,
  sendRegisterOtp,
  verifyOtpAndChangePassword,
} from '../controller/otpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendOtp);
router.post('/verify-and-change', protect, verifyOtpAndChangePassword);
router.post('/forgot-password/send', sendForgotPasswordOtp);
router.post('/forgot-password/reset', resetForgotPassword);
router.post('/register/send', sendRegisterOtp);

export default router;
