// Client-side analytics for TOFU-MOFU-BOFU engagement tracking

export type FunnelEvent =
  | { name: "tofu_wire_subscribed"; email: string; persona: string }
  | { name: "mofu_service_tab_view"; service: string }
  | { name: "mofu_specimen_tab_view"; tab: string }
  | { name: "bofu_vip_registered"; email: string; role?: string; studio?: string }
  | { name: "bofu_nda_inquiry_clicked"; channel: string };

export function trackFunnelEvent(event: FunnelEvent) {
  try {
    if (typeof window === "undefined") return;

    // Send asynchronously without blocking navigation
    const payload = {
      ...event,
      url: window.location.href,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Non-blocking
  }
}
