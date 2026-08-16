const overlapScore = (preferred, available, weight) => {
  const normalizedAvailable = available.map((item) => String(item).toLowerCase());
  const common = preferred.filter((item) => normalizedAvailable.includes(String(item).toLowerCase()));
  return common.length ? weight * (common.length / Math.max(available.length, 1)) : 0;
};

export const mapOpportunityMatch = (opportunity, volunteer) => {
  const source = opportunity.toObject ? opportunity.toObject() : opportunity;
  const volunteerWaste = volunteer.preferredWasteTypes || volunteer.wasteTypes || [];
  const opportunityWaste = source.wasteTypes || source.waste_types || [];
  const volunteerSkills = volunteer.skills || [];
  const opportunitySkills = source.required_skills || source.requiredSkills || [];

  let score = overlapScore(volunteerWaste, opportunityWaste, 40);
  score += overlapScore(volunteerSkills, opportunitySkills, 40);
  if (
    volunteer.location &&
    source.location &&
    volunteer.location.toLowerCase().trim() === source.location.toLowerCase().trim()
  ) score += 20;

  const matchScore = Math.round(score);
  return {
    ...source,
    matchScore,
    percentage: matchScore,
    organization: source.ngo_id?.name || 'WasteZero NGO',
  };
};
