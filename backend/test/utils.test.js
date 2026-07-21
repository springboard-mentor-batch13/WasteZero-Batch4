import assert from 'node:assert/strict';
import escapeRegex from '../utils/escapeRegex.js';
import parseSkills from '../utils/parseSkills.js';

assert.equal(escapeRegex('(a+)+$'), '\\(a\\+\\)\\+\\$');
assert.equal(escapeRegex('Noida'), 'Noida');

assert.deepEqual(parseSkills(''), []);
assert.deepEqual(parseSkills('[]'), []);
assert.deepEqual(parseSkills('["teamwork","sorting"]'), ['teamwork', 'sorting']);
assert.deepEqual(parseSkills('teamwork, sorting'), ['teamwork', 'sorting']);

console.log('backend utility tests passed');
