import { test } from 'node:test';
import assert from 'node:assert/strict';
import robots from './robots';
import { NOINDEX } from '@/lib/site';

test('public uploaded covers are crawlable without allowing private APIs; previews remain blocked', () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
  if (NOINDEX) assert.equal(rules.disallow, '/');
  else {
    assert.deepEqual(rules.allow, ['/', '/api/assets/']);
    assert.deepEqual(rules.disallow, ['/api']);
  }
});
