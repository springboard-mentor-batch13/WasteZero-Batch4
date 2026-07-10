import express from 'express';

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getUserApplications,
} from '../controller/opportunityController.js';

import { protect, ngoOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getOpportunities)
  .post(protect, ngoOrAdmin, createOpportunity);

router.get('/my-applications', protect, getUserApplications);

router
  .route('/:id')
  .get(protect, getOpportunityById)
  .put(protect, ngoOrAdmin, updateOpportunity)
  .delete(protect, ngoOrAdmin, deleteOpportunity);

router.post('/:id/apply', protect, applyForOpportunity);

export default router;