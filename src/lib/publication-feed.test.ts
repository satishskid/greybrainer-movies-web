import { test } from "node:test";
import assert from "node:assert/strict";
import { isPublicWebsiteEntry, publicApi } from "./publication-feed";

test("only this site's canonical /reviews/ pages enter the website", () => {
  assert.equal(isPublicWebsiteEntry({ canonicalUrl: "https://movies.greybrain.in/reviews/real-review" }, "https://movies.greybrain.in"), true);
  for (const canonicalUrl of [undefined, "invalid", "https://greybrainer-author-preview.satish-9f4.workers.dev/preview/lens/test", "https://movies.greybrain.in/preview/lens/test", "https://other.example/reviews/x"]) {
    assert.equal(isPublicWebsiteEntry({ canonicalUrl }, "https://movies.greybrain.in"), false);
  }
});

test("the storefront refuses to call any non-public backend route", async () => {
  for (const path of ["/api/drafts", "/api/team", "/mcp", "/api/public/../drafts?x", "/api/public/lens/manifest", "https://evil/api/public/lens/manifest?x"]) {
    await assert.rejects(publicApi(path), /Refusing non-public backend path/);
  }
});
