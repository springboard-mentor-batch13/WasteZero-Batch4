import express from 'express';
import {
  createPickup,
  getPickups,
  updatePickupStatus,
  acceptPickup,
  rejectPickup,
} from '../controller/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPickups)
  .post(protect, createPickup);

router.patch('/:id/status', protect, updatePickupStatus);
router.patch('/:id/accept', protect, acceptPickup);
router.patch('/:id/reject', protect, rejectPickup);

export default router;
