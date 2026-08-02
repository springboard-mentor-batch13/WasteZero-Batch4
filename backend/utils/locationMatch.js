const normalize = (loc) => (loc || '').toLowerCase().trim();

const wordsOf = (loc) =>
  new Set(
    normalize(loc)
      .split(/[\s,]+/)
      .filter(Boolean),
  );

export const locationMatchScore = (a, b) => {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 100;
  if (na.includes(nb) || nb.includes(na)) return 60;

  const wordsA = wordsOf(a);
  const wordsB = wordsOf(b);
  for (const word of wordsA) {
    if (word.length > 2 && wordsB.has(word)) return 40;
  }
  return 0;
};