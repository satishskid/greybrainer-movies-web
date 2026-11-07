# Fresh measurement setup

Account setup below is owner/browser-agent reported, not independently verified.

- GA4 property: 563090692; stream: 16291479482; measurement: G-EXBG5V2VVC.
- Prepared GTM container: GTM-TL933CTT, unpublished.
- Reported Meta dataset/pixel: 1701436078208752; portfolio context: 115664838870177.
- Search Console URL-prefix property: https://movies.greybrain.in/, pending verification.

## This patch

- Removes the unconditional old GTM loader and its noscript iframe.
- Loads the new GTM container only after explicit analytics consent on the canonical public hostname. Preview builds and private route prefixes fail closed.
- Persists the choice locally and reloads on changes, including withdrawal, to unload previously running scripts.
- Adds a privacy notice and persistent privacy choices.
- Adds the actual verification file found at /Users/spr/Downloads/Web/googleab7b28115fae6853.html, with its supplied contents.
- Does not load Meta or send lead events. Does not deploy or publish GTM.

## Gates before activation

1. Independently inspect GTM: Google Analytics only, correct measurement ID, advertising disabled, automatic form collection disabled, no Meta/Custom HTML tags. Consent Mode alone does not block arbitrary GTM tags.
2. Browser-test rejection, acceptance, reload, withdrawal, route changes and no duplicate page views; confirm no optional requests before consent and no preview tracking. Inspect query strings and referrers for personal information before enabling collection.
3. Approve deployment and GTM publication separately. Verify receiving-side GA4 events after both.
4. Verify Search Console using the deployed HTML file, then submit the sitemap. A local file is not completed verification.
5. Meta requires a separate marketing choice, consent-aware installation and receiving-side test. Do not add it to an analytics-only container trigger.
6. Lead measurement requires the actual confirmed enquiry receipt, no form values, consent and deduplication; not implemented here.

Withdrawal stops future script loading after reload; it does not erase prior server data or all third-party cookies. The privacy notice states this limitation. Browser tests and owner review of the privacy notice are required before release.

## Verification and rollout, 2026-11-07

- Production storefront version: 49037e34-1ae0-4b2e-b25b-c223801df817. Previous version for rollback: 804fd242-931e-4360-84ad-afaaf3bb86b7.
- Thirty storefront tests passed; targeted ESLint, TypeScript and the production build passed. Build retains the guarded entry and production BACKEND/ENQUIRIES bindings.
- Connected browser access was disabled. A separate fresh Playwright browser, with no personal sessions, tested the local app under an intercepted canonical hostname and then the deployed public privacy page.
- GTM was stubbed in both browser tests: no real analytics events were sent. Default/rejection sent no tracking request, acceptance requested only GTM-TL933CTT once, advertising consent stayed denied, withdrawal unloaded the script and remained effective after another reload. Mobile 390px had no horizontal overflow; no page errors.
- The public verification file returns 200 and the exact downloaded contents. Privacy, homepage, reports and sitemap return 200; /studio/inbox returns 404. Old container is absent from inspected public HTML.
- GTM publication, real GA4 receiving-side checks, Search Console Verify/sitemap submission, Meta and lead tracking are still pending. This is not completed marketing measurement.
