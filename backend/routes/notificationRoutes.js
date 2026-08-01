import express from 'express';
import {
  getNotifications,
  markAllNotificationsRead,
} from '../controller/notificationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', protect, getNotifications);

// Mark all notifications as read
router.patch('/read-all', protect, markAllNotificationsRead);

export default router;