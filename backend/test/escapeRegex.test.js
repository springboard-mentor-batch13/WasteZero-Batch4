import assert from 'node:assert/strict';
import escapeRegex from '../utils/escapeRegex.js';

assert.equal(escapeRegex('(a+)+$'), '\\(a\\+\\)\\+\\$');
assert.equal(escapeRegex('Noida'), 'Noida');
assert.equal(escapeRegex('beach.cleanup?'), 'beach\\.cleanup\\?');

console.log('escapeRegex tests passed');
