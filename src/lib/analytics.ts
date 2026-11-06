// Client-side analytics for TOFU-MOFU-BOFU engagement tracking

export type FunnelEvent =
  | { name: "tofu_wire_subscribed"; email: string; persona: string }
  | { name: "mofu_service_tab_view"; service: string }
  | { name: "mofu_specimen_tab_view"; tab: string }
  | { name: "bofu_vip_registered"; email: string; role?: string; studio?: string }
  | { name: "bofu_nda_inquiry_clicked"; channel: string };

// ponytail: no-op until an analytics sink exists on Cloudflare; the old Firebase sink also collected emails.
export function trackFunnelEvent(_event: FunnelEvent) {}
