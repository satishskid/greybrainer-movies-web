import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { AudienceProofBar, VERIFIED_CHANNELS } from './AudienceProofBar';
import { FeedConnect } from './FeedConnect';
import { GET as getAudienceStats } from '../app/api/audience/stats/route';
import { POST as postSubscribePush } from '../app/api/audience/subscribe-push/route';

test('AudienceProofBar renders verified channels: X, LinkedIn, Instagram, and Facebook without fabricated numbers', () => {
  const html = renderToStaticMarkup(<AudienceProofBar />);
  assert.ok(html.includes('data-testid="audience-proof-bar"'));
  assert.ok(html.includes('Direct Editorial Feeds'));
  assert.ok(html.includes('https://x.com/Greybrainlens'));
  assert.ok(html.includes('https://www.linkedin.com/company/146956056/'));
  assert.ok(html.includes('https://www.instagram.com/greybrainlens'));
  assert.ok(html.includes('https://www.facebook.com/profile.php?id=61596601130152'));
  // Ensure no fabricated numbers or claims exist
  assert.ok(!html.includes('5,320'));
  assert.ok(!html.includes('1.4k'));
  assert.ok(!html.includes('1.8k'));
});

test('FeedConnect renders verified delivery rails for X, LinkedIn, Instagram, and Facebook', () => {
  const html = renderToStaticMarkup(<FeedConnect />);
  assert.ok(html.includes('data-testid="feed-connect-card"'));
  assert.ok(html.includes('Read where you already live'));
  assert.ok(html.includes('𝕏 (Twitter) Feed'));
  assert.ok(html.includes('LinkedIn Research'));
  assert.ok(html.includes('Instagram Slides'));
  assert.ok(html.includes('Facebook Page'));
  assert.ok(html.includes('Device Push Notifications:'));
  assert.ok(html.includes('Currently in development'));
  // Ensure no unrequested channels exist
  assert.ok(!html.includes('Discord'));
  assert.ok(!html.includes('Slack'));
  assert.ok(!html.includes('WhatsApp'));
  assert.ok(!html.includes('Telegram'));
});

test('GET /api/audience/stats returns verified channels without fabricated counts', async () => {
  const res = await getAudienceStats();
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.countsVerified, false);
  assert.ok(Array.isArray(data.channels) && data.channels.length === 4);
  const channelIds = data.channels.map((c: any) => c.id);
  assert.deepEqual(channelIds, ['x', 'linkedin', 'instagram', 'facebook']);
  assert.ok(data.note.includes('Follower counts are not fabricated'));
});

test('POST /api/audience/subscribe-push fails closed (501) rather than emitting a synthetic success receipt', async () => {
  const res = await postSubscribePush();
  assert.equal(res.status, 501);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.status, 'unsupported');
  assert.ok(data.error.includes('No subscription was stored'));
});
