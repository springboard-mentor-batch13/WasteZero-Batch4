import express from 'express';
const router = express.Router();
import { 
  getMatchedOpportunities, 
  getMessages, 
  getNotifications 
} from '../controller/matchCommunicationController.js';

router.get('/match', getMatchedOpportunities);
router.get('/messages/:user1/:user2', getMessages);
router.get('/notifications/:userId', getNotifications);

export default router;