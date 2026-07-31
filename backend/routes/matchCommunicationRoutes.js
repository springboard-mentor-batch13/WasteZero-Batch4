import express from 'express';
const router = express.Router();
import { 
  getConversationContacts,
  getMatchedOpportunities, 
  getMessages, 
  getNotifications 
} from '../controller/matchCommunicationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/match', protect, getMatchedOpportunities);
router.get('/contacts', protect, getConversationContacts);
router.get('/messages/:user1/:user2', protect, getMessages);
router.get('/notifications/:userId', protect, getNotifications);

export default router;
