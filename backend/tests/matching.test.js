import test from 'node:test';
import assert from 'node:assert/strict';
import { mapOpportunityMatch } from '../utils/matchOpportunity.js';

test('matching maps score and organization fields expected by the UI', () => {
  const match = mapOpportunityMatch({
    _id: 'opp-1',
    title: 'Cleanup',
    wasteTypes: ['Plastic'],
    required_skills: ['Sorting'],
    location: 'Pune',
    ngo_id: { name: 'Green NGO' },
  }, {
    preferredWasteTypes: ['plastic'],
    skills: ['sorting'],
    location: ' pune ',
  });

  assert.equal(match.matchScore, 100);
  assert.equal(match.percentage, 100);
  assert.equal(match.organization, 'Green NGO');
});

test('matching safely returns zero for an unrelated opportunity', () => {
  const match = mapOpportunityMatch({ wasteTypes: [], required_skills: [], location: 'Delhi' }, { location: 'Pune' });
  assert.equal(match.matchScore, 0);
  assert.equal(match.percentage, 0);
});
