# Cloudflare production storefront

The production storefront is `greybrainer-storefront`, a public-only vinext Worker.
It has `ASSETS`, a read-only `BACKEND` service binding to `greybrainer-production`,
and an `ENQUIRIES` binding to a separate private enquiry intake Worker.
It has no database, Gemini key, Firebase configuration or authoring routes.

Archive restored on 2026-11-07: 127 public articles, including the former Netlify
library. Historical publications are labelled and retain their original dates;
they are not new editorial approvals. See [the verification record](ARCHIVE_RESTORATION.md)
for the current deployment IDs and checks. Older version IDs below are historical.

## Live flow

```text
engine.greybrain.in
  -> temporary, non-cached redirect
  -> greybrainer-production.satish-9f4.workers.dev (owner-only Access)
  -> same-origin API -> production D1 + content/knowledge R2
  -> owner's approval -> website publication

movies.greybrain.in (zone account 27f...)
  -> greybrainer-movies-proxy
  -> secret-authenticated greybrainer-storefront (app account 9f4...)
  -> public-only BACKEND routes -> approved publication artifacts

public enquiry -> storefront -> private ENQUIRIES Worker -> enquiry R2
```

The zone and application are in different Cloudflare accounts. The routing Worker
keeps the database and engine in the application account. It never forwards author
cookies/credentials and denies authoring paths. The origin workers.dev endpoint
requires a separate relay secret and sends noindex; anonymous direct requests return
404. The canonical public response remains indexable.

The separate `wrangler.production.json` is selected with `STOREFRONT_PRODUCTION=true`.
The existing preview configuration remains the default; never deploy the production build with the preview command.

```sh
STOREFRONT_PRODUCTION=true NEXT_PUBLIC_SITE_URL=https://movies.greybrain.in npm run build:vinext
node_modules/.bin/wrangler deploy --config dist/server/wrangler.json
```

Inspect the generated config before deploying: name `greybrainer-storefront`,
`BACKEND=greybrainer-production`, `ENQUIRIES=greybrainer-production-enquiries`,
`main` compiled from `worker/storefront.mjs`, `workers_dev=true`, `preview_urls=false`,
canonical URL `https://movies.greybrain.in`, and no direct custom routes. Never
replace the guarded entry with the bare vinext handler while workers.dev is enabled.

`PUBLIC_RELAY_TOKEN` is a Worker secret shared only by the public routing Worker
and storefront. `STUDIO_ENQUIRY_TOKEN` matches the private intake Worker's
`ENQUIRY_TOKEN`; it is not a browser credential. No secret belongs in config vars.

```sh
node_modules/.bin/wrangler deploy --config wrangler.public-proxy.json --keep-vars
node_modules/.bin/wrangler deploy --config wrangler.engine-redirect.json --keep-vars
```

The public DNS record is a proxied, origin-free AAAA `100::`, not a Netlify CNAME.
The `movies.greybrain.in/*` Worker route handles requests before an origin is used.
This is Cloudflare's documented originless setup:
https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#originless-setups
The old Netlify deployment and exact DNS/proxy backups remain available for rollback.

Publication manifests preserve canonical-host filtering. Of the imported 43 live
manifest entries, only one currently uses the accepted public host; old-domain
records are not silently made visible by deployment.
The manifest request includes this site's `origin`, so the backend excludes
other-domain metadata before downloading R2 report bodies. The existing client
canonical-host check remains a second filter. A bound production homepage probe
improved from 11,651 ms to 1,266 ms with identical rendered content.

Uploaded raster images use `/api/assets/<encoded key>`. This route accepts only
`draft-assets/<draft>/<filename>` with raster-image extensions and MIME types;
it cannot read report JSON, knowledge objects, SVG, arbitrary paths or private APIs.
Backend cookies are not forwarded. Existing external TMDB images remain external.
Public robots explicitly allows `/api/assets/`, while other API paths stay disallowed.
Latest production storefront version: `fbdd58d8-8aaf-499c-9db3-862a392d7293`;
28 storefront tests pass, with public checks refreshed on 2026-11-07.

## Acceptance and operation

The owner approved Mohra production version `version_b4060cc83c984e91906dad00e7d0548e`.
Receipt `pub_04db04a9826c46cdbebc231b8c5e7cdd` is website-only and matches that version.
Anonymous HTTPS content/image/canonical verification on the real domain returned live.
The uploaded-cover route returned 125,208 JPEG bytes with the source's exact hash.
Homepage, archive, article, JavaScript, CSS, robots and sitemap returned 200; public
authoring routes returned 404. There are no social publication rows for acceptance.

An explicitly labelled internal enquiry QA record (not a customer) is stored at
`enquiries/6e5b07ea-4f8a-4a2b-bc09-3a861875bc9c.json` in the private enquiry bucket.
Two submissions returned the same confirmed receipt. No email was sent.
Enquiries are retained in R2; an inbox/notification UI is not part of this release.

The operating flow is Inbox -> research -> Prepare -> review -> Approve all and
publish. Use the saved report after quota/network interruption rather than starting
over. Download the reviewed social kit for manual posting. Social dispatch and cron
remain disabled. No billing plan was upgraded; normal account-wide quotas still apply.

Before any future caller switch, repeat the acceptance and write-freeze checks.
After ordinary editing starts, rollback requires a fresh D1/R2 delta backup and
owner acceptance of any D1-only articles being hidden by the older site.
