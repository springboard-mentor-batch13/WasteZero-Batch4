import express from 'express';
import { createPickup, getPickups, updatePickupStatus } from '../controller/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPickups)
  .post(protect, createPickup);

router.patch('/:id/status', protect, updatePickupStatus);

export default router;
