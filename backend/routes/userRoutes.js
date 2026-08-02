import express from 'express';
import { getUserProfile, updateUserProfile, updateAvailability } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUpdateProfile } from '../middleware/validationMiddleware.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateUserProfile);
router.patch('/availability', protect, updateAvailability);

export default router;