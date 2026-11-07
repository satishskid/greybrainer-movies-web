// Read-only production check. No credentials, publishing, Gemini calls or social dispatch.
// node scripts/check-restored-archive.mjs <summary.json> <restoration-plan.json> <output.json>
import { readFileSync, writeFileSync } from 'node:fs';
const [summaryPath, planPath, outputPath] = process.argv.slice(2);
const entries = JSON.parse(readFileSync(summaryPath, 'utf8')).entries;
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const origin = 'https://movies.greybrain.in';
const expected = new Set([...plan.netlifySlugs, ...plan.restore.map(x => x.slug), ...plan.imports.map(x => x.slug), 'mohra-1994-review-greybrainer-craft-analysis']);
const missing = [...expected].filter(slug => !entries.some(x => x.slug === slug));
const duplicates = entries.map(x => x.slug).filter((slug, i, all) => all.indexOf(slug) !== i);
const checked = [], images = [];
async function run(items, task) {
  let index = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (index < items.length) await task(items[index++]);
  }));
}
await run(entries, async entry => {
  const start = Date.now();
  const url = `${origin}/reviews/${entry.slug}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    const html = await response.text();
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
    checked.push({ slug: entry.slug, status: response.status, ms: Date.now() - start, canonical,
      ok: response.status === 200 && canonical === url && (html.match(/<h1\b/g) ?? []).length === 1
        && !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html)
        && (!entry.historicalArchive || html.includes('not been re-approved under the current editorial process')) });
  } catch (error) { checked.push({ slug: entry.slug, ok: false, error: String(error) }); }
});
const imageUrls = [...new Set(entries.flatMap(e => [e.heroImageUrl, e.posterImageUrl, e.thumbnailImageUrl,
  ...[...(e.blogMarkdown ?? '').matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1])]).filter(x => x?.startsWith('https://')))];
await run(imageUrls, async url => {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30_000) });
    images.push({ url, status: response.status, contentType: response.headers.get('content-type'), ok: response.ok && response.headers.get('content-type')?.startsWith('image/') });
  } catch (error) { images.push({ url, ok: false, error: String(error) }); }
});
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const sitemapMissing = entries.filter(e => !sitemap.includes(`${origin}/reviews/${e.slug}`)).map(e => e.slug);
const report = { checkedAt: new Date().toISOString(), entries: entries.length, archive: entries.filter(e => e.historicalArchive).length,
  missing, duplicates, pages: checked, pageFailures: checked.filter(x => !x.ok), images,
  imageFailures: images.filter(x => !x.ok), noCover: entries.filter(e => !e.heroImageUrl?.startsWith('https://')).map(e => e.slug),
  sitemapStatus: sitemapResponse.status, sitemapMissing };
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ entries: report.entries, archive: report.archive, missing, duplicates, pagesChecked: checked.length,
  pageFailures: report.pageFailures, imagesChecked: images.length, imageFailures: report.imageFailures.length,
  noCover: report.noCover.length, sitemapMissing, sitemapStatus: sitemapResponse.status }, null, 2));
if (missing.length || duplicates.length || report.pageFailures.length || report.imageFailures.length || sitemapMissing.length || sitemapResponse.status !== 200) process.exitCode = 1;
