import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { articleSchemaFacts, publicationDate } from "./article-schema";
import type { SiteArticle } from "./articleTypes";

const article = (overrides: Partial<SiteArticle> = {}): SiteArticle => ({
  id: "test", title: "Mohra (1994)", slug: "mohra", kind: "review",
  categoryLabel: "Review", content: "Research", editorial: null, excerpt: "Research",
  createdBy: "Greybrainer AI", publishedAt: null, publishedAtMs: 0,
  source: "cloudflare", status: "published", tags: [], type: "sovereign_review",
  faqs: [], relatedSlugs: [], inlineImageUrls: [], diagnosticImages: [],
  ...overrides,
});

test("a review label, year, poster and score do not confirm Movie identity or justify stars", () => {
  for (const overallScore of [undefined, "0", "7.5", "10", "-1", "11", "85", "7/10", "invalid"]) {
    assert.deepEqual(articleSchemaFacts(article({ overallScore, year: "1994",
      posterImageUrl: "https://image.tmdb.org/poster.jpg", layers: [{ label: "Story / Script", score: 8 }] })),
    { "@type": "Article" });
  }
});

test("all editorial kinds remain Articles without invented rating or modified date", () => {
  for (const kind of ["review", "brief", "insight", "comparison"] as const) {
    assert.deepEqual(articleSchemaFacts(article({ kind, publishedAt: "2026-11-06T16:21:45.576Z" })), {
      "@type": "Article", datePublished: "2026-11-06T16:21:45.576Z",
    });
  }
});

test("missing and invalid publication dates are omitted", () => {
  for (const value of [null, "", "not a date", "2026", "2026-99-99T00:00:00Z", "2026-02-30T00:00:00Z"]) {
    assert.equal(publicationDate(value), undefined);
    assert.deepEqual(articleSchemaFacts(article({ publishedAt: value })), { "@type": "Article" });
  }
});

test("sitemap uses only recorded dates and catalog title inherits the brand once", () => {
  const sitemap = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.ok(!sitemap.includes("new Date("));
  assert.ok(sitemap.includes("publicationDate(article.publishedAt)"));
  const catalog = readFileSync(new URL("../app/reviews/page.tsx", import.meta.url), "utf8");
  assert.match(catalog, /title: "Cinematic Intelligence & Deep Reviews",/);
  const route = readFileSync(new URL("../app/reviews/[slug]/page.tsx", import.meta.url), "utf8");
  assert.ok(route.includes("...articleSchemaFacts(article)"));
  assert.ok(!/reviewRating|itemReviewed|dateModified|new Date\(/.test(route));
});
