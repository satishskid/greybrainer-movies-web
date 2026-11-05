# Cloudflare storefront migration

Date: 2026-11-05. Branch: `codex/cloudflare-storefront`.
Baseline: `5b00479`. No production deployment or DNS change performed.

## Initial evidence

Live HEAD requests report Netlify for `movies.greybrain.in` and the Netlify
alias. The public website has not migrated merely because the editor uses
Cloudflare. The engine custom domain reports Cloudflare.

`npx vinext@1.4.3 check` scanned this checkout. All five Next.js import categories
are supported, as are the detected Tailwind/Lucide dependencies. It identified
10 pages, one layout and eight route handlers. The sole warning is CommonJS
`__dirname` in `scripts/generate-video.ts`, a separate video script. The tool's
92% summary is a static compatibility assessment, not runtime acceptance.

## Required isolation before deploying

- Replace the production API default with a published-only preview projection
  backed by migrated D1/R2. Reject missing configuration; never use old production
  API, Medium RSS or static archive content to conceal preview retrieval failure.
- Remove Firebase-dependent Hub/API handlers from the deployed graph. Authored
  writes belong behind the protected Studio, not public article POST.
- Replace analytics/subscriber persistence with bounded validated D1 endpoints
  or explicitly disable those features in preview. Never pretend a signup saved.
- Remove the Netlify engine proxy from the Cloudflare deployment. Send editor
  navigation to the approved Cloudflare Studio, not the legacy Netlify engine.
- Preserve current public design, `/reviews/:slug`, metadata, structured data,
  TMDB attribution and waveform. Preview is noindex and separate from live DNS.
- Check imported image URLs for old-backend dependence. Serve copied owned
  images from the new R2 projection, not from the retired API.

## Build and release gates

Use a non-destructive vinext setup, leaving the existing Next build available
for comparison and rollback. Measure Worker compressed size, runtime CPU and
free-plan limits. No paid upgrade is authorized. Then test public pages,
listing/detail freshness, sitemap/robots, JS/CSS MIME, mobile layout, images,
canonical tags and anonymous reads without exposing draft data.

The authoritative cross-repository cutover matrix is
`specs/CLOUDFLARE_STACK_CUTOVER.md` on engine branch
`codex/cloudflare-factory-alignment` (commit `367d00c`).
Fresh Gemini generation remains externally blocked by quota/capacity; do not
claim an end-to-end pass from fixture tests or imported articles alone.

Official deployment guidance checked:
https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
