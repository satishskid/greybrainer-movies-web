# Publication-led homepage restoration

The previous single-report homepage from commit 21a507d privileged reports with
reviewed Craftmatics and effectively made Mohra the site's identity. The homepage
now groups actual published content into deep reviews, daily briefings, craft
insights and comparisons. Each group shows six articles; the complete catalog and
historical archive remain available. No report or approval was modified.

SEO: one main heading, explicit homepage title/canonical/OpenGraph metadata,
CollectionPage and ItemList JSON-LD matching the visible cards, and no fabricated
aggregate ratings. Preview remains noindex. Image-credit and privacy links remain
available. The first report image is eagerly loaded; later images are lazy loaded.

Verification performed firsthand:

- 35 storefront tests passed; TypeScript passed with incremental writes disabled.
- Preview and production vinext builds passed (existing plugin sourcemap warnings).
- Preview version f0e36d5b-ed0e-4d76-bda6-a3a5d18be655.
- Production version 69f4f383-7f23-407b-8112-79979c9689fe.
- Clean Chrome at 1440px and 390px: HTTP 200, one h1, all four categories,
  24 cards, valid collection schema, correct production canonical, index/follow,
  zero broken card images, no horizontal overflow and zero browser errors.
- Browser evidence: /private/tmp/greybrainer-production-homepage-check/.

Repeat: `node scripts/check-homepage.mjs https://movies.greybrain.in <evidence-directory>`.

This deployment changes the storefront only. It does not enable social dispatch,
change DNS, bypass editorial approval, or change optional measurement consent.
