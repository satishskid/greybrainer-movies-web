import { test } from "node:test";
import assert from "node:assert/strict";
import { trackConfirmedEnquiry } from "./enquiry-measurement";
import { NOINDEX } from "./site";

test("enquiries emit only an approved fixed payload after a matching receipt, once per tab", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const requestId = "12345678-1234-1234-1234-123456789abc";
  const sent = new Map<string, string>();
  let consent: string | null = null;
  const fake = {
    location: { hostname: "movies.greybrain.in", pathname: "/" },
    localStorage: { getItem: () => consent },
    sessionStorage: { getItem: (key: string) => sent.get(key), setItem: (key: string, value: string) => sent.set(key, value) },
    dataLayer: [] as unknown[],
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fake });
  const receipt = { success: true, receiptId: requestId, email: "must-not-leak@example.com", studioName: "Private studio" };
  try {
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), false);
    consent = "analytics";
    for (const invalid of [null, {}, { success: true }, { success: true, receiptId: "wrong" }, { success: false, receiptId: requestId }]) assert.equal(trackConfirmedEnquiry(requestId, true, invalid), false);
    assert.equal(trackConfirmedEnquiry(requestId, false, receipt), false);
    fake.location.hostname = "localhost";
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), false);
    fake.location.hostname = "movies.greybrain.in";
    fake.location.pathname = "/studio/inbox";
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), false);
    fake.location.pathname = "/";
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), !NOINDEX);
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), false);
    assert.deepEqual(fake.dataLayer, NOINDEX ? [] : [{ event: "generate_lead", lead_type: "filmmaker_enquiry" }]);
    consent = "necessary";
    assert.equal(trackConfirmedEnquiry(requestId, true, receipt), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("optional tracking cannot throw when storage is blocked", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    location: { hostname: "movies.greybrain.in", pathname: "/" },
    localStorage: { getItem: () => { throw new Error("blocked"); } },
  } });
  try {
    const id = "12345678-1234-1234-1234-123456789abc";
    assert.equal(trackConfirmedEnquiry(id, true, { success: true, receiptId: id }), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
