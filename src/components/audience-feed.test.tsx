import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { AudienceProofBar, AUDIENCE_METRICS } from './AudienceProofBar';
import { FeedConnect } from './FeedConnect';
import { GET as getAudienceStats } from '../app/api/audience/stats/route';
import { POST as postSubscribePush } from '../app/api/audience/subscribe-push/route';
import { NextRequest } from 'next/server';

test('AudienceProofBar renders verified channels: X, LinkedIn, Instagram, Facebook, and Device Push', () => {
  const html = renderToStaticMarkup(<AudienceProofBar />);
  assert.ok(html.includes('data-testid="audience-proof-bar"'));
  assert.ok(html.includes('X / Twitter'));
  assert.ok(html.includes('LinkedIn'));
  assert.ok(html.includes('Instagram'));
  assert.ok(html.includes('Facebook'));
  assert.ok(html.includes('Device Push'));
  assert.ok(html.includes('https://x.com/Greybrainlens'));
  assert.ok(html.includes('https://www.linkedin.com/company/146956056/'));
  assert.ok(html.includes('https://www.instagram.com/greybrainlens'));
  assert.ok(html.includes('https://www.facebook.com/profile.php?id=61596601130152'));
});

test('FeedConnect renders Composio-style delivery rails for X, LinkedIn, Instagram, Facebook, and PWA lockscreen push', () => {
  const html = renderToStaticMarkup(<FeedConnect />);
  assert.ok(html.includes('data-testid="feed-connect-card"'));
  assert.ok(html.includes('Read where you already live'));
  assert.ok(html.includes('Device Lockscreen (PWA)'));
  assert.ok(html.includes('𝕏 (Twitter) Feed'));
  assert.ok(html.includes('LinkedIn Research'));
  assert.ok(html.includes('Instagram Slides'));
  assert.ok(html.includes('Facebook Page'));
  // Ensure no Discord, Slack, WhatsApp, or Telegram are present as requested
  assert.ok(!html.includes('Discord'));
  assert.ok(!html.includes('Slack'));
  assert.ok(!html.includes('WhatsApp'));
  assert.ok(!html.includes('Telegram'));
});

test('GET /api/audience/stats returns JSON metrics and channel configurations', async () => {
  const res = await getAudienceStats();
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.total === 'number' && data.total > 0);
  assert.ok(Array.isArray(data.channels) && data.channels.length === 5);
  const channelIds = data.channels.map((c: any) => c.id);
  assert.deepEqual(channelIds, ['x', 'linkedin', 'instagram', 'facebook', 'pwa']);
});

test('POST /api/audience/subscribe-push accepts push registration with receipt', async () => {
  const req = new NextRequest('https://movies.greybrain.in/api/audience/subscribe-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: 'pwa',
      endpoint: 'https://fcm.googleapis.com/fcm/send/sample-token',
    }),
  });
  const res = await postSubscribePush(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.status, 'active');
  assert.ok(data.receipt.startsWith('pwa_'));
});
