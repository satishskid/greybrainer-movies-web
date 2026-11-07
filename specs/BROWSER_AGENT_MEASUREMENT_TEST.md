# Browser-agent script: Greybrainer Google and Meta verification

Copy the prompt below into a browser agent with access to your signed-in Google
and Meta sessions. It works as an audit without repository access. No API key
needs to be pasted into the chat. Google/Meta login, MFA and CAPTCHA remain with
the owner whenever the agent cannot or should not complete them.

---

## Prompt to paste

You are verifying the marketing measurement setup of Greybrainer Movies, a public
film-analysis publication that attracts confidential pre-production enquiries from
filmmakers. The owner needs reliable readership and enquiry-conversion measurement,
not advertising spend or automated social publishing.

Complete the browser checks below. Report evidence, not assumptions. Start in
read-only mode. Do not mark a requirement passed simply because a script or logo
exists, a request returned 200/204, a preview worked, or a DNS record was found.

### 1. Allowed destinations and known identifiers

Public website:
- https://movies.greybrain.in/
- https://movies.greybrain.in/reviews
- https://movies.greybrain.in/archive
- https://movies.greybrain.in/reviews/mohra-1994-review-greybrainer-craft-analysis
- https://movies.greybrain.in/reviews/nagabandham-the-secret-treasure-2026
- https://movies.greybrain.in/robots.txt
- https://movies.greybrain.in/sitemap.xml
- https://movies.greybrain.in/privacy

Account consoles:
- https://tagmanager.google.com/ — intended existing container: GTM-N8J3ZGXD
- https://tagassistant.google.com/ — use the canonical public website
- https://analytics.google.com/ — confirm the correct movie-site property/stream
- https://search.google.com/search-console — confirm the relevant property
- https://business.facebook.com/events_manager2/ — confirm the movie-site dataset/pixel

Historical reference only: G-BQ36BCQTTX appeared in the project's original GA4
setup. Do not assume this is the currently intended property. Verify its owner,
property, stream URL and measurement ID in Google Analytics before recommending use.

The active Studio is protected and separate:
https://greybrainer-production.satish-9f4.workers.dev/studio/inbox
Do not enter it, generate research, approve content, alter Gemini keys or publish
articles for this measurement test. It is not an analytics destination.

### 2. Authority and privacy boundaries

- Audit the named website and directly relevant accounts only. Do not inspect
  unrelated businesses, campaigns, messages or customer records.
- Let the owner complete sign-in/MFA/CAPTCHA when required. Never request passwords,
  API secrets, browser cookies or copied session tokens in the report/chat.
- No ad activation, spending, billing change, new subscription, permission expansion,
  account creation, DNS mutation, tag publication or deletion without explicit owner
  approval for the specific action. Account agreements must be handled by the owner.
- Do not bypass site security, browser restrictions, consent or approval gates.
- Do not silently reuse a pixel from an AI-school or another business because its
  name contains Greybrain. Confirm movie-brand ownership and intended destination.
- Never send enquiry email, studio/production name, uploaded material, message text,
  authentication details or private Studio URLs to analytics/advertising services.
- Use the browser's legitimate diagnostics if available. Do not export raw cookies,
  authorization headers, local storage dumps, full private network logs or visitor
  identifiers. Screenshots and request summaries must be redacted appropriately.

### 3. Starting evidence — recheck, do not assume unchanged

An independent audit on 7 November 2026 found:
- The public website was on Cloudflare with 127 articles; sitemap had 132 URLs
  including static pages. Counts may legitimately grow; inspect live values.
- The published GTM container GTM-N8J3ZGXD loaded but its resource had zero tags,
  predicates and rules. Container presence therefore did not prove GA4/Meta tracking.
- A Google verification TXT record existed on greybrain.in, but Search Console
  ownership and sitemap submission had not been confirmed in the console.
- No confirmed movie-site Meta pixel was available to that audit.
- /privacy returned 404. No working consent controls were verified.
- The Studio enquiry saves to a private Cloudflare service and requires a matching
  durable receipt. Its tracking integration had not been verified.

### 4. Public website and crawlability checks

1. Open the homepage, reports, archive and both named article URLs.
2. Confirm HTTP success where browser diagnostics expose it; otherwise record the
   rendered result and mark HTTP status unverified rather than guessing.
3. Confirm each article has one main heading, substantive readable text, its own
   exact canonical /reviews/<slug> URL, a real image and social-preview metadata.
4. Historical articles must retain their dates and archive notice. Do not claim
   they passed the current human editorial gate. Do not change research or scores.
5. Check desktop and a mobile viewport. Check image loading, readable headings,
   working navigation and no horizontal overflow. Record screenshot dimensions.
6. Open robots.txt and sitemap.xml. Confirm canonical public URLs, article inclusion,
   and no accidental block/noindex on public production pages. Training-bot rules
   are not evidence that Google Search is blocked; inspect the applicable rules.
7. Record the /privacy result and whether a clear measurement/privacy notice and
   functional optional-tracking controls exist.

### 5. Google Tag Manager audit

1. Open GTM-N8J3ZGXD in the signed-in account. If unavailable, report the exact
   account-access problem and request owner help. Do not substitute another container.
2. Record account/container name, container public ID, live version and publication
   time. Distinguish the live version from a workspace's unpublished changes.
3. Inspect the live tags, triggers and variables. List only items relevant to this site.
4. Identify the GA4 destination, page-view trigger, any Meta pixel and consent checks.
   An empty container is a failure for measurement, not a pass for installation.
5. Use Tag Assistant with https://movies.greybrain.in/. Capture which tags fire,
   which are blocked, and why. A Tag Assistant connection alone is not a pass.
6. Verify tags are limited to the canonical production hostname and do not fire on
   protected Studio, workers.dev previews or unrelated Greybrain websites.
7. Check for duplicate implementations: direct Google tag plus GTM, automatic plus
   explicit history page views, multiple GTM containers, or two Meta base snippets.

### 6. Consent tests before enabling tracking

Use a clean temporary profile/context if the browser agent supports one. Do not
clear the owner's browsing data or sign-in state to create a clean test.

1. Record the default consent state before any choice.
2. Reject optional tracking. For a basic consent-gated setup, no optional Google
   Analytics or Meta requests should be sent. If an explicitly chosen advanced
   consent setup sends cookieless Google pings, identify them and the denied state;
   do not mislabel that as zero data transmission or automatically compliant.
3. Accept analytics only. Google measurement may run, but advertising/Meta must
   remain blocked. Verify consent state and actual tag behavior, not only the UI.
4. Permit marketing only in the clean test context if controls are available, then
   verify the Meta behavior separately. Do not consent on behalf of real visitors.
5. Withdraw consent. Confirm subsequent tracking respects the change and the user
   can reopen preferences. Record any remaining requests/storage concerns.
6. If consent controls/notice are absent, record a blocker to activation. Do not
   enable live advertising tracking by default merely to make a test pass.

### 7. GA4 receiving-side test

1. Confirm property name/ID, web stream name/ID, measurement ID and stream URL.
   Record why this is the correct Greybrainer Movies property.
2. Open Realtime or DebugView and use a controlled debug/test session.
3. Test direct navigation to the homepage, client navigation to a report, opening
   another report, browser back/forward, then a deliberate reload.
4. Expect one page_view per genuine navigation/reload when analytics is permitted.
   Watch for a duplicate caused by both enhanced history measurement and manual events.
5. Confirm the event's hostname/path match the canonical website. Query strings,
   private URLs and form values must not leak into measurement parameters.
6. If article_view is configured, expect one per report opening, with only the public
   article slug/category. It is readership, not a lead conversion.
7. Record receiving-side timestamps/event names. A collect request alone does not
   establish that the correct GA4 property received the event. Normal reports may
   have latency; use Realtime/DebugView and report uncertainty honestly.
8. If raw requests or DebugView are unavailable to this browser agent, mark that
   check UNVERIFIED. Do not invent request details or claim end-to-end success.

### 8. Search Console ownership, sitemap and index checks

1. Open the existing relevant property: either sc-domain:greybrain.in or the exact
   https://movies.greybrain.in/ URL-prefix property. Confirm the current user's
   permission and that the property includes the canonical movie website.
2. Read the Sitemaps screen. Look for https://movies.greybrain.in/sitemap.xml.
   Record submitted URL, status, last read time, discovered counts, errors/warnings.
3. If absent or stale, propose submission/reprocessing and ask the owner before
   pressing Submit. Do not create a duplicate property or change DNS without approval.
4. Inspect the Mohra and Nagabandham article URLs. Record index verdict, crawl state,
   last crawl, user canonical and Google's selected canonical if available.
5. Separate "live page is crawlable", "sitemap submitted", "Google indexed it" and
   "ranking/traffic". None automatically proves the next. Indexing may take time.
6. Do not use the general Google Indexing API as a film-article shortcut or promise
   immediate indexing. Do not request bulk indexing of the entire library.

### 9. Meta dataset/pixel audit and receiving-side test

1. Select the actual Greybrainer Movies dataset/pixel. Verify business ownership,
   website association, dataset/pixel ID and access. If uncertain, stop this section
   and ask the owner; do not use another business's dataset.
2. In Events Manager, inspect Overview, Diagnostics and Test Events. Record current
   browser/server integrations and whether the canonical domain is associated.
3. With consent granted in a controlled test context, confirm PageView is received
   from the canonical movie site exactly once per genuine page navigation.
4. Use test/debug facilities to distinguish QA from normal visitors. Do not start ads.
5. Check for duplicate browser/CAPI events. If CAPI is present, verify a shared event
   identifier for de-duplication without exposing secrets or personal identifiers.
   CAPI is not required merely because a pixel exists; do not build it unnecessarily.
6. Keep automatic advanced matching/contact-field capture off for this audit. Do
   not turn it on, upload enquiry contacts, or export the enquiry database.
7. If there is no pixel or no access, report NOT CONFIGURED or BLOCKED. Never invent
   an ID or treat a public Facebook profile link as a pixel integration.

### 10. Enquiry conversion — controlled, explicit write approval required

READ-ONLY FIRST: inspect the form and describe the intended test. Ask the owner
before submitting one clearly marked QA enquiry, since submission writes to production.
Ask which owner-approved email to use; do not invent a real person's identity.

After approval:
1. Use an internal-QA studio label and the approved test email. No screenplay,
   private film details, customer information or real lead is needed.
2. Record the start time. A form click/start is not a conversion.
3. Submit once. Confirm the /api/studio-diagnostic response succeeds and its receipt
   matches the request ID when those diagnostics are available. If unavailable,
   record that durable receipt confirmation needs a developer check.
4. Expect one generate_lead in GA4 and one Lead in Meta only when the corresponding
   consent is granted and those integrations are actually configured.
5. Neither destination may receive email, production/studio name, entered text,
   private report data or a fabricated monetary value.
6. Failed/invalid submissions must produce no lead event. Only test failure using
   normal invalid-form validation or an isolated supported test mechanism; do not
   break the service, alter production networking or repeatedly create QA records.
7. Do not repeatedly submit to test retries without specific owner approval. Use
   code/request inspection for idempotency, or mark retry counting UNVERIFIED.
8. Do not delete the QA record automatically. Log its receipt for owner review and
   identify how to exclude QA from production marketing decisions.

### 11. Fix phase — separate from the audit

First present the actual failures and the smallest repair proposal. Ask the owner
before any live configuration mutation or publication. If approved, change only the
confirmed movie-site container/property/pixel and preserve the earlier version.

For a GTM repair, the plan must name:
- Correct destination IDs and proof of ownership.
- Which single mechanism owns page views.
- Consent controls and production-host restrictions.
- Source events and sanitized parameters.
- The receipt-backed conversion trigger, not a generic form-click/submit trigger.
- Workspace diff, rollback version, preview evidence, and the proposed live publish.

If application code is missing (for example, no receipt-backed dataLayer event),
report a developer fix with the precise UI/request evidence. Do not scrape form
fields or approximate successful leads from button clicks as a workaround.

Do not publish an entire dirty GTM workspace containing unrelated changes. Isolate
the approved change and ask again if the proposed live diff is broader than approved.
After approved publication, repeat live receiving-side checks; preview-only success
does not prove that the published website works.

### 12. Required final report

Use these exact result categories: PASS / FAIL / BLOCKED / UNVERIFIED.

| Requirement | Result | First-hand evidence and time | Remaining action/owner |
| --- | --- | --- | --- |
| Correct live GTM container and published tags | | | |
| Correct GA4 property/stream | | | |
| Consent denied/granted/withdrawn behavior | | | |
| GA4 page views received without duplicates | | | |
| Article event received, if configured | | | |
| Enquiry conversion tied to durable success | | | |
| No personal/private form data in tracking | | | |
| Search Console ownership/property scope | | | |
| Canonical sitemap submission/read status | | | |
| Representative Google index/canonical checks | | | |
| Correct movie-brand Meta pixel/dataset | | | |
| Meta PageView/Lead receiving-side checks | | | |
| Desktop/mobile and production/preview isolation | | | |

Attach redacted screenshots of the live container version, GA4 receiving events,
Search Console sitemap/index results and Meta Test Events where accessible. Include
the exact relevant public URLs and destination IDs, but no credentials or private
visitor/customer data. List every mutation and its owner approval/rollback reference.

Finish with:
1. What is proven working.
2. What is not configured or still unverified.
3. Exactly what the owner/developer must do next.

Never conclude "everything is complete" while any required row is FAIL, BLOCKED or
UNVERIFIED. Do not promise indexing, ranking, traffic or sales from tag installation.
