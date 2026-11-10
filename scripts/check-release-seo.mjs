// Read-only: node scripts/check-release-seo.mjs [--article=/reviews/slug] [--output /private/tmp/seo.json]
// Concise stdout; optional full JSON file. Exit 1 for blockers, 0 for warnings/pass.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const origin = 'https://movies.greybrain.in';
const runtimeRequire = createRequire('/Users/spr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');

export async function checkReleaseSeo({ fetcher = fetch, parse, articlePath } = {}) {
  const findings = [], pages = [];
  const add = (severity, url, message, evidence) => findings.push({ severity, url, message, evidence });
  const check = (ok, url, message, evidence) => { if (!ok) add('blocker', url, message, evidence); };
  const sameUrl = (value, expected) => {
    try { return new URL(value).href === expected; } catch { return false; }
  };
  const dateValid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
    && Number.isFinite(Date.parse(value)) && Date.parse(value) <= Date.now()
    && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);
  async function get(path, type) {
    const url = new URL(path, origin).href;
    if (new URL(url).origin !== origin) throw new Error('Only the fixed production origin is allowed');
    try {
      const response = await fetcher(url, {
        redirect: 'manual', headers: { 'User-Agent': 'Twitterbot' }, signal: AbortSignal.timeout(30_000),
      });
      check(response.status === 200, url, 'Expected HTTP 200 without redirect', response.status);
      check((response.headers.get('content-type') || '').includes(type), url, 'Unexpected content type', response.headers.get('content-type'));
      check(!/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag') || ''), url, 'Response blocks indexing', response.headers.get('x-robots-tag'));
      return { url, text: await response.text(), status: response.status };
    } catch (error) { add('blocker', url, 'Fetch failed', String(error)); return null; }
  }
  async function html(path) {
    const result = await get(path, 'text/html');
    if (!result) return null;
    const doc = await parse(result.text, 'text/html');
    const { text: visibleText, links, ...signals } = doc;
    pages.push({ url: result.url, status: result.status, ...signals, textCharacters: visibleText.length, links: links.length });
    check(doc.canonicals.length === 1 && sameUrl(doc.canonicals[0], result.url),
      result.url, 'Expected one self-canonical', doc.canonicals);
    check(doc.titles.length === 1 && doc.titles[0].trim(), result.url, 'Expected one nonempty HTML title', doc.titles);
    check(doc.descriptions.length === 1 && doc.descriptions[0].trim(), result.url, 'Expected one nonempty description', doc.descriptions);
    check(doc.h1.length === 1 && doc.h1[0].trim(), result.url, 'Expected one nonempty H1', doc.h1);
    check(!doc.robots.some(value => /\b(noindex|nofollow|none)\b/i.test(value)), result.url, 'Meta directives block indexing/following', doc.robots);
    check(doc.ogUrls.length === 1 && sameUrl(doc.ogUrls[0], result.url), result.url, 'Open Graph URL must match canonical', doc.ogUrls);
    if (!doc.robots.length) add('warning', result.url, 'No explicit robots meta (default indexing still allowed)');
    if (doc.titles.some(value => (value.match(/Greybrainer Movies/g) || []).length > 1)) add('blocker', result.url, 'Duplicate brand in title', doc.titles);
    for (const raw of doc.schemas) {
      try { JSON.parse(raw); } catch (error) { add('blocker', result.url, 'Invalid JSON-LD', String(error)); }
    }
    return { ...result, doc };
  }
  const home = await html('/');
  const reviews = await html('/reviews');
  const robots = await get('/robots.txt', 'text/plain');
  const sitemap = await get('/sitemap.xml', 'xml');
  let locations = [];
  if (sitemap) {
    const xml = await parse(sitemap.text, 'application/xml');
    check(!xml.xmlError, sitemap.url, 'Sitemap XML must parse', xml.xmlError);
    locations = xml.locations;
    check(locations.length > 0, sitemap.url, 'Sitemap must contain URLs', locations.length);
    check(new Set(locations).size === locations.length, sitemap.url, 'Duplicate sitemap URLs', locations.length - new Set(locations).size);
    check(locations.every(url => url.startsWith(`${origin}/`)), sitemap.url, 'Foreign or malformed sitemap URLs', locations.filter(url => !url.startsWith(`${origin}/`)));
    for (const route of [`${origin}/`, `${origin}/reviews`]) check(locations.includes(route), sitemap.url, 'Required route absent from sitemap', route);
    for (const value of xml.lastmods) check(dateValid(value), sitemap.url, 'Invalid or future lastmod', value);
  }
  if (robots) {
    check(robots.text.split(/\r?\n/).some(line => line.trim() === `Sitemap: ${origin}/sitemap.xml`), robots.url, 'Missing canonical sitemap declaration');
    const groups = []; let group = null;
    for (const raw of robots.text.split(/\r?\n/)) {
      const line = raw.split('#')[0].trim();
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (!match) continue;
      const [, key, value] = match;
      if (key.toLowerCase() === 'user-agent') {
        if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
        group.agents.push(value.toLowerCase());
      } else if (group && /^(allow|disallow)$/i.test(key) && value) group.rules.push({ allow: key.toLowerCase() === 'allow', path: value });
    }
    for (const agent of ['googlebot', 'googlebot-image']) {
      const specific = groups.filter(g => g.agents.includes(agent));
      const applicable = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
      for (const path of ['/', '/reviews', '/api/assets/seo-check']) {
        const rules = applicable.flatMap(g => g.rules).filter(r => path.startsWith(r.path))
          .sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
        check(!rules.length || rules[0].allow, robots.url, `Robots blocks ${agent}`, path);
      }
    }
  }
  const discovered = reviews?.doc.links.find(path => /^\/reviews\/[^/?#]+$/.test(path))
    || locations.find(url => url.startsWith(`${origin}/reviews/`))?.slice(origin.length);
  const selected = articlePath || discovered;
  if (!selected || !/^\/reviews\/[^/?#]+$/.test(selected)) add('blocker', origin, 'No valid article path available', selected);
  else {
    const article = await html(selected);
    check(locations.includes(`${origin}${selected}`), `${origin}/sitemap.xml`, 'Selected article absent from sitemap', selected);
    if (article) {
      const nodes = [];
      function walk(value) {
        if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === 'object') { nodes.push(value); Object.values(value).forEach(walk); }
      }
      for (const raw of article.doc.schemas) { try { walk(JSON.parse(raw)); } catch { /* Reported by html(). */ } }
      const hasType = (node, type) => [node['@type']].flat().includes(type);
      const articles = nodes.filter(node => hasType(node, 'Article'));
      check(articles.length === 1, article.url, 'Expected one honest Article entity', articles.length);
      check(!nodes.some(node => hasType(node, 'Review') || hasType(node, 'Rating') || hasType(node, 'AggregateRating')
        || 'reviewRating' in node || 'aggregateRating' in node), article.url, 'Unexpected review/star schema without confirmed movie and visible validated overall rating');
      for (const node of nodes) {
        for (const key of ['datePublished', 'dateModified']) if (key in node) check(dateValid(node[key]), article.url, `Invalid or future ${key}`, node[key]);
      }
      for (const node of articles) {
        check(!('dateModified' in node), article.url, 'Unsupported dateModified: no recorded modification field', node.dateModified);
        if (node.datePublished && dateValid(node.datePublished)) {
          const date = new Date(node.datePublished);
          const visible = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
          check(article.doc.text.includes(`Published ${visible}`), article.url, 'Schema publication date does not match visible publication date', node.datePublished);
        }
        if (!node.datePublished) add('warning', article.url, 'Publication date omitted; confirm the source genuinely has no recorded date');
        check(node.mainEntityOfPage?.['@id'] === `${article.url}#webpage`, article.url, 'Article mainEntityOfPage mismatch', node.mainEntityOfPage);
      }
      if (!article.doc.images.length) add('warning', article.url, 'No HTML images found');
    }
  }
  if (home) {
    const collection = home.doc.schemas.some(raw => { try { return JSON.parse(raw)['@type'] === 'CollectionPage'; } catch { return false; } });
    check(collection, home.url, 'Homepage CollectionPage schema missing');
  }
  return { checkedAt: new Date().toISOString(), origin, article: selected, sitemapUrls: locations.length,
    pages, findings, summary: { blockers: findings.filter(f => f.severity === 'blocker').length,
      warnings: findings.filter(f => f.severity === 'warning').length } };
}

export function releaseSeoOptions(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--article=/reviews/') && !options.articlePath) options.articlePath = arg.slice('--article='.length);
    else if (arg === '--output' && args[i + 1] && !options.output) options.output = args[++i];
    else throw new Error('Usage: node scripts/check-release-seo.mjs [--article=/reviews/slug] [--output /private/tmp/seo.json]');
  }
  if (options.output && !resolve(options.output).startsWith('/private/tmp/')) throw new Error('--output must be a file under /private/tmp/');
  return options;
}

export function releaseSeoSummary(report) {
  return [
    `SEO: ${report.summary.blockers} blockers, ${report.summary.warnings} warnings; ${report.pages.length} pages checked; ${report.sitemapUrls} sitemap URLs.`,
    `Article: ${report.article || 'not found'}`,
    ...report.findings.map(f => `${f.severity.toUpperCase()}: ${f.message} (${f.url})`),
  ].join('\n');
}

async function main() {
  const options = releaseSeoOptions(process.argv.slice(2));
  const { chromium } = runtimeRequire('playwright');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.route('**/*', route => route.abort());
    const parse = (text, mime) => page.evaluate(({ text, mime }) => {
      const doc = new DOMParser().parseFromString(text, mime);
      const values = (selector, attribute) => [...doc.querySelectorAll(selector)].map(el => attribute ? el.getAttribute(attribute) || '' : el.textContent.trim());
      const body = doc.body?.cloneNode(true);
      body?.querySelectorAll('script, style, template, noscript').forEach(el => el.remove());
      return mime === 'application/xml'
        ? { xmlError: doc.querySelector('parsererror')?.textContent, locations: values('loc'), lastmods: values('lastmod') }
        : { titles: values('head > title'), descriptions: values('meta[name="description"]', 'content'),
          canonicals: values('link[rel="canonical"]', 'href'), robots: values('meta[name="robots"], meta[name="googlebot"]', 'content'),
          ogUrls: values('meta[property="og:url"]', 'content'), ogImages: values('meta[property="og:image"]', 'content'), h1: values('h1'),
          schemas: values('script[type="application/ld+json"]'), links: values('a[href]', 'href'),
          images: values('img[src]', 'src'), text: (body?.textContent || '').replace(/\s+/g, ' ').trim() };
    }, { text, mime });
    const report = await checkReleaseSeo({ parse, articlePath: options.articlePath });
    if (options.output) writeFileSync(options.output, JSON.stringify(report, null, 2));
    console.log(releaseSeoSummary(report));
    if (options.output) console.log(`JSON: ${options.output}`);
    process.exitCode = report.summary.blockers ? 1 : 0;
  } finally { await browser.close(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(JSON.stringify({ error: String(error) })); process.exitCode = 1; });
}
