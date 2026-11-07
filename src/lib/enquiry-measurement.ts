import { CONSENT_KEY, trackingAllowed } from "./measurement-consent";
import { NOINDEX } from "./site";

/** Optional, best-effort measurement; never changes whether the enquiry succeeded. */
export function trackConfirmedEnquiry(requestId: string, responseOk: boolean, receipt: unknown): boolean {
  if (typeof window === "undefined" || !responseOk || !receipt || typeof receipt !== "object") return false;
  const result = receipt as Record<string, unknown>;
  if (result.success !== true || result.receiptId !== requestId || !/^[a-f0-9-]{36}$/i.test(requestId)) return false;
  try {
    if (!trackingAllowed(!NOINDEX, window.location.hostname, window.location.pathname, window.localStorage.getItem(CONSENT_KEY))) return false;
    const marker = `greybrainer_lead_sent:${requestId}`;
    if (window.sessionStorage.getItem(marker)) return false;
    // Receipt stays browser-local. Mark before dispatch to prevent replay in this tab.
    window.sessionStorage.setItem(marker, "1");
    const target = window as unknown as { dataLayer?: unknown[] };
    target.dataLayer = target.dataLayer || [];
    target.dataLayer.push({ event: "generate_lead", lead_type: "filmmaker_enquiry" });
    return true;
  } catch {
    return false;
  }
}
