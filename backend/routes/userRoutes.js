import express from 'express';
import { getUserProfile, updateUserProfile } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
