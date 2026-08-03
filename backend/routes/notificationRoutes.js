import express from 'express';
import {
  getNotifications,
  markAllNotificationsRead,
  clearNotifications,
} from '../controller/notificationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', protect, getNotifications);

// Mark all notifications as read
router.patch('/read-all', protect, markAllNotificationsRead);

// Delete all notifications for the logged-in user
router.delete('/', protect, clearNotifications);

export default router;