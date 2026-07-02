import express from 'express';
import {
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All user routes require authentication.
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin-only user management.
router.get('/', authorize('admin'), listUsers);
router.get('/:id', authorize('admin'), getUserById);

export default router;
