import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicImage } from './public-image';

test('public media cannot read draft payloads, arbitrary paths or active SVG content', async () => {
  for (const key of ['drafts/private.json', 'knowledge/report.md', 'draft-assets/draft_x/../private.png', 'draft-assets/draft_x/cover.svg', 'draft-assets%2Fdraft_x%2Fcover.png']) {
    const response = await publicImage(key, async () => { throw new Error('Must not contact backend'); });
    assert.equal(response.status, 404);
  }
});
test('public media forwards only the image key and never forwards backend cookies', async () => {
  const response = await publicImage('draft-assets/draft_x/cover-123.png', async path => {
    assert.equal(path, '/api/assets/draft-assets%2Fdraft_x%2Fcover-123.png');
    return new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'content-type': 'image/png', 'set-cookie': 'private=bad' } });
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal((await response.arrayBuffer()).byteLength, 4);
});
test('non-image storage objects are refused even when the filename looks like an image', async () => {
  const response = await publicImage('draft-assets/draft_x/cover.png', async () => new Response('{}', { headers: { 'content-type': 'application/json' } }));
  assert.equal(response.status, 415);
});
