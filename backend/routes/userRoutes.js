import express from 'express';
import { getUserProfile, updateUserProfile } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUpdateProfile } from '../middleware/validationMiddleware.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateUserProfile);

export default router;
