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

test('film titles drop the SEO suffix but keep the film and year', async () => {
  const { filmTitle } = await import('./articles');
  assert.equal(filmTitle('Pyre (2026) Review - Greybrainer Craft Analysis'), 'Pyre (2026)');
  assert.equal(filmTitle('Haiwaan - Greybrainer Forensic Analysis'), 'Haiwaan');
  assert.equal(filmTitle('Greybrainer Analysis: Fight Club'), 'Fight Club');
  assert.equal(filmTitle('Spider-Man: No Way Home'), 'Spider-Man: No Way Home');
});

test('a template dek is replaced by the report\'s own opening paragraph', async () => {
  const opening = 'Vinod Kapri\'s Pyre is a profoundly affecting Hindi drama about an elderly couple waiting decades for their son, told with patience and unusual authenticity.';
  const entry = { slug: 'pyre-2026-review', title: 'Pyre (2026) Review - Greybrainer Craft Analysis', canonicalUrl: `${SITE_URL}/reviews/pyre-2026-review`,
    dek: 'Explore Pyre (2026) through story, direction and performance, with evidence-linked craft analysis.',
    blogMarkdown: `# Pyre (2026): Greybrainer Craft Analysis\n\n## A Meditative Elegy\n\n${opening}\n\n` + 'More research. '.repeat(200) };
  const fetcher = async () => new Response(JSON.stringify({ entries: [entry] }));
  const article = await getArticleBySlug('pyre-2026-review', fetcher);
  assert.equal(article?.title, 'Pyre (2026)');
  assert.ok(article?.excerpt.startsWith('Vinod Kapri'), article?.excerpt);
});
