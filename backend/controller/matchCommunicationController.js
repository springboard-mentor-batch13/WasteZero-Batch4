import Opportunity from '../models/Opportunity.js';
import Message from '../models/Message.js';

// 1. Volunteer Matching Algorithm
export const getMatchedOpportunities = async (req, res) => {
  try {
    const volunteer = req.user; // Authenticated user attached by protect middleware

    // Fetch all active open opportunities
    const opportunities = await Opportunity.find({ status: 'open' });

    // Calculate dynamic match scores using volunteer profile
    const scoredOpportunities = opportunities.map((opp) => {
      let score = 0;

      // Factor 1: Waste Type Match (40% Weight)
      const userWaste = volunteer.preferredWasteTypes || volunteer.wasteTypes || [];
      const oppWaste = opp.wasteTypes || opp.waste_types || [];
      const commonWaste = userWaste.filter((type) => oppWaste.includes(type));
      if (commonWaste.length > 0) {
        score += 40 * (commonWaste.length / Math.max(oppWaste.length, 1));
      }

      // Factor 2: Skills Match (40% Weight)
      const userSkills = volunteer.skills || [];
      const oppSkills = opp.required_skills || opp.requiredSkills || [];
      const commonSkills = userSkills.filter((skill) => oppSkills.includes(skill));
      if (commonSkills.length > 0) {
        score += 40 * (commonSkills.length / Math.max(oppSkills.length, 1));
      }

      // Factor 3: Location Match (20% Weight)
      if (
        volunteer.location &&
        opp.location &&
        volunteer.location.toLowerCase().trim() === opp.location.toLowerCase().trim()
      ) {
        score += 20;
      }

      return {
        ...opp._doc,
        matchScore: Math.round(score),
      };
    });

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

    // Mark unread incoming messages as read
    await Message.updateMany(
      { sender_id: otherUserId, receiver_id: currentUserId, readAt: null },
      { $set: { readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse(),
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
