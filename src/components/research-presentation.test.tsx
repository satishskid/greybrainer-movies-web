import { test } from 'node:test';
const expect = (value: string) => ({ toContain: (part: string) => assert.ok(value.includes(part), part) });
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MorphokineticsWaveform } from './MorphokineticsWaveform';
import { CraftmaticsReport } from './CraftmaticsReport';
import { ImageCredits } from './ImageCredits';
import { ReviewArticle } from '../app/reviews/[slug]/ReviewArticle';
import type { SiteArticle } from '../lib/articleTypes';

test('missing research never produces a fabricated waveform', () => {
  const html = renderToStaticMarkup(<MorphokineticsWaveform movieTitle="Fixture" />);
  assert.ok(html.includes('not available'));
  assert.ok(!html.includes('<svg'));
  assert.ok(!html.includes('Scene 42'));
});
test('saved positions and intensity produce an accessible graph and textual evidence', () => {
  const html = renderToStaticMarkup(<MorphokineticsWaveform movieTitle="Fixture" teaserText="Saved research interpretation." moments={[{ position: 0.1, intensity: 3, event: 'Opening pressure' }, { position: 0.8, intensity: 9, event: 'Earned confrontation' }]} />);
  assert.ok(html.includes('<svg'));
  assert.ok(html.includes('Earned confrontation'));
  assert.ok(html.includes('not measured audience retention'));
  assert.ok(html.indexOf('<svg') < html.indexOf('Saved research interpretation.'));
  assert.ok(html.includes('<details'));
  assert.ok(!html.includes('<details open'));
});
test('unreviewed craft proposal is unscored', () => {
  const html = renderToStaticMarkup(<CraftmaticsReport criteria={[{ id: 'motivation', label: 'Character motivation', department: 'Screenplay', status: 'proposal', score: 4, evidence: 'A proposed observation', contributors: [] }]} />);
  assert.ok(html.includes('Unscored'));
  assert.ok(!html.includes('4/4'));
});

test('reviewed scores say whether the editor accepted or adjusted the AI proposal', () => {
  const base = { id: 'motivation', label: 'Character motivation', department: 'Screenplay', status: 'reviewed', score: 3, evidence: 'Evidence quote long enough', contributors: [] };
  expect(renderToStaticMarkup(<CraftmaticsReport criteria={[{ ...base, decision: 'accepted' }]} />)).toContain('AI-proposed, editor accepted');
  expect(renderToStaticMarkup(<CraftmaticsReport criteria={[{ ...base, decision: 'adjusted', rationale: 'Set up too late.' }]} />)).toContain('Editor-adjusted');
});

test('TMDB film images carry a logo and a credits link even without saved attribution', () => {
  const html = renderToStaticMarkup(<ImageCredits imageUrl="https://image.tmdb.org/t/p/w1280/poster.jpg" />);
  assert.ok(html.includes('/tmdb-logo.svg'));
  assert.ok(html.includes('href="/credits"'));
  assert.ok(html.includes('https://www.themoviedb.org'));
  assert.equal(renderToStaticMarkup(<ImageCredits />), '');
});

test('custom image attribution remains visible without claiming TMDB provenance', () => {
  const html = renderToStaticMarkup(<ImageCredits attribution="Still supplied by the producer." imageUrl="https://example.com/still.jpg" />);
  assert.ok(html.includes('Still supplied by the producer.'));
  assert.ok(!html.includes('/tmdb-logo.svg'));
});

test('public article has one main heading and keeps login email private', () => {
  const article: SiteArticle = {
    id: 'fixture', title: 'Fixture review', slug: 'fixture', kind: 'review', categoryLabel: 'Review',
    content: '# Saved report heading\n\n## Section\n\nSource-bound report.', editorial: null, excerpt: 'Report',
    contentHtml: '<h1>Saved report heading</h1><h2>Section</h2><p>Source-bound report.</p>',
    createdBy: 'writer@gmail.com', publishedAt: '2026-10-11T00:00:00Z', publishedAtMs: 0,
    source: 'cloudflare', status: 'published', tags: [], type: 'review', faqs: [],
    relatedSlugs: [], inlineImageUrls: [], diagnosticImages: [],
    layers: [{ label: 'Story / Script', score: 5.5 }, { label: 'Direction / Orchestration', score: 5.5 }, { label: 'Performance / Execution', score: 6 }],
  };
  const html = renderToStaticMarkup(<ReviewArticle article={article} />);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<h2>Saved report heading</h2>') && html.includes('<h3>Section</h3>'), 'report headings shift down one level, text intact');
  assert.ok(!html.includes('writer@gmail.com'));
  assert.ok(html.includes('not measured audience data'));
  assert.ok(html.includes('Direction / Orchestration') && html.includes('Published 11 October 2026'));
  assert.ok(html.indexOf('Three-layer assessment') < html.indexOf('Morphokinetics') && html.indexOf('Morphokinetics') < html.indexOf('Craftmatics') && html.indexOf('Craftmatics') < html.indexOf('Full research'));
  assert.ok(html.includes('No editor-reviewed revisions yet'));

  const pending = renderToStaticMarkup(<ReviewArticle article={{ ...article, status: 'pending_verification' }} />);
  assert.ok(pending.includes('not yet verified live') && !pending.includes('Published 11 October'));
});
