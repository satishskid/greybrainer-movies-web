import { test } from "node:test";
import assert from "node:assert/strict";
import { consentPreferences, consentValue, trackingAllowed } from "./measurement-consent";

test("tracking requires an explicit choice on the canonical public site", () => {
  assert.equal(trackingAllowed(true, "movies.greybrain.in", "/reviews/mohra", "analytics"), true);
  for (const consent of [null, "necessary", "invalid"]) assert.equal(trackingAllowed(true, "movies.greybrain.in", "/", consent), false);
  assert.equal(trackingAllowed(false, "movies.greybrain.in", "/", "analytics"), false);
  assert.equal(trackingAllowed(true, "localhost", "/", "analytics"), false);
  for (const path of ["/studio", "/studio/inbox", "/engine/", "/hub", "/api/test"]) assert.equal(trackingAllowed(true, "movies.greybrain.in", path, "analytics"), false);
});

test("analytics and marketing are independent, including old saved analytics consent", () => {
  for (const [value, analytics, marketing] of [["necessary", false, false], ["analytics", true, false], ["marketing", false, true], ["both", true, true]] as const) {
    assert.deepEqual(consentPreferences(value), { analytics, marketing, decided: true });
    assert.equal(consentValue(analytics, marketing), value);
    assert.equal(trackingAllowed(true, "movies.greybrain.in", "/", value), analytics);
    assert.equal(trackingAllowed(true, "movies.greybrain.in", "/", value, "marketing"), marketing);
    assert.equal(trackingAllowed(false, "movies.greybrain.in", "/", value, "marketing"), false);
    assert.equal(trackingAllowed(true, "preview.workers.dev", "/", value, "marketing"), false);
    assert.equal(trackingAllowed(true, "movies.greybrain.in", "/studio/inbox", value, "marketing"), false);
  }
  for (const invalid of [null, "", "true", "granted", '{"analytics":true}', "invalid"]) assert.deepEqual(consentPreferences(invalid), {analytics:false, marketing:false, decided:false});
});
