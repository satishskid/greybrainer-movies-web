import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storefrontOriginAllowed, storefrontResponse } from './storefront-origin';
import { publicProxy } from '../../worker/public-proxy';
import engineRedirect from '../../worker/engine-redirect';

test('the public frontend denies direct workers.dev access without its relay secret', () => {
  const upstream = 'https://greybrainer-storefront.satish-9f4.workers.dev/';
  assert.equal(storefrontOriginAllowed(new Request(upstream), 'secret'), false);
  assert.equal(storefrontOriginAllowed(new Request(upstream, { headers: { 'x-greybrainer-public-relay': 'wrong' } }), 'secret'), false);
  assert.equal(storefrontOriginAllowed(new Request(upstream, { headers: { 'x-greybrainer-public-relay': 'secret' } }), 'secret'), true);
  assert.equal(storefrontOriginAllowed(new Request('https://movies.greybrain.in/')), true);
  assert.equal(storefrontResponse(new Request(upstream), new Response('article')).headers.get('x-robots-tag'), 'noindex, nofollow');
});
test('the public proxy never forwards private routes or author credentials', async () => {
  const never = (() => { throw new Error('Must not fetch'); }) as typeof fetch;
  for (const path of ['/api/drafts', '/api/auth/me', '/api/ai-keys', '/studio/manual', '/hub']) {
    assert.equal((await publicProxy(new Request(`https://movies.greybrain.in${path}`), { PUBLIC_RELAY_TOKEN: 'secret' }, never)).status, 404);
  }
  const response = await publicProxy(new Request('https://movies.greybrain.in/reviews?x=1', { headers: { cookie: 'private', authorization: 'private', 'cf-access-jwt-assertion': 'private', rsc: '1' } }), { PUBLIC_RELAY_TOKEN: 'secret' }, (async (url, init) => {
    assert.equal(url, 'https://greybrainer-storefront.satish-9f4.workers.dev/reviews?x=1');
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('cookie'), null);
    assert.equal(headers.get('authorization'), null);
    assert.equal(headers.get('cf-access-jwt-assertion'), null);
    assert.equal(headers.get('rsc'), '1');
    assert.equal(headers.get('x-greybrainer-public-relay'), 'secret');
    return new Response('article', { headers: { 'set-cookie': 'private', 'x-robots-tag': 'noindex, nofollow' } });
  }) as typeof fetch);
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(response.headers.get('x-robots-tag'), null);
});
test('enquiries need same origin and bounded bodies; other writes and missing relay secrets fail closed', async () => {
  assert.equal((await publicProxy(new Request('https://movies.greybrain.in/'), {})).status, 503);
  assert.equal((await publicProxy(new Request('https://movies.greybrain.in/api/studio-diagnostic', { method: 'POST', body: '{}' }), { PUBLIC_RELAY_TOKEN: 'secret' })).status, 403);
  assert.equal((await publicProxy(new Request('https://movies.greybrain.in/api/studio-diagnostic', { method: 'POST', headers: { origin: 'https://movies.greybrain.in' }, body: 'x'.repeat(32769) }), { PUBLIC_RELAY_TOKEN: 'secret' })).status, 413);
  assert.equal((await publicProxy(new Request('https://movies.greybrain.in/reviews', { method: 'POST' }), { PUBLIC_RELAY_TOKEN: 'secret' })).status, 405);
});
test('engine bookmarks redirect to the protected origin without proxying identities or changing the public site', async () => {
  const response = engineRedirect.fetch(new Request('https://engine.greybrain.in/engine/studio/inbox?x=1'));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://greybrainer-production.satish-9f4.workers.dev/studio/inbox?x=1');
  assert.equal(engineRedirect.fetch(new Request('https://movies.greybrain.in/')).status, 404);
  for (const path of ['/', '/engine', '/engine/']) assert.equal(engineRedirect.fetch(new Request(`https://engine.greybrain.in${path}`)).headers.get('location'), 'https://greybrainer-production.satish-9f4.workers.dev/studio/inbox');
});
