import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('/Users/spr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');
const base = process.argv[2];
const directory = process.argv[3];
if (!base || !directory) throw new Error('Usage: node scripts/check-homepage.mjs <base-url> <screenshots-directory>');
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const response = await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
    for (const image of await page.locator('main img').all()) await image.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.evaluate(() => scrollTo(0, 0));
    const result = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      categories: ['review', 'brief', 'insight', 'comparison'].filter(id => document.getElementById(id)),
      cards: document.querySelectorAll('main li a[href^="/reviews/"]').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.querySelectorAll('main img')].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
    }));
    await page.screenshot({ path: `${directory}/home-top-${width}.png` });
    await page.screenshot({ path: `${directory}/home-${width}.png`, fullPage: true });
    results.push({ width, status: response.status(), ...result, errors });
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(`${directory}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.status !== 200 || r.h1 !== 1 || r.cards < 2 || r.overflow || r.brokenImages.length || r.errors.length || !r.schema.some(s => s['@type'] === 'CollectionPage'))) process.exitCode = 1;
