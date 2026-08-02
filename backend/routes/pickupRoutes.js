import express from 'express';
import {
  createPickup,
  getPickups,
  updatePickupStatus,
  getPickupCandidates,
  offerPickup,
  respondToOffer,
} from '../controller/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPickups)
  .post(protect, createPickup);

router.patch('/:id/status', protect, updatePickupStatus);
router.get('/:id/candidates', protect, getPickupCandidates);
router.patch('/:id/offer', protect, offerPickup);
router.patch('/:id/respond', protect, respondToOffer);

export default router;