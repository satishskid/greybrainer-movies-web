import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllArticles, getArticleBySlug } from "./articles";
import { SITE_URL } from "./site";

const entry = (slug: string, status: string, canonicalUrl = `${SITE_URL}/reviews/${slug}`) => ({
  slug, title: slug, blogMarkdown: "Evidence-based research. ".repeat(120), canonicalUrl,
  tags: ["film", status, "website"], imageAttribution: "Images: TMDB.",
});

const fetcher = (entries: unknown[], seen: string[] = []) => async (path: string) => {
  seen.push(path);
  return Response.json({ entries });
};

test("listings read only the public manifest and show only verified-live articles", async () => {
  const seen: string[] = [];
  const articles = await getAllArticles(50, fetcher([entry("live", "published"), entry("unverified", "pending_verification"), entry("elsewhere", "published", "https://greybrainer-dev.pages.dev/reviews/elsewhere")], seen));
  assert.deepEqual(articles.map(a => a.slug), ["live"]);
  assert.deepEqual(seen, ["/api/public/lens/manifest?limit=50"]);
  assert.equal(articles[0].coverImageUrl, undefined, "no stock-photo cover is invented");
});

test("an article awaiting verification renders by slug but is never labelled live", async () => {
  const article = await getArticleBySlug("unverified", fetcher([entry("unverified", "pending_verification")]));
  assert.equal(article?.status, "pending_verification");
  assert.equal(await getArticleBySlug("missing", fetcher([])), null);
});

test("a failing backend yields no articles rather than legacy fallbacks", async () => {
  assert.deepEqual(await getAllArticles(10, async () => new Response("down", { status: 503 })), []);
});
