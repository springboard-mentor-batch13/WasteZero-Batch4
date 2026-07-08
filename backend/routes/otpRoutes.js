import express from 'express';
import { sendOtp, verifyOtpAndChangePassword } from '../controller/otpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendOtp);
router.post('/verify-and-change', protect, verifyOtpAndChangePassword);

export default router;