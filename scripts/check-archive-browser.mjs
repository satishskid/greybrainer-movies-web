// Clean, signed-out browser. Only reads public pages and exercises catalog filters.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('/Users/spr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');
const dir = process.argv[2];
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto('https://movies.greybrain.in/reviews', { waitUntil: 'networkidle', timeout: 90_000 });
    const cardCount = await page.locator('a[href^="/reviews/"]').count();
    await page.screenshot({ path: `${dir}/catalog-${viewport.width}.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.getByPlaceholder('Search by film title').fill('Save The Tigers');
    const searchResults = await page.locator('a[href^="/reviews/"]').count();
    await page.getByTitle('Clear search').click();
    await page.getByRole('button', { name: /^Head-to-Head/ }).click();
    const comparisons = await page.locator('a[href^="/reviews/"]').count();
    await page.goto('https://movies.greybrain.in/reviews/greybrainer-analysis-save-the-tigers-season-3', { waitUntil: 'networkidle', timeout: 90_000 });
    const archiveNotice = await page.getByText('not been re-approved under the current editorial process', { exact: false }).count();
    const articleOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const brokenImages = await page.locator('article img').evaluateAll(imgs => imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
    await page.screenshot({ path: `${dir}/archived-article-${viewport.width}.png` });
    await page.goto('https://movies.greybrain.in/reviews/the-debt-collector', { waitUntil: 'networkidle', timeout: 90_000 });
    const noPosterHeadingWidth = await page.locator('article h1').evaluate(el => Math.round(el.getBoundingClientRect().width));
    results.push({ viewport, cardCount, overflow, searchResults, comparisons, archiveNotice, articleOverflow, brokenImages, noPosterHeadingWidth, errors });
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(`${dir}/browser-audit.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.cardCount !== 127 || r.overflow || r.articleOverflow || r.searchResults !== 1 || r.comparisons !== 11 || !r.archiveNotice || r.brokenImages.length || r.errors.length)) process.exitCode = 1;
