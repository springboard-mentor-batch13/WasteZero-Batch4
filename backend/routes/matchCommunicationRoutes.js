import express from 'express';

import {
  getMatchedOpportunities,
  getMessages
} from '../controller/matchCommunicationController.js';

import {
  protect,
  volunteerOnly
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Logged-in volunteers only
router.get('/matches',protect,volunteerOnly,getMatchedOpportunities);

// Logged-in users can only fetch a conversation involving themselves
router.get(
  '/messages/:userId',
  protect,
  getMessages
);

export default router;
