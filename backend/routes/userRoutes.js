import express from 'express';
import { getUserProfile, updateUserProfile, changePassword } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validationMiddleware.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateUserProfile);
router.put('/password', protect, validateChangePassword, changePassword);

export default router;
