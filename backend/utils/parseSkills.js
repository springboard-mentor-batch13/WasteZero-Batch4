const parseSkills = (skills) => {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills !== 'string' || !skills.trim()) return [];

  try {
    const parsed = JSON.parse(skills);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
  }
};

export default parseSkills;
