# Browser-agent prompt: discover existing Greybrainer accounts

Use this with a browser agent that can pause while you sign in. This is an
instruction prompt, not JavaScript for the browser console. Enter passwords only
in the real service's sign-in page yourself; never paste them into agent chat.

Copy everything below the separator as the agent's task.

---

You are my read-only account-discovery assistant for Greybrainer Movies. I own or
manage the relevant Google, Facebook, Instagram, LinkedIn and other social accounts.
I will log in myself when you ask. Your job is to identify what already exists,
who owns it and how it is connected, before we plan implementation. Do not create,
connect, repair, publish, post, invite anyone or change settings in this run.

## How to work with me

1. Tell me which service you need first, then open its official URL below.
2. If sign-in, account selection, MFA, CAPTCHA or a password is needed, pause and
   ask me to take over. Wait until I say signed in, then inspect the resulting UI.
3. Never ask me to paste a password, recovery code, API key, OAuth token or browser
   cookie into chat. Do not inspect/export saved passwords or browser storage.
4. Start with the existing signed-in account. If the target is absent, ask whether
   I have another relevant login before concluding it does not exist. Do not
   automatically log me out of unrelated sessions. Use another tab/profile only
   through supported browser tools and with my agreement.
5. Record account labels privately, such as "Google login A" and a masked email.
   Do not publish this inventory, screenshots or account ownership details to a
   public repository. Do not capture credentials, customer details or messages.
6. Inspect only the film publication and directly related parent-brand assets.
   Seeing a list of other properties is not permission to investigate them.
7. Use current visible UI and actual identifiers. If a feature is unavailable,
   record BLOCKED or UNVERIFIED; do not infer administrative ownership from a URL.

## Brand identities: keep separate until proved connected

Movie publication:
- Current website: https://movies.greybrain.in/
- Old website: https://greybrainer-movies.netlify.app/
- LinkedIn: https://www.linkedin.com/company/greybrainer/
- Instagram: https://www.instagram.com/greybrainlens/
- X: https://x.com/Greybrainlens
- Facebook share link: https://www.facebook.com/share/1DmapQ7Hw3/
- Observed Facebook public canonical:
  https://www.facebook.com/p/GreyBrain-Lens-61579482744883/
- Medium: https://medium.com/@GreyBrainer

Related parent brand, not automatically the same publication:
- https://greybrain.ai/ currently presents GreyBrain School of AI.
- LinkedIn /company/greybrain/, Instagram @greybrain.ai, X @GreybrainAI and
  YouTube @greybrain-schoolofai are a different profile set.
- The old https://greybrain.ai/lens route returned 404 during the last public audit.

A single business may legitimately own both brands. Discover the actual structure;
do not label a shared asset wrong solely because its owner is the parent business.

## Known identifiers to locate, not blindly install

| Identifier | Observed source |
| --- | --- |
| GTM-N8J3ZGXD | Current Cloudflare and old Netlify movie-site container |
| G-BQ36BCQTTX | Original movie-site/engine GA4 measurement ID |
| G-WKZ673L21P | GA4 ID embedded on parent greybrain.ai |
| AW-18302182151 | Google Ads tag embedded on parent greybrain.ai |
| 1594000952276484 | Meta Pixel ID embedded on parent greybrain.ai |
| 2071191450275366 | Dataset reportedly named GreyBrain API in an earlier browser audit |
| 115664838870177 | Earlier audit's Meta account/context ID; its object type is unconfirmed |
| 61579482744883 | Identifier in Facebook's public GreyBrain Lens canonical URL, not a pixel ID |

On 7 November 2026, Google's publicly served GTM-N8J3ZGXD resource had no configured
tags or rules. Recheck it; do not assume it is unchanged or was always empty.
The movie code originally had direct G-BQ36BCQTTX; a later commit replaced it with
GTM. Its original Meta snippet had a placeholder, not a confirmed numeric pixel.

## A. Google Tag Manager

Open https://tagmanager.google.com/ and ask me to sign in if needed.

1. Locate GTM-N8J3ZGXD among the accounts/containers accessible to this login.
2. Record the account name/ID, container name, internal container ID, public ID,
   container type, and current user's visible role/permissions.
3. Record the published version number/date separately from unpublished workspace
   changes. A resource-format version in a downloaded script is not the live
   container publication/version history.
4. Read the live version's tag names/types/destinations, triggers, hostname filters
   and consent settings. Do not open or disclose secrets in custom variables/tags.
5. Read the version history for earlier GA4/Meta configuration if available.
   Do not restore or publish any version.
6. If the target is missing, ask me to switch to another relevant Google login.
   Write "not accessible in login A", not "does not exist".

## B. Google Analytics

Open https://analytics.google.com/ and ask me to sign in/switch if necessary.

1. Locate properties/web streams matching G-BQ36BCQTTX and G-WKZ673L21P. Search
   likely Greybrainer/GreyBrain properties and inspect stream IDs; do not assume
   an account name must contain the publication's name.
2. For each matching stream, record account name/ID, property name/ID, web stream
   name/ID, measurement ID, configured website URL and current access role.
3. Determine whether the stream is for the movie site, old engine, parent school,
   or a deliberately shared site. Record what the UI proves and what remains unknown.
4. Note GTM/Google tag associations and recent receiving activity if accessible,
   without creating test events, exporting users or opening unrelated reports.
5. Identify whether a suitable movie-site stream already exists elsewhere in the
   accessible account. Do not create a new property or stream.

## C. Google Search Console

Open https://search.google.com/search-console.

1. Look for a domain property covering greybrain.in or a URL-prefix property for
   https://movies.greybrain.in/. Also note related greybrain.ai coverage separately.
2. Record property scope, current user's permission, and verified-owner status or
   verification method if visible. Do not copy verification tokens into the report.
3. Check whether https://movies.greybrain.in/sitemap.xml is already submitted;
   record status, last read, discovered URLs and errors/warnings.
4. If accessible, inspect the known public Mohra article URL:
   https://movies.greybrain.in/reviews/mohra-1994-review-greybrainer-craft-analysis
   Record its indexing/canonical state. Do not request indexing or submit anything.
5. If no matching property is available, ask about another login; do not create
   properties, add owners, change DNS or claim absence from one account's list.

## D. Facebook/Meta business, page, Instagram and datasets

Open https://business.facebook.com/ and ask me to log in to the relevant Facebook
account. If that dashboard is unavailable, use the page's normal professional/admin
dashboard through supported UI. No API tokens or login workarounds.

1. Locate GreyBrain Lens using the public destination above. Confirm its actual
   Page/profile ID from admin settings; do not assume the public URL suffix proves
   its API object type. Record page name, canonical URL, type and available access.
2. Identify the owning business portfolio name/ID, if any. Distinguish full control
   from task access and ownership from an agency/partner sharing arrangement.
   Do not enumerate other people's private contact information.
3. Inspect linked accounts and determine whether @greybrainlens is connected.
   Record its username, professional account type, Instagram account ID if shown,
   linked Facebook Page ID and portfolio. Keep @greybrain.ai separate.
4. Open https://business.facebook.com/events_manager2/.
5. Locate 1594000952276484 and 2071191450275366 if accessible. For each, record the
   displayed name/type, owner portfolio, current permissions, connected domains,
   linked ad-account IDs and browser/server integration types where visible.
6. Determine what object 115664838870177 actually identifies if the UI exposes it.
   Do not treat an Events Manager URL parameter as proof it is a pixel or ad account.
7. Check whether a film-specific dataset already exists or whether the owner
   deliberately uses a parent dataset. If the UI cannot establish intent, ask me.
8. Record recent domain/event names only if needed to distinguish school from film
   traffic. Do not export visitor payloads, customer lists or personal event fields.
9. Do not create pixels, generate tokens, enable CAPI, change advanced matching,
   connect assets, add admins, edit domain verification, start ads or modify budgets.

## E. LinkedIn company page

Open https://www.linkedin.com/company/greybrainer/ and ask me to log in if needed.

1. Switch to the page's normal admin view if my login provides it.
2. Record page name, public URL, numeric organization/Page ID when visible in its
   admin URL/settings, page type and the current user's admin role.
3. Record its website field. A previous public check showed https://greybrain.ai/,
   which now leads to the parent school; recheck rather than editing it.
4. Distinguish /company/greybrainer/ from /company/greybrain/ and greybrain-ai.
5. If a relevant Campaign Manager/Insight association is already visible, record
   the related account/partner identifier without creating an ad account or tag.
   Do not branch into unrelated campaigns, DMs, contacts, billing or reporting.
6. Having page-admin access is not proof an external publishing provider has the
   OAuth permission to publish as the organization. Keep those statuses separate.

## F. Instagram, X and Medium

For each named movie profile, ask me to sign in only if it adds useful ownership
evidence unavailable from public pages.

1. Confirm exact username, profile URL, display name and current website/bio URL.
2. Record whether the signed-in user can manage that profile. Do not inspect DMs,
   private contacts, drafts, customer data, recovery methods or saved credentials.
3. For Instagram, prefer the Meta linked-account evidence from section D.
4. For X/Medium, do not create apps, grant publisher access, generate tokens or
   change subscription plans. Medium stays a historical distribution/archive asset,
   not an instruction to resume using it as the primary publishing source.

## G. Existing social publishing providers, only if I identify the right login

A historical configuration mentioned https://digisocial.greybrain.ai/ (CFPostiz)
and SocialBu. Ask me whether either is still used and which account/workspace is
ours before trying to sign in. Do not guess provider URLs or probe private APIs.

If I identify a provider and authorize inspection:
1. Read connected-channel names, platform IDs, exact usernames and connection status.
2. Compare them with the movie profiles above, especially LinkedIn and Instagram.
   An earlier audit found parent-brand identities mixed into the channel list.
3. Record reconnect/expired status if shown. Do not refresh connections, authorize
   new scopes, obtain API keys, open private drafts or schedule/publish a test post.
4. Label a provider's "connected" badge as configuration evidence only, not a
   successful end-to-end publishing test.

## Final deliverable: private ownership map, no changes

Produce a table with one row per actual asset:

| Brand | Platform | Asset name | Identifier and object type | Public/admin URL | Owning account/portfolio | My role | Linked website/assets | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use these statuses: CONFIRMED / HISTORICAL / REPORTED / NOT ACCESSIBLE / UNVERIFIED.
Mask personal login emails. Asset IDs such as GA measurement IDs and public page
IDs may be recorded, but no secrets, session data, invitation links or verification
tokens. Give redacted screenshots only where they prove a relevant relationship.

Then give:
1. Existing assets that can probably be reused, with the evidence and any remaining
   ownership/intent question. Do not mark reuse approved merely because I can log in.
2. Missing links or identity mismatches, such as movie profiles pointing to the
   AI-school website, or a publishing provider connected to the wrong profile.
3. A separate list of assets inaccessible from each tested login. Do not call them
   nonexistent unless the owner and evidence establish that conclusion.
4. A proposed movie-site mapping: intended GTM, GA4 stream, Search Console property,
   Meta dataset, Facebook Page, Instagram account, LinkedIn organization, X and Medium.
5. The smallest setup plan, prioritizing confirmed existing assets over duplicates.
6. A mutation log stating "No changes made", unless I explicitly approved a specific
   action later. Stop after this inventory; do not begin implementation automatically.

Give me the report privately in this chat or as a local/downloadable file. Do not
post it to a public repository or send it to another person/service.
