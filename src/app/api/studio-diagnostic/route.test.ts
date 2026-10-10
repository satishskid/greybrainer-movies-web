import { test } from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "./route";

test("private leads cannot be listed publicly", async () => {
  assert.equal((await GET()).status, 403);
});
test("invalid enquiries are rejected", async () => {
  for (const body of ["not-json", JSON.stringify({ email: 123 }), JSON.stringify({ email: "bad" })]) {
    assert.equal((await POST(new Request("https://movies.greybrain.in/api/studio-diagnostic", { method: "POST", body }))).status, 400);
  }
});
test("missing durable delivery cannot produce a success receipt", async () => {
  const response = await POST(new Request("https://movies.greybrain.in/api/studio-diagnostic", { method: "POST", body: JSON.stringify({ email: "qa@example.com" }) }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
});
