import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkReleaseSeo, releaseSeoOptions, releaseSeoSummary } from './check-release-seo.mjs';

const origin = 'https://movies.greybrain.in';
const articlePath = '/reviews/fixture';

test('output options accept a temporary JSON report and reject invalid arguments', () => {
  assert.deepEqual(releaseSeoOptions(['--output', '/private/tmp/seo.json', `--article=${articlePath}`]),
    { output: '/private/tmp/seo.json', articlePath });
  assert.deepEqual(releaseSeoOptions([]), {});
  for (const args of [['--output'], ['--output', '/etc/report.json'], ['--output', '/private/tmp/../report.json'], ['--unknown']]) {
    assert.throws(() => releaseSeoOptions(args));
  }
});

test('default summary does not dump full page or schema content', async () => {
  const report = await fixture().run();
  const summary = releaseSeoSummary(report);
  assert.match(summary, /0 blockers, 0 warnings; 3 pages checked/);
  assert.ok(!summary.includes('datePublished'));
  assert.ok(summary.length < 300);
});
function fixture() {
  const doc = path => ({ titles: ['Greybrainer Movies'], descriptions: ['Film craft research'],
    canonicals: [`${origin}${path}`], robots: ['index, follow'], ogUrls: [`${origin}${path}`],
    h1: ['Film craft'], schemas: [], links: [articlePath], images: ['/poster.jpg'], text: 'Published 2 January 2020' });
  const home = doc('/'), reviews = doc('/reviews'), article = doc(articlePath);
  home.schemas = [JSON.stringify({ '@type': 'CollectionPage' })];
  article.schemas = [JSON.stringify({ '@graph': [{ '@type': 'Article', datePublished: '2020-01-02T00:00:00Z',
    mainEntityOfPage: { '@id': `${origin}${articlePath}#webpage` } }] })];
  const xml = { locations: [`${origin}/`, `${origin}/reviews`, `${origin}${articlePath}`], lastmods: ['2020-01-02T00:00:00Z'] };
  const data = new Map([['/', home], ['/reviews', reviews], [articlePath, article], ['/sitemap.xml', xml],
    ['/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api\nAllow: /api/assets/\nSitemap: ${origin}/sitemap.xml`]]);
  const requests = [];
  return { data, article, xml, requests, run: () => checkReleaseSeo({
    parse: async text => JSON.parse(text),
    fetcher: async (url, options) => {
      requests.push({ url, options });
      const path = new URL(url).pathname;
      const value = data.get(path);
      return new Response(typeof value === 'string' ? value : JSON.stringify(value), {
        headers: { 'content-type': path.endsWith('.txt') ? 'text/plain' : path.endsWith('.xml') ? 'application/xml' : 'text/html' },
      });
    },
  }) };
}

test('healthy release passes with discovered article, recorded dates, fixed-host GET requests', async () => {
  const f = fixture();
  f.data.get('/').canonicals = [origin];
  f.data.get('/').ogUrls = [origin];
  const report = await f.run();
  assert.deepEqual(report.summary, { blockers: 0, warnings: 0 });
  assert.equal(report.article, articlePath);
  assert.equal(report.sitemapUrls, f.xml.locations.length);
  assert.ok(f.requests.every(({ url, options }) => new URL(url).origin === origin && !options.method && options.redirect === 'manual'));
});

test('star schema and unsupported modified dates are blockers', async () => {
  const f = fixture();
  f.article.schemas = [JSON.stringify({ '@type': 'Article', dateModified: '2020-01-02T00:00:00Z',
    reviewRating: { '@type': 'Rating', ratingValue: 8 } })];
  const report = await f.run();
  assert.ok(report.findings.some(f => f.message.startsWith('Unexpected review/star')));
  assert.ok(report.findings.some(f => f.message.startsWith('Unsupported dateModified')));
});

test('missing publication date warns, future or fabricated visible date blocks', async () => {
  const f = fixture();
  f.article.schemas = [JSON.stringify({ '@type': 'Article', mainEntityOfPage: { '@id': `${origin}${articlePath}#webpage` } })];
  assert.deepEqual((await f.run()).summary, { blockers: 0, warnings: 1 });
  for (const datePublished of ['9999-01-01T00:00:00Z', '2020-02-30T00:00:00Z', '2020-01-03T00:00:00Z']) {
    f.article.schemas = [JSON.stringify({ '@type': 'Article', datePublished })];
    assert.ok((await f.run()).summary.blockers > 0);
  }
});

test('canonical, malformed JSON-LD, sitemap and robots regressions are reported', async () => {
  const f = fixture();
  f.article.canonicals = ['https://wrong.example/'];
  f.article.schemas = ['{'];
  f.xml.locations = [`${origin}/`, `${origin}/reviews`, 'https://wrong.example/'];
  f.data.set('/robots.txt', `User-agent: *\nDisallow: /\nSitemap: ${origin}/sitemap.xml`);
  const report = await f.run();
  for (const fragment of ['self-canonical', 'Invalid JSON-LD', 'Foreign or malformed', 'Robots blocks', 'Selected article absent']) {
    assert.ok(report.findings.some(f => f.message.includes(fragment)), fragment);
  }
});

test('network errors produce findings instead of a false pass', async () => {
  const report = await checkReleaseSeo({ parse: async () => ({}), fetcher: async () => { throw new Error('offline'); } });
  assert.ok(report.summary.blockers >= 4);
  assert.ok(report.findings.some(f => f.message === 'Fetch failed'));
});
