import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createMessage, getContacts, getConversation } from '../controller/messageController.js';

const router = express.Router();

router.use(protect);
router.get('/contacts', getContacts);
router.get('/:userId', getConversation);
router.post('/:userId', createMessage);

export default router;
