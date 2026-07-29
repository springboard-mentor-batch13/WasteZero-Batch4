import express from 'express';
import { ngoOrAdmin, protect, volunteerOnly } from '../middleware/authMiddleware.js';
import {
  cancelPickup,
  createPickup,
  getPickups,
  updatePickupStatus,
} from '../controller/pickupController.js';

const router = express.Router();

router.get('/', protect, getPickups);
router.post('/', protect, volunteerOnly, createPickup);
router.patch('/:id/status', protect, ngoOrAdmin, updatePickupStatus);
router.patch('/:id/cancel', protect, volunteerOnly, cancelPickup);

export default router;
