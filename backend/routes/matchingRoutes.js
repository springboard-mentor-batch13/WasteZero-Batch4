import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMatchSuggestions } from '../controller/matchingController.js';

const router = express.Router();

router.get('/', protect, getMatchSuggestions);

export default router;
