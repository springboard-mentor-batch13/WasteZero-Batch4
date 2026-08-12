import express from 'express';
import { chatbotMessage } from '../controller/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Rate limit: 10 messages per 15 minutes per IP
const chatbotRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: parseInt(process.env.CHATBOT_RATE_LIMIT_MAX) || 10,
});

router.post('/message', protect, chatbotRateLimit, chatbotMessage);

export default router;