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

test("success requires a matching storage receipt; lost responses remain failures", async () => {
  const token = process.env.STUDIO_ENQUIRY_TOKEN;
  const url = process.env.STUDIO_ENQUIRY_URL;
  const originalFetch = globalThis.fetch;
  process.env.STUDIO_ENQUIRY_TOKEN = "test-only";
  process.env.STUDIO_ENQUIRY_URL = "https://example.com/enquiries";
  const requestId = "12345678-1234-1234-1234-123456789abc";
  const request = () => new Request("https://movies.greybrain.in/api/studio-diagnostic", { method: "POST", body: JSON.stringify({ email: "qa@example.com", requestId }) });
  try {
    globalThis.fetch = async () => Response.json({ success: true, receiptId: requestId });
    assert.equal((await POST(request())).status, 200);
    globalThis.fetch = async () => Response.json({ success: true, receiptId: "wrong" });
    assert.equal((await POST(request())).status, 503);
    globalThis.fetch = async () => { throw new Error("Network lost"); };
    assert.equal((await POST(request())).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    if (token === undefined) delete process.env.STUDIO_ENQUIRY_TOKEN; else process.env.STUDIO_ENQUIRY_TOKEN = token;
    if (url === undefined) delete process.env.STUDIO_ENQUIRY_URL; else process.env.STUDIO_ENQUIRY_URL = url;
  }
});
