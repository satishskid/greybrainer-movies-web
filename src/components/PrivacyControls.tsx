"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_KEY, GTM_ID, consentPreferences, consentValue, trackingAllowed } from "@/lib/measurement-consent";

function readConsent() {
  if (window.location.hostname !== "movies.greybrain.in") return "unavailable";
  try { return localStorage.getItem(CONSENT_KEY) || "unset"; } catch { return "unset"; }
}

function subscribe(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) window.location.reload();
    else onChange();
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export function PrivacyControls({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState<boolean | null>(null);
  const [marketingChoice, setMarketingChoice] = useState<boolean | null>(null);
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unavailable");
  const preferences = consentPreferences(consent);

  useEffect(() => {
    if (!enabled || window.location.hostname !== "movies.greybrain.in") return;
    const analytics = trackingAllowed(enabled, location.hostname, location.pathname, consent);
    const marketing = trackingAllowed(enabled, location.hostname, location.pathname, consent, "marketing");
    if (!analytics && !marketing) return;
    if (document.getElementById("greybrainer-gtm")) return;
    const target = window as unknown as { dataLayer: unknown[] };
    target.dataLayer = target.dataLayer || [];
    // Google ads remain denied even when Meta marketing consent is granted.
    // Google's queue accepts array-like command arguments, including arrays.
    function command(...args: unknown[]) { target.dataLayer.push(args); }
    command("consent", "default", { analytics_storage: analytics ? "granted" : "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    command("set", "ads_data_redaction", true);
    target.dataLayer.push({ event: "greybrainer_consent", analytics_consent: analytics ? "granted" : "denied", marketing_consent: marketing ? "granted" : "denied" });
    target.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    if (marketing) target.dataLayer.push({ event: "greybrainer_marketing_ready", marketing_consent: "granted" });
    const script = document.createElement("script");
    script.id = "greybrainer-gtm";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }, [enabled, consent]);

  function choose(value: string) {
    try { localStorage.setItem(CONSENT_KEY, value); }
    catch { setStorageError(true); return; }
    // A full reload removes previously loaded tracking scripts after withdrawal.
    window.location.reload();
  }

  return <>
    <footer className="mt-auto flex flex-wrap gap-5 border-t border-slate-700 px-6 py-5 text-sm text-slate-300">
      <a href="/privacy" className="underline">Privacy</a>
      <button type="button" onClick={() => { setAnalyticsChoice(null); setMarketingChoice(null); setStorageError(false); setOpen(true); }} className="underline">Privacy choices</button>
    </footer>
    {(open || (enabled && consent !== "unavailable" && !preferences.decided && !dismissed)) && <section aria-label="Privacy choices" className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto border-t border-slate-600 bg-slate-950 p-5 text-white shadow-lg">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-lg font-semibold">Your privacy choices</h2>
        <p className="mt-2 text-sm leading-6">Choose independently. Optional tracking stays off unless you accept its category. <a className="underline" href="/privacy">Privacy notice</a></p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={analyticsChoice ?? preferences.analytics} onChange={event => setAnalyticsChoice(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span><strong className="block">Analytics</strong>Google Analytics: visits and confirmed enquiry counts.</span></label>
          <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={marketingChoice ?? preferences.marketing} onChange={event => setMarketingChoice(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span><strong className="block">Marketing</strong>Meta Pixel: page visits for marketing measurement.</span></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => choose("necessary")} className="border border-slate-400 px-4 py-2">Reject optional</button>
          <button onClick={() => choose(consentValue(analyticsChoice ?? preferences.analytics, marketingChoice ?? preferences.marketing))} className="border border-slate-400 px-4 py-2">Save choices</button>
          <button onClick={() => { setOpen(false); setDismissed(true); }} className="px-4 py-2 underline">Close</button>
        </div>
        {storageError && <p role="alert" className="mt-3">Your choice could not be saved. Optional tracking remains unchanged; enable browser storage to change it.</p>}
      </div>
    </section>}
  </>;
}
