# Greybrainer Movies Website

Public movie intelligence site and Writer Hub for Greybrainer Lens content.

- Production: https://movies.greybrain.in
- Writer Hub: https://movies.greybrain.in/hub
- Repository: https://github.com/satishskid/greybrainer-movies-web
- Framework: Next.js App Router on Netlify
- Content database: Firebase Firestore `published_research`
- Image storage: Cloudflare R2 through protected upload routes

## Current Publishing Model

The website is the canonical publishing destination. Medium and social channels are still used manually by the content team, but the public website should receive the final article first.

See the full team operating procedure in [docs/CONTENT_WORKFLOW_SOP.md](./docs/CONTENT_WORKFLOW_SOP.md).

## Main Routes

- `/` - Homepage with published reviews, briefings, and insights.
- `/reviews` - Public listing of published reviews and Lens archive articles.
- `/reviews/[slug]` - Public article page with SEO metadata, structured data, diagnostics, FAQs, and related reads.
- `/hub` - Writer Hub inbox and manual draft creation.
- `/hub/[id]` - Writer editor for article content, SEO, images, social copy, and publish action.
- `/robots.txt` and `/sitemap.xml` - Search engine discovery.

## Writer Hub Responsibilities

The Hub is responsible for:

- Creating daily newsletter drafts written outside the engine.
- Refining engine-generated deep review drafts.
- Uploading cover and inline images to R2.
- Publishing articles to the public website.
- Previewing and approving social posts for LinkedIn, Instagram, Facebook, and X.
- Preparing a manual backup pack for Medium, LinkedIn, X, Instagram, and Facebook.

Social posting is manual until a publisher endpoint is connected. The Hub now shows per-channel previews, lets the writer approve channels, and can send the approved payload to `/api/social-publish`. It also keeps copyable LinkedIn insight posts, carousel slide copy, X posts, Instagram carousel captions, Reel scripts, Facebook discussion posts, Medium notes, hashtags, image alt text, GB card URLs, and UTM-tracked links.

## Engine Bridge

The Greybrainer Engine writes draft review documents into Firebase. Those drafts can include:

- SEO title and description.
- Search headline.
- 50-word verdict.
- Three-layer scores.
- Morphokinetics teaser.
- Producer/director insight.
- FAQ scaffolding.
- Diagnostic images for three-layer rings and Morphokinetics.

The public article page renders the diagnostic images automatically when present.

## Local Development

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run build
```

Known lint warnings currently come from existing `<img>` usage and the video generation script warnings. They are warnings, not build blockers.

## Deployment

Netlify builds from `main`.

Production deploy after the workflow hardening release:

- Commit: `7eae2c4`
- URL: https://movies.greybrain.in

## Current Cloudflare Publication Contract (11 October 2026)

Release branch: `codex/omni-publish-lane`. This release is manually deployed; it does
not merge the branch into `main`. Netlify still automatically builds `main`, so a later
main-branch deployment must include these fixes or it can replace this release.

For engine Studio publications, the website reads the production Cloudflare public
manifest, not a Firebase draft or staging endpoint. The legacy Hub/Firebase descriptions
above refer to retained workflows; they are not the source of the current Haiwaan release.

- Article slug reads are dynamic and bypass Next's data cache so a published version
  does not fall back to an older cached article. Listing pages keep a short cache.
- The Worker filters a requested slug before R2 hydration and bounds concurrent reads.
  This fixes a live connection-limit failure that previously triggered archive fallback.
- Saved image attribution is rendered alongside the unchanged official TMDB logo and
  `/credits`. Haiwaan's owner confirmed permission for its film imagery; other films need
  their own rights check. Attribution does not grant image rights.
- AI-assisted scores and waveform positions are explicitly described as interpretations,
  not measured audience retention or a validated scientific benchmark. Unsupported or
  unapproved Craftmatics scores remain unscored. Reviewer login emails stay private.
- Mobile navigation and article metadata fit narrow viewports. Markdown report headings
  do not create a second page-level H1.
- The original saved waveform is displayed before its expandable research interpretation;
  repeated teaser text no longer buries the graph above or inside the report-card section.

### Build And Deploy Together

For a manual release, build the Netlify-adapted server and deploy its matching static
folder. Deploying `.next` directly misses the `/_next/static` URL layout and public assets;
deploying only a plain Next build can reuse a stale Netlify server handler.

```bash
npx netlify build --context production
npx netlify deploy --prod --no-build --dir=.netlify/static --site=dd43b33b-fb45-41ba-8857-985409b2d622
```

Before signing off, verify the article, its stylesheet and `/tmdb-logo.svg` return HTTP
200 with appropriate content types, then check a desktop and phone browser screenshot.

Focused verification (13 passing tests):

```bash
npx tsx --test src/lib/articles.test.ts src/lib/publication-feed.test.ts src/components/research-presentation.test.tsx src/app/api/studio-diagnostic/route.test.ts
```

Haiwaan publication receipt: v27, 2026-10-11T02:38:12.387Z; full report 27,875 characters,
11 saved waveform points and TMDB cover. Five proposed Craftmatics assessments await
human review; all eight public criterion scores remain unscored. Website publication
was exercised through the real authenticated Studio. Live social delivery and a full
fresh Gemini generation after its daily free quota resets are not certified here.

Final website deployment: `6acb24850f1f571562c9f7f5`. The matching Worker release is
`566b940b-0377-4481-a04b-179cc9927fcd`, engine commit `f1aa6e3` on
`codex/public-research-contract`. Browser checks passed at widths 320, 390, 1024,
1280 and 1440: no horizontal overflow, loaded TMDB imagery/logo, one H1, no personal
Gmail address, eight correctly unscored criteria and 11 preserved waveform points.
The interpretation starts collapsed below the graph; the report itself was not rewritten.
Proof images and the responsive check record are saved locally under
`/Users/spr/.codex/visualizations/2026/10/11/01a128ae-e681-7750-ae46-76506bb9d3eb/`.
