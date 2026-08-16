import test from 'node:test';
import assert from 'node:assert/strict';
import AdminLog from '../models/AdminLog.js';
import { rowsToCsv } from '../utils/csv.js';

test('AdminLog contains the required persistent audit fields', () => {
  assert.ok(AdminLog.schema.path('action'));
  assert.ok(AdminLog.schema.path('user_id'));
  assert.ok(AdminLog.schema.path('createdAt'));
});

test('CSV reporting escapes commas and quotes', () => {
  const csv = rowsToCsv(['category', 'metric', 'value'], [['users', 'active, total', '10" users']]);
  assert.equal(csv, '"category","metric","value"\n"users","active, total","10"" users"');
});
