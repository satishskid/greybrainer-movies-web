# Archive recovery on Cloudflare

Completed 2026-11-07. Production remains https://movies.greybrain.in.

## Results

- 127 public articles: 53 reviews, 20 briefs, 43 studies/insights and 11 comparisons.
- Every one of the 114 old Netlify listing links is present.
- 42 hidden published engine reports had their canonical addresses restored.
- 83 missing articles were recovered into production D1/R2: 73 from the saved
  Medium archive and 10 from Netlify's serialized public article data.
- Those 125 restored report bodies match their originals by SHA-256.
- The already-public historical Haiwaan report is labelled as archive too, making
  126 historical articles plus the currently approved Mohra report.
- No draft was newly approved, no Gemini quota consumed, and no social post sent.

## Presentation and boundaries

Archive articles preserve original dates and state that they have not been
re-approved under the current editorial process. Missing modern Craftmatics
approvals are not invented. Missing posters do not squeeze headings into an
empty 160px column, and original Markdown images render safely.

`/reviews` includes every eligible publication and working category/title filters.
`/archive` contains historical articles only and no longer truncates at 100 entries.
The archive and every article are in the canonical sitemap. Exact article pages
read full published reports; listings request `view=summary` and use version-bound
historical projections, not full report downloads.

The public storefront still has only public backend paths over its service
binding. Private Studio/database/key routes remain inaccessible from this host.
The actual engine approval and website receipt checks are unchanged.

## Verification

- 127/127 article URLs: HTTP 200, correct canonical URL, one h1, no noindex.
- 127/127 articles in the sitemap; no duplicate slugs or missing old listing links.
- 117 unique cover/poster/thumbnail image URLs: successful image responses.
- Desktop 1440x1000 and mobile 390x844: 127 cards, working title search, 11
  comparison results, no horizontal overflow or uncaught page errors.
- Sampled restored article images loaded in the browser; original body/dates and
  archive notice are present. No-poster heading widths: 848px desktop/358px mobile.
- 29 storefront tests pass, typecheck and production build pass.
- Engine 308 tests pass across 46 isolated files; application/Worker types pass.
- Mohra's saved-content/canonical/image receipt verification remains `live`.
- Pyre/Ramayana remain unapproved editing drafts with no public URL.

Eleven historical reports never had a genuine saved cover. They are preserved
without unrelated stock-image substitutes; this is an artwork gap, not a broken
image URL. Historical factual claims and external citations have not been freshly
fact-checked as part of archive restoration.

## Deployment and evidence

- Storefront: `greybrainer-storefront`, version `804fd242-931e-4360-84ad-afaaf3bb86b7`.
- Backend: `greybrainer-production`, version `32f81589-98d5-42d0-b024-3f590c24abbd`.
- Public routing/DNS/Access/secrets and the old Netlify deployment were not changed.
- Full engine report: `specs/ARCHIVE_RESTORATION_2026-11-07.md` in
  `satishskid/greybrainer-movie-reviewer-ai`, branch `codex/cloudflare-factory-alignment`.
- Private evidence/rollback directory:
  `/Users/spr/Projects/greybrain/backups/greybrainer/2026-11-07/archive-restoration/`.

Repeatable signed-out checks:

```sh
node scripts/check-restored-archive.mjs <public-manifest.json> <restoration-plan.json> <audit.json>
node scripts/check-archive-browser.mjs <screenshots-directory>
```

The browser script uses a clean headless Chrome profile and only reads public
pages/uses catalog filters. It does not sign in, approve, generate, or publish.

Keep the existing Cloudflare deployment. Reverting to the old Netlify build would
restore multiple old content readers but still need new integration work for
production Studio publishing. Netlify remains available as reference/rollback.
