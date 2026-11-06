# Cloudflare production storefront

The production storefront is `greybrainer-storefront`, a public-only vinext Worker.
It has only `ASSETS` and a `BACKEND` service binding to `greybrainer-production`.
It has no database, Gemini key, Firebase configuration or authoring routes.

The separate `wrangler.production.json` is selected with `STOREFRONT_PRODUCTION=true`.
The existing preview configuration remains the default; never deploy the production build with the preview command.

```sh
STOREFRONT_PRODUCTION=true NEXT_PUBLIC_SITE_URL=https://movies.greybrain.in npm run build:vinext
node_modules/.bin/wrangler deploy --config dist/server/wrangler.json
```

Inspect the generated config before deploying: name `greybrainer-storefront`,
`BACKEND=greybrainer-production`, `workers_dev=false`, `preview_urls=false`,
canonical URL `https://movies.greybrain.in`, and no custom routes.
This initial deployment is reachable only through service bindings. Do not enable
a workers.dev URL with the production indexing configuration.

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

Before public routing: verify the signed-in Studio session, current approval,
one website-only publication receipt, real uploaded assets, anonymous pages,
SEO and the write-freeze allowlist. The Netlify domain has not been switched by
creating or deploying this configuration.
