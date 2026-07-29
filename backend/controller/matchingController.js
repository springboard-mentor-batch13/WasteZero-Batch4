import Opportunity from '../models/Opportunity.js';

const normalize = (value) => String(value || '').trim().toLowerCase();

const scoreOpportunity = (opportunity, user) => {
  const userSkills = new Set((user.skills || []).map(normalize).filter(Boolean));
  const preferredWasteTypes = new Set((user.waste_types || []).map(normalize).filter(Boolean));
  const opportunitySkills = (opportunity.required_skills || []).map(normalize).filter(Boolean);
  const opportunityWasteTypes = (opportunity.waste_types || []).map(normalize).filter(Boolean);

  const matchedSkills = opportunitySkills.filter((skill) => userSkills.has(skill));
  const matchedWasteTypes = opportunityWasteTypes.filter((type) => preferredWasteTypes.has(type));
  const sameLocation =
    Boolean(normalize(user.location)) &&
    (normalize(opportunity.location).includes(normalize(user.location)) ||
      normalize(user.location).includes(normalize(opportunity.location)));

  let score = 0;
  if (opportunitySkills.length) score += (matchedSkills.length / opportunitySkills.length) * 45;
  if (opportunityWasteTypes.length) {
    score += (matchedWasteTypes.length / opportunityWasteTypes.length) * 35;
  } else if (matchedSkills.length) {
    score += 15;
  }
  if (sameLocation) score += 20;

  return {
    opportunity,
    score: Math.round(Math.min(score, 100)),
    reasons: [
      ...(sameLocation ? [`Near ${user.location}`] : []),
      ...(matchedWasteTypes.length ? [`Waste: ${matchedWasteTypes.join(', ')}`] : []),
      ...(matchedSkills.length ? [`Skills: ${matchedSkills.join(', ')}`] : []),
    ],
  };
};

const getMatchSuggestions = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Match suggestions are available to volunteers' });
    }

    const opportunities = await Opportunity.find({ status: 'open' })
      .populate('ngo_id', 'name email')
      .sort({ createdAt: -1 });

    const matches = opportunities
      .map((opportunity) => scoreOpportunity(opportunity, req.user))
      .sort((a, b) => b.score - a.score || b.opportunity.createdAt - a.opportunity.createdAt);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getMatchSuggestions };
