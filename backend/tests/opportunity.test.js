import test from 'node:test';
import assert from 'node:assert/strict';
import Opportunity from '../models/Opportunity.js';
import {
  opportunityErrorResponse,
  parseArrayField,
  validateOpportunityPayload,
} from '../utils/opportunityValidation.js';

test('Opportunity schema persists indexed waste types', () => {
  const path = Opportunity.schema.path('wasteTypes');
  assert.ok(path);
  assert.deepEqual(path.caster.enumValues, [
    'Plastic', 'Glass', 'Electronic Waste', 'Paper', 'Metal', 'Organic Waste', 'Other',
  ]);
  assert.ok(Opportunity.schema.indexes().some(([fields]) => fields.wasteTypes === 1));
});

test('opportunity arrays accept JSON and normalize values', () => {
  assert.deepEqual(parseArrayField('["Plastic", " Paper "]', 'wasteTypes'), ['Plastic', 'Paper']);
  assert.throws(() => parseArrayField('{"bad":true}', 'wasteTypes'), /valid JSON array/);
});

test('create validation reports missing required fields as a 400', () => {
  assert.throws(
    () => validateOpportunityPayload({ title: '', description: '', location: '' }),
    (error) => error.statusCode === 400 && error.message.includes('title is required'),
  );
});

test('partial update rejects empty required fields and invalid status', () => {
  assert.throws(
    () => validateOpportunityPayload({ location: ' ', status: 'invalid' }, { partial: true }),
    (error) => error.statusCode === 400 && error.message.includes('location is required'),
  );
});

test('mongoose validation errors are exposed as client errors', () => {
  const response = opportunityErrorResponse({ name: 'ValidationError', message: 'Invalid opportunity' }, 'fallback');
  assert.deepEqual(response, { status: 400, message: 'Invalid opportunity' });
});
