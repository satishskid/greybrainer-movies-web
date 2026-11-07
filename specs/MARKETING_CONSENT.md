# Independent analytics and Meta consent

Status: implemented and tested locally. NOT deployed. Do not deploy until the Google configuration below is corrected and the real shared-container behaviour is tested.

## Live configuration blocker observed on 2026-11-07

The public script at https://www.googletagmanager.com/gtm.js?id=GTM-TL933CTT returned 200 and contained:

- `__ogt_auto_events` with `vtp_enableForm: true`.
- `__ogt_1p_data_v2` with `vtp_isEnabled: true`, `vtp_isAutoEnabled: true`, and automatic email, phone and address flags enabled.
- Google initialization tags without an explicit additional analytics consent requirement visible in their serialized entries. The generate_lead tag does carry an analytics_storage consent requirement.

These are observed configuration flags, not proof that any private field was actually transmitted. They contradict the reported disabled automatic data collection. Google advertising consent remains denied by the frontend, but that is not a substitute for disabling unwanted collection settings.

## Frontend contract

Keep storage key `greybrainer_measurement_consent_v1`. Values are `necessary`, `analytics`, `marketing`, or `both`. Old analytics acceptance grants analytics only; it never grants marketing. Invalid/missing choices grant neither. Checkboxes are independent and apply only when saved. Reject optional stores `necessary`. Changes reload the page to unload scripts; changes in other tabs reload too.

On the canonical public hostname only, either accepted category permits loading GTM. Before the container starts, the page queues:

1. Google consent: analytics_storage reflects analytics alone; ad_storage, ad_user_data and ad_personalization remain denied even if Meta marketing is accepted. Meta consent does not grant Google advertising permissions.
2. `greybrainer_consent` with `analytics_consent` and `marketing_consent`, each `granted` or `denied`.
3. `gtm.js`.
4. Only if marketing is granted, `greybrainer_marketing_ready` with `marketing_consent: granted`.

`marketing_consent` is a site-defined data-layer flag, not a Google consent type. Do not treat analytics_storage or ad_storage as Meta consent. Preview/private routes permit neither category. Successful enquiry measurement continues to depend only on analytics consent.

## Required account-side work before frontend deployment

Use only GTM-TL933CTT and GA4 G-EXBG5V2VVC; do not alter Santaan's unrelated properties.

1. In the Google tag/GA4 stream settings, disable user-provided data collection, automatic email/phone/address detection, and enhanced-measurement form interactions. Inspect inherited user properties/event settings. Keep ordinary page views and the fixed generate_lead event.
2. Make every Google tag, including the base Google tag and linked initialization, require analytics consent. Prefer a trigger restricted to `greybrainer_consent` AND `analytics_consent = granted` AND hostname `movies.greybrain.in`, plus additional required analytics_storage consent. Remove any conflicting all-pages/initialization firing. Inspect actual runtime behaviour: denied analytics must not send cookieless collection requests just because Meta loads the shared container.
3. Prepare (do not activate yet) the Meta browser tag using pixel 1701436078208752, Custom Event `greybrainer_marketing_ready`, data-layer marketing_consent exactly granted, and hostname exactly movies.greybrain.in. Fire at most once per full page load. Add a fail-closed check of current saved marketing consent before executing pixel code.
4. Only PageView for that exact pixel. No advanced matching, automatic events/microdata collection, form reads, user data, Lead, CAPI, gateway signup, ads or billing. Disable both Events Manager automatic settings and code/template automatic-configuration options; use the supplied manual code and current official settings rather than assuming defaults are safe. No noscript tracking image.
5. Show the changes and get approval for Google settings publication. Keep Meta paused until frontend code is deployed and the full matrix passes in Preview. Test the real container against the new local build under the canonical hostname with collection endpoints intercepted, so the test does not send fake leads or events. Do not rely on ordinary preview-hostname tests: those intentionally prohibit tracking.

If shared-container initialization cannot be prevented from sending Google requests for marketing-only visitors, stop. Do not deploy this frontend or accept consent-mode cookieless pings as satisfying the zero-request requirement. Propose a separately loaded Meta integration instead.

## Acceptance matrix

| Choice | Google collection | Meta requests | Enquiry analytics |
| --- | --- | --- | --- |
| Unset or reject optional | none | none | none |
| Analytics | permitted | none | only after matching receipt |
| Marketing | none | PageView only | none |
| Both | permitted | PageView only | only after matching receipt |

Test before interaction, after reload, both-to-analytics withdrawal, all rejection, and legacy saved analytics consent. Inspect all collection URLs/bodies, automatic referrers/URLs, cookies and duplicate events. Receiving-side GA4/Meta verification is separate and must not expose personal event records.

## Local verification

33 storefront tests, targeted ESLint, TypeScript and production build passed. A fresh isolated Playwright browser exercised all four choices, saved checkbox values, no tracking before choice, withdrawal of marketing while retaining analytics, full rejection, and mobile 390px with no overflow or page errors. Browser tests simulated the proposed GTM contract; no real Meta or Google measurement was sent. They do not validate the currently published container. Connected local browser access was unavailable, so no signed-in account configuration was changed.

Sources: https://developers.google.com/tag-platform/security/guides/consent and https://support.google.com/analytics/answer/14077171 . Official Meta GTM template reference: https://github.com/facebook/GoogleTagManager-WebTemplate-For-FacebookPixel .

## Actual workspace export review

Inspected /Users/spr/Downloads/GTM-TL933CTT_workspace5.json (original SHA-256 4149876d91988114a8a7cd9a4506d77dbecc726412ed8b6468b5dfa90685bee3). Container identity matches GTM-TL933CTT. The marketing trigger correctly restricts event, canonical hostname and marketing_consent=granted, and its variable reads the correct data-layer key. Meta no longer requires Google's ad_storage; advancedMatching=false and disableAutoConfig=true are present. Google base and generate_lead tags require analytics_storage, with only the fixed lead_type event parameter.

However, the export still sets optInMetaCAPI=true, disablePushState=false, and ONCE_PER_EVENT. The account-summary claim that all Meta restrictions were already satisfied was therefore not supported. Google tag configuration parameters named allow_user_provided_data=false and form_interactions_enabled=false are present as template strings; this does not establish that Google stream/automatic-collection settings were actually disabled. Do not call the export complete proof of that.

Prepared a private corrected import artifact at /Users/spr/Downloads/GTM-TL933CTT_workspace5_reviewed-meta.json, leaving the original untouched. Only four leaf values differ, all on the existing Meta tag: optInMetaCAPI=false, disablePushState=true, tagFiringOption=ONCE_PER_LOAD, and paused=true. It preserves the existing trigger and analytics tags. No account changes, import, publication or frontend deployment occurred. Keep exports out of public Git.

For Gemini: import the reviewed file only into the intended container using Merge/Overwrite conflicts rather than creating duplicate tags. Keep Meta paused until a Preview test is ready. Inspect and correct Google/GA4 automatic collection settings separately. Re-export for review, then test the real workspace against the prepared frontend with measurement endpoints intercepted before approval and release.
