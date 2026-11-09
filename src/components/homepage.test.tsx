import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeContent } from '../app/page';
import type { SiteArticle } from '../lib/articleTypes';

test('homepage presents multiple real categories without a featured-film takeover', () => {
  const articles = ['review', 'brief', 'insight', 'comparison'].map((kind, i) => ({
    id: String(i), title: `Saved title ${i}`, slug: `saved-${i}`, kind, categoryLabel: kind,
    excerpt: 'Saved editorial finding', verdict: '', status: 'published', publishedAt: null,
    historicalArchive: true, coverImageUrl: `https://example.com/${i}.jpg`,
  } as SiteArticle));
  const html = renderToStaticMarkup(<HomeContent articles={articles} />);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const article of articles) assert.ok(html.includes(`/reviews/${article.slug}`));
  for (const id of ['review', 'brief', 'insight', 'comparison']) assert.ok(html.includes(`id="${id}"`));
  assert.ok(!html.includes('featured-heading'));
  assert.ok(html.includes('Archive'));
  const raw = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  const schema = JSON.parse(raw!);
  assert.equal(schema['@type'], 'CollectionPage');
  assert.equal(schema.mainEntity.itemListElement.length, 4);
  assert.ok(!raw!.includes('aggregateRating'));
});

test('empty homepage does not invent reports or scores', () => {
  const html = renderToStaticMarkup(<HomeContent articles={[]} />);
  assert.ok(html.includes('temporarily unavailable'));
  assert.ok(!html.includes('id="review"'));
});
