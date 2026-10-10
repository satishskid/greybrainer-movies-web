import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllArticles, getArticleBySlug } from "./articles";

test("public readers use Cloudflare and preserve the archive without Firestore", async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    assert.equal(url.includes("firestore.googleapis.com"), false);
    if (url.includes("/api/public/lens/manifest")) {
      return Response.json({ entries: [{
        slug: "verified-cloudflare-review", title: "Verified Cloudflare Review",
        blogMarkdown: "Evidence-based research. ".repeat(120),
        canonicalUrl: "https://movies.greybrain.in/reviews/verified-cloudflare-review",
      }] });
    }
    return new Response("<rss><channel></channel></rss>");
  };
  try {
    const article = await getArticleBySlug("verified-cloudflare-review");
    assert.equal(article?.source, "cloudflare");
    const articles = await getAllArticles(500);
    assert.ok(articles.some((item) => item.source === "lens-archive"));
    assert.ok(articles.some((item) => item.slug === "verified-cloudflare-review"));
    assert.ok(requests.some((url) => url.includes("/api/public/lens/manifest")));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
