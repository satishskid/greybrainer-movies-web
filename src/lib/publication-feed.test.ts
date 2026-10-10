import { test } from "node:test";
import assert from "node:assert/strict";
import { isPublicWebsiteEntry, PRODUCTION_ENGINE_API } from "./publication-feed";

test("production feed is separate from the staging engine domain", () => {
  assert.equal(PRODUCTION_ENGINE_API, "https://greybrainer-omnichannel-api.satish-9f4.workers.dev");
});

test("only canonical public reviews enter the website", () => {
  assert.equal(isPublicWebsiteEntry({ canonicalUrl: "https://movies.greybrain.in/reviews/real-review" }), true);
  for (const canonicalUrl of [undefined, "invalid", "https://greybrainer-staging.satish-9f4.workers.dev/preview/lens/test", "https://movies.greybrain.in/preview/lens/test"]) {
    assert.equal(isPublicWebsiteEntry({ canonicalUrl }), false);
  }
});
