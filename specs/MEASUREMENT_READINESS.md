# Google and Meta measurement verification

Audit: 2026-11-07. **Goal remains incomplete: account access is required.**
This is an observed setup audit, not proof that GA4 or Meta is receiving events.

## First-hand findings

- The canonical public website returns 200 from Cloudflare.
- It includes GTM `GTM-N8J3ZGXD` in the root layout.
- Fetching Google's published `gtm.js?id=GTM-N8J3ZGXD` returns 200 JavaScript.
  Its published `resource` is version `1`, with `tags: []`, `predicates: []`, and
  `rules: []`. It is an empty container, not an operating analytics integration.
- No GA4 measurement destination or Meta pixel was found in that published resource.
- `src/lib/analytics.ts` is deliberately a no-op. It must not be enabled by simply
  forwarding its old event objects: some contain contact email/studio details.
- The enquiry form has a durable backend receipt, but there is no active verified
  measurement event wired to that receipt.
- robots.txt advertises the canonical sitemap and permits public pages/images.
  The sitemap returns 200 with 132 URLs (127 articles plus 5 static pages).
- A Google site-verification TXT record exists on `greybrain.in`. This does not
  prove which Google account owns the property or that the sitemap was submitted.
- `/privacy` returns 404. Before enabling optional analytics/advertising, publish
  an accurate notice and implement appropriate consent handling; do not assume
  that installing GTM supplies either.
- The marketing connector reports no GTM connection. Narrow Greybrainer filters
  found no accessible GA4/Search Console property in the existing connection.
- Meta account discovery exposed AI-school accounts, not a confirmed movie-site
  pixel. Those accounts must not be silently reused for this project.
- Both normal Chrome and in-app browser APIs return "Local browser use is disabled
  in Work settings". No cookies, browser credentials or alternate control path
  were extracted to bypass that setting.

No tags, destinations, DNS records, ad accounts, ad budgets, tracking permissions,
secrets or production application code were changed during this audit.

## Initial measurement readiness

Provisional diagnostic score: **30/100 — broken for decision-making**.
This describes the observed integration, not a Google/Meta score or business KPI.

| Dimension | Score | Evidence |
| --- | --- | --- |
| Decision alignment | 20/25 | Business aim is known: readership leading to filmmaker enquiries. |
| Event model clarity | 0/20 | No implemented, documented live event model. |
| Accuracy/integrity | 0/20 | Empty GTM and no verified receiving destination. |
| Conversion definition | 5/15 | Durable enquiry receipt exists but is not measured. |
| Attribution/context | 3/10 | Canonical URLs/social links exist; measurement attribution unverified. |
| Governance | 2/10 | Container ID is versioned, but ownership and delivery remain unverified. |

Do not optimize marketing spend from this setup until the following gates pass.

## Small implementation plan once access is available

| Event | Trigger | Allowed context | Decision |
| --- | --- | --- | --- |
| page_view | One canonical public page view, including client navigation | Sanitized canonical path; no query-string/free-text capture | Which sources bring readers? |
| article_view | A report is opened | Public article slug and content category | Which research earns attention? |
| generate_lead | Enquiry API confirms the matching durable receipt | Fixed form identifier; no email, studio name or supplied material | Which visits become filmmaker enquiries? |

Only `generate_lead` is a lead conversion. Form starts, clicks, errors and page
views are not leads. De-duplicate retries using the internal receipt, never
forwarding personal fields to GA4/Meta or inventing transaction values.

1. Open the correct GTM container and confirm the intended GA4 property/web stream.
   The older project note contains `G-BQ36BCQTTX`; that historical ID is not current
   account ownership evidence and was not blindly connected.
2. Configure one owner for page views (GTM/GA4 enhanced or explicit route events,
   not both), production-host restrictions, and an accurate privacy/consent setup.
   Optional advertising must not begin before the visitor permits it.
3. Wire only sanitized public events. Keep owner Studio, workers.dev previews,
   emails, studio names, submitted text and private report material out of tracking.
4. Verify denied/granted consent, desktop/mobile navigation, duplication and failed
   versus successful enquiry delivery. Check real GA4 receiving data, not just a
   successful HTTP request. Clearly mark/exclude any QA activity.
5. Confirm Search Console ownership for the domain or canonical URL prefix; inspect
   the submitted sitemap, submit/reprocess it if needed, and inspect representative
   article URLs. Crawlability is not a promise of indexing or search ranking.
6. Confirm the movie brand's actual Meta dataset/pixel and permissions. If available,
   configure consent-gated PageView and receipt-backed Lead, verify Test Events,
   and do not enable automatic advanced matching or upload form contact details.
   No campaigns or paid subscriptions are part of this goal.

## Owner action required

Enable Browser Use in this chat's Work settings and sign in to the relevant Google
and Meta accounts, or connect those specific accounts to the marketing tools.
An asynchronous request has been sent. Keep the goal active, not marked complete,
until account configuration and receiving-side verification actually pass.

Primary implementation references:
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/webmaster-tools/v1/sites/list
- https://developers.google.com/webmaster-tools/v1/sitemaps/submit
