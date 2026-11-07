# Greybrainer handles, websites and tracking inventory

Read-only inventory, 7 November 2026. Public GTM resource rechecked at 12:28 IST
(06:58 UTC). No application, account, DNS, social profile or tracking changes.

## Findings in plain terms

The movie publication and parent GreyBrain brand have different profile sets and
different tracking histories. Existing identifiers must be mapped to their owning
accounts before adding or replacing anything. Missing access in one signed-in
account does not establish that an asset does not exist elsewhere.

Both the old Netlify movie site and the current Cloudflare movie site still use
the same GTM container. The parent's live website has direct GA4, Google Ads and
Meta Pixel IDs that the movie sites do not currently embed. Do not automatically
copy the parent's tags into the film publication.

## Movie-publication social profiles

| Platform | Existing destination | Evidence and limitation |
| --- | --- | --- |
| LinkedIn | https://www.linkedin.com/company/greybrainer/ | In old/current site navigation. Public page says GreyBrainer, Movies/Videos/Sound, Movie Minds Meet Machine Magic. Its website field still points to greybrain.ai. Admin access not proved. |
| Instagram | https://www.instagram.com/greybrainlens/ | In old/current navigation and previously supplied by owner. Public fetch throttled; no new admin/ownership claim. |
| X | https://x.com/Greybrainlens | In old/current navigation and previously supplied by owner. Public fetch returned 403; no new admin/ownership claim. |
| Facebook | https://www.facebook.com/share/1DmapQ7Hw3/ | In old/current navigation. Anonymous HTTP fetch followed it to GreyBrain Lens; page title and canonical metadata confirmed the stable destination below. |
| Medium | https://medium.com/@GreyBrainer | In old Netlify footer. Public profile displays GreyBrain Lens and film articles. Absent from new primary navigation but retained in article structured data/source links. |

Facebook's stable public canonical destination:
https://www.facebook.com/p/GreyBrain-Lens-61579482744883/

The numeric suffix is the public profile/page identifier from its canonical URL,
not a Meta Pixel, dataset, ad account or proof of administrative ownership.

No dedicated movie YouTube channel was found in the movie site's inspected source
or navigation. This is not proof that the owner has no such channel.

## Tracking identifiers, by actual source

| Identifier | Type | Where found | What is proved |
| --- | --- | --- | --- |
| GTM-N8J3ZGXD | Google Tag Manager container | Live Netlify and Cloudflare movie HTML, both layouts in Git history | Both movie deployments reference it. Google's served resource currently has zero configured tags/rules; account ownership and historical versions not visible. |
| G-BQ36BCQTTX | GA4 measurement ID | Initial movie layout, original Firebase client configs in both movie/engine code | Genuine historical project ID. Direct GA4 was removed when GTM was added. Correct property/stream owner and current receiving data still need verification. |
| G-WKZ673L21P | GA4 measurement ID | Live https://greybrain.ai/ HTML | Currently embedded by the parent's AI-school website, not directly embedded by the movie sites. Receiving data/owner not independently verified. |
| AW-18302182151 | Google Ads tag/conversion identifier | Parent website's Google tag config | Embedded on parent website. Not the Google Ads customer account ID, and not a confirmed movie conversion destination. No ad configuration/spend changed. |
| 1594000952276484 | Meta Pixel ID | Parent website's fbq init/noscript pixel | A real numeric pixel is embedded on the parent website. Its business owner, intended movie use and receiving-side events still need verification. |
| 2071191450275366 | Dataset reportedly named GreyBrain API | Owner-supplied independent browser audit | Reported account finding, not independently verified here. Distinct from the parent's public pixel ID above; no assumption that they are the same integration. |
| 115664838870177 | Account/context ID from Meta Events Manager audit | Owner-supplied browser report | Type/ownership not independently confirmed; do not silently treat it as a verified movie ad account or pixel. |
| PLACEHOLDER_PIXEL_ID | Placeholder, not an identifier | Initial movie layout | The movie source initially contained a Meta boilerplate placeholder, then removed it. No real movie Meta ID was found in the inspected layout history. |

No LinkedIn Insight partner ID was found in the inspected public movie layouts or
served empty GTM resource. A LinkedIn profile link does not itself require an
Insight tag. No destination is inferred from a social username.

## Website comparison

| Surface | Live observation | Social/tag observation |
| --- | --- | --- |
| https://movies.greybrain.in/ | 200, Cloudflare | X, LinkedIn, Facebook, Instagram; GTM-N8J3ZGXD; no direct GA4/pixel ID found in HTML. |
| https://greybrainer-movies.netlify.app/ | 200, Netlify | All five movie profiles including Medium; same GTM-N8J3ZGXD; no direct GA4/pixel ID found in HTML. |
| https://greybrain.ai/ | 200, currently GreyBrain School of AI | Different parent profiles, GA4 G-WKZ673L21P, Ads AW-18302182151 and Pixel 1594000952276484. |
| https://greybrain.ai/lens | 404 in direct fetch | Parent global shell still includes parent tracking/social links. This is not evidence of an active Lens page or a movie-specific tag. |

The current empty GTM configuration is shared by both movie deployments. Moving
to Cloudflare did not replace the movie container ID. This does not prove that
the container was always empty or establish when remote tag changes occurred.

## Parent-brand profiles are a different set

Observed in https://greybrain.ai/ public links:

- LinkedIn: https://www.linkedin.com/company/greybrain/
- Instagram: https://www.instagram.com/greybrain.ai
- X: https://x.com/GreybrainAI
- Facebook share link: https://www.facebook.com/share/188dT9AhBv/
- YouTube: https://youtube.com/@greybrain-schoolofai

Do not merge these with @greybrainlens or /company/greybrainer simply because
the names share a root. Account ownership and intended brand use require confirmation.

## Important historical change

Commit `ba444ce` (11 May 2026) put direct GA4 `G-BQ36BCQTTX` and the placeholder
Meta snippet in the initial movie layout.

Commit `082753e` (11 May 2026) explicitly:
1. Removed the direct GA4 script/config.
2. Removed the Meta placeholder snippet.
3. Added GTM-N8J3ZGXD.
4. Added the five supplied movie social links to the footer/navigation.

This is a tag implementation history, not proof of successful analytics collection.
The remote GTM account's version history is needed to establish what it contained
at different times after that change.

## Connected publishing accounts are not the same as profile links

- Production D1 `social_accounts` currently has zero rows (read-only query of public
  profile/status columns). This does not imply the external profiles are missing.
- The available SocialAPI connector exposed four connections but none matching
  Greybrain/Greybrainer. No posts, messages or unrelated account content were read.
- A historical engine audit, `specs/PUBLISHING_WIRING_AUDIT.md` dated 10 October,
  reported CFPostiz had all five channel types but some were wrong identities:
  LinkedIn GreyBrain AI Cinema / greybrain-ai and Instagram @greybrain.ai rather
  than the requested film profiles. Those historical mappings are not current
  OAuth verification and must not be used to dispatch without checking.
- Automated social dispatch remains disabled. Public social links, tracking pixels
  and authenticated publishing connections are three separate concerns.

## Reuse-first plan for owner review — not executed

1. Find the owning Google account for GTM-N8J3ZGXD and G-BQ36BCQTTX. Check the
   existing property's web streams and domain history. Prefer the existing intended
   movie property/container if confirmed; do not create duplicates just because the
   browser auditor was signed into an account showing only Santaan assets.
2. In Meta, inspect both 1594000952276484 and 2071191450275366: names, owners,
   connected domains, integrations and intended brand scope. Choose a confirmed
   existing movie destination or an explicitly approved shared setup. Create a new
   dataset only if that inventory confirms it is needed.
3. Keep the five movie profile identities. Propose replacing the opaque Facebook
   share URL with its stable public destination. Keep Medium available as archive
   access rather than reinstating it as the primary content source.
4. Confirm/update movie profile website/bio links to https://movies.greybrain.in/.
   LinkedIn currently points readers at the parent AI-school domain. Review its
   prediction-focused description against the current evidence-based positioning.
   All profile edits require a separate approved change; none was made here.
5. Only then implement the agreed consent/privacy controls, the selected existing
   GA4/Meta destinations, canonical-production hostname restrictions and sanitized
   receipt-backed enquiry events. Do not copy the parent's Ads tag or activate ads.
6. Verify real receiving-side events and Search Console ownership/sitemap status.
   If social automation is later approved, separately verify exact platform profile
   IDs and OAuth permissions before a real, explicitly approved test post.

## Evidence and limitations

Repository: `satishskid/greybrainer-movies-web`, branch `claude/cloudflare-storefront`.
Historical movie engine configuration: `services/firebaseConfig.ts` in
`satishskid/greybrainer-movie-reviewer-ai`; inspected as text only. No Firebase or
Firestore was initialized, read or queried.

Public snapshots are local under `/tmp/greybrainer-*-inventory.html` and
`/tmp/greybrainer-*-account-inventory.html`. They contain public HTML only, no
session cookies or account exports. This report is the durable summary; /tmp is
not a backup strategy. No app code or production deployment was changed.

Primary public pages checked:
- https://movies.greybrain.in/
- https://greybrainer-movies.netlify.app/
- https://greybrain.ai/
- https://www.linkedin.com/company/greybrainer/
- https://medium.com/@GreyBrainer
- https://www.facebook.com/share/1DmapQ7Hw3/
- https://www.googletagmanager.com/gtm.js?id=GTM-N8J3ZGXD
