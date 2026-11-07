"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_KEY, GTM_ID, trackingAllowed } from "@/lib/measurement-consent";

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
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unavailable");

  useEffect(() => {
    if (!enabled || window.location.hostname !== "movies.greybrain.in") return;
    if (!trackingAllowed(enabled, location.hostname, location.pathname, consent)) return;
    if (document.getElementById("greybrainer-gtm")) return;
    const target = window as unknown as { dataLayer: unknown[] };
    target.dataLayer = target.dataLayer || [];
    // Queue consent before the container; advertising stays denied in this analytics-only rollout.
    // Google's queue accepts array-like command arguments, including arrays.
    function command(...args: unknown[]) { target.dataLayer.push(args); }
    command("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    command("set", "ads_data_redaction", true);
    target.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.id = "greybrainer-gtm";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }, [enabled, consent]);

  function choose(value: "analytics" | "necessary") {
    try { localStorage.setItem(CONSENT_KEY, value); }
    catch { setStorageError(true); return; }
    // A full reload removes previously loaded tracking scripts after withdrawal.
    window.location.reload();
  }

  return <>
    <footer className="mt-auto flex flex-wrap gap-5 border-t border-slate-700 px-6 py-5 text-sm text-slate-300">
      <a href="/privacy" className="underline">Privacy</a>
      <button type="button" onClick={() => setOpen(true)} className="underline">Privacy choices</button>
    </footer>
    {(open || (enabled && consent !== "unavailable" && consent !== "analytics" && consent !== "necessary" && !dismissed)) && <section aria-label="Privacy choices" className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto border-t border-slate-600 bg-slate-950 p-5 text-white shadow-lg">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-lg font-semibold">Your privacy choices</h2>
        <p className="mt-2 text-sm leading-6">Optional Google Analytics helps us understand readership. It stays off unless you accept. Marketing tracking is not enabled. <a className="underline" href="/privacy">Privacy notice</a></p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => choose("necessary")} className="border border-slate-400 px-4 py-2">Reject optional analytics</button>
          <button onClick={() => choose("analytics")} className="border border-slate-400 px-4 py-2">Accept analytics</button>
          <button onClick={() => { setOpen(false); setDismissed(true); }} className="px-4 py-2 underline">Close</button>
        </div>
        {storageError && <p role="alert" className="mt-3">Your choice could not be saved. Optional tracking remains unchanged; enable browser storage to change it.</p>}
      </div>
    </section>}
  </>;
}
