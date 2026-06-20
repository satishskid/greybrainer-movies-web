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
- Preparing a manual social pack for Medium, LinkedIn, X, Instagram, and Facebook.

Social posting is manual for now. The Hub generates copyable LinkedIn insight posts, carousel slide copy, X posts, Instagram carousel captions, Reel scripts, Facebook discussion posts, Medium notes, hashtags, image alt text, and UTM-tracked links.

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
