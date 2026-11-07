# Confirmed filmmaker enquiry measurement

## Website implementation

The existing private enquiry endpoint already validates a durable matching storage receipt. The frontend now checks the matching receipt too, retains the request ID when retrying unchanged form contents, and blocks overlapping submits. IDs and form values stay out of the analytics event.

Only a successful response with `success: true` and `receiptId` equal to the submitted request ID can emit:

```json
{"event":"generate_lead","lead_type":"filmmaker_enquiry"}
```

Emission also requires explicit analytics consent, the production hostname and a public route. No value or currency is supplied. A sessionStorage marker keyed by receipt suppresses replay in the same tab. This is best-effort browser measurement, not guaranteed delivery or global exactly-once counting. If storage or analytics fails, enquiry success remains successful. Events skipped without consent are not saved for later replay.

## GTM handover (not configured by this code change)

In GTM-TL933CTT:

1. Create a Custom Event trigger matching `generate_lead` exactly, not a click or form-submit trigger. Limit it to hostname `movies.greybrain.in` and the expected public enquiry page.
2. Create a GA4 Event tag targeting measurement ID G-EXBG5V2VVC, event name `generate_lead`. Add only the constant parameter `lead_type = filmmaker_enquiry`. Do not inherit form variables, receipt IDs, user IDs, value or currency. Require analytics_storage consent.
3. Verify the existing Google tag has no form-value/user-provided data configuration and automatic form collection remains disabled. Inspect inherited event settings too.
4. Preview with a synthetic enquiry response, not a real stored customer enquiry: failure and mismatched receipts must not fire; confirmed success with consent fires once; without consent nothing fires. Inspect outbound parameters as well as the data layer, including automatic URL/referrer parameters.
5. Obtain approval before publishing the GTM change. Verify receiving-side GA4 delivery separately. Mark generate_lead as a key event if the owner approves.

Do not activate Meta or ads as part of this change. No real enquiry was submitted during automated QA.

## Verification

32 storefront tests passed, including consent, receipt matching, fixed-payload privacy, replay suppression and blocked storage. Targeted ESLint and TypeScript passed. A fresh isolated Playwright browser exercised the real form against local code with intercepted synthetic API responses and GTM: 503 and wrong receipts emitted no event; retries retained one ID; matching success emitted exactly the fixed payload with analytics consent and nothing with necessary-only consent. No customer record or real Google event was created. Screenshots were inspected; no page errors occurred. Account-side GTM configuration and receiving-side GA4 verification remain separate pending steps.

## Deployment, 2026-11-07

Code e026ccc deployed to the production storefront as b9da92d6-e48f-40fa-912a-e46f94bd486a. Previous version for rollback: 49037e34-1ae0-4b2e-b25b-c223801df817. Production bindings and relay protection were retained; no database, DNS, engine or Meta changes.

The browser form checks above were repeated against the deployed public homepage, still intercepting enquiry responses and GTM. Both consent states passed, no page errors occurred, no real enquiries were created and no real analytics events sent. Homepage, privacy and reports returned 200; public /studio/inbox returned 404.

The connected marketing tool returned `No gtm connection found` on the account check. No GTM tag or container publication was changed. Actual generate_lead receiving-side delivery remains unverified. Note that consent is configured on the GA4 tag, not the custom-event trigger. A staging hostname deliberately does not emit production analytics.
