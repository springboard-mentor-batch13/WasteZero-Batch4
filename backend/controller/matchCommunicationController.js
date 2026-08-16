import Opportunity from '../models/Opportunity.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getAllowedContactIds, canCommunicateWith, getSupportAdmin } from '../utils/communicationAccess.js';

import { decryptMessage, MessageDecryptionError } from '../utils/encryption.js';
import { mapOpportunityMatch } from '../utils/matchOpportunity.js';

const UNAVAILABLE_MESSAGE = 'Encrypted message unavailable';

// A key rotation or one damaged legacy record must not take the whole
// conversations API offline. Never expose ciphertext to the client; mark the
// affected record so the UI can explain why only that message is unavailable.
const decryptForResponse = (content) => {
  try {
    return { content: decryptMessage(content), decryptionError: false };
  } catch (error) {
    if (!(error instanceof MessageDecryptionError)) throw error;
    return { content: UNAVAILABLE_MESSAGE, decryptionError: true };
  }
};

// 1. Volunteer Matching Algorithm
export const getMatchedOpportunities = async (req, res) => {
  try {
    const volunteer = req.user; // Authenticated user attached by protect middleware

    // Fetch all active open opportunities
    const opportunities = await Opportunity.find({ status: 'open' }).populate('ngo_id', 'name');

    // Calculate dynamic match scores using volunteer profile
    const scoredOpportunities = opportunities.map((opp) => mapOpportunityMatch(opp, volunteer));

    // Sort opportunities by highest match score first
    scoredOpportunities.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: scoredOpportunities.length,
      data: scoredOpportunities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Messages (Secured to Logged-in User + Ownership Check)
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id; // Securely extract current user
    const { userId: otherUserId } = req.params; // Person they are chatting with

    const allowed = await canCommunicateWith(req.user, otherUserId);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'You can only message this contact once a volunteer application has been accepted.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Fetch messages where logged-in user is strictly a participant
 const messages = await Message.find({
  $or: [
    { sender_id: currentUserId, receiver_id: otherUserId },
    { sender_id: otherUserId, receiver_id: currentUserId },
  ],
})
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

const decryptedMessages = messages.map((message) => ({
  ...message.toObject(),
  ...decryptForResponse(message.content),
}));

res.status(200).json({
  success: true,
  data: decryptedMessages.reverse(),
  page,
  limit,
});

} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};
export const getSupportContact = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admins do not have a support contact.' });
    }

    const admin = await getSupportAdmin();
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No support agent is available right now.' });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const allowedIds = await getAllowedContactIds(req.user);

    const contacts = await User.find({ _id: { $in: allowedIds } })
      .select('name email role')
      .lean();

    // Get last message for each contact
    const contactsWithMessages = await Promise.all(
      contacts.map(async (contact) => {
        const lastMsg = await Message.findOne({
          $or: [
            { sender_id: req.user._id, receiver_id: contact._id },
            { sender_id: contact._id, receiver_id: req.user._id },
          ],
        }).sort({ createdAt: -1 }).lean();

        const preview = lastMsg
          ? decryptForResponse(lastMsg.content)
          : { content: '', decryptionError: false };

        return {
          ...contact,
          lastMessage: preview.content,
          lastMessageUnavailable: preview.decryptionError,
          lastMessageAt: lastMsg?.createdAt || null,
        };
      })
    );

    res.json({ success: true, data: contactsWithMessages });
  } catch (error) {
     console.error(error); 
    res.status(500).json({ success: false, message: error.message });
  }
};
