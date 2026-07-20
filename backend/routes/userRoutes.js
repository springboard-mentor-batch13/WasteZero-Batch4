import express from 'express';
import { getUserProfile, updateUserProfile, updateUserRole } from '../controller/authController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { validateUpdateProfile } from '../middleware/validationMiddleware.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateUserProfile);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
