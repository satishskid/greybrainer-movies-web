import { test } from "node:test";
import assert from "node:assert/strict";
import { trackingAllowed } from "./measurement-consent";

test("tracking requires an explicit choice on the canonical public site", () => {
  assert.equal(trackingAllowed(true, "movies.greybrain.in", "/reviews/mohra", "analytics"), true);
  for (const consent of [null, "necessary", "invalid"]) assert.equal(trackingAllowed(true, "movies.greybrain.in", "/", consent), false);
  assert.equal(trackingAllowed(false, "movies.greybrain.in", "/", "analytics"), false);
  assert.equal(trackingAllowed(true, "localhost", "/", "analytics"), false);
  for (const path of ["/studio", "/studio/inbox", "/engine/", "/hub", "/api/test"]) assert.equal(trackingAllowed(true, "movies.greybrain.in", path, "analytics"), false);
});
