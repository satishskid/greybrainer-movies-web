"use client";

import React, { useState } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";

export function FeedConnect({ className = "" }: { className?: string }) {
  const [pushStatus, setPushStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const handleEnablePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushStatus("denied");
      setFeedbackMsg("Device push notifications are not supported in this browser.");
      return;
    }

    try {
      setPushStatus("requesting");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushStatus("granted");
        setFeedbackMsg("✓ Lockscreen alerts enabled. You'll receive tomorrow's 3-minute briefing.");

        // Register service worker if available
        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.register("/sw.js");
            // Attempt to subscribe to push endpoint if VAPID available
            if ("PushManager" in window) {
              const sub = await reg.pushManager.getSubscription();
              if (!sub) {
                // Register interest at edge
                await fetch("/api/audience/subscribe-push", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    channel: "pwa",
                    grantedAt: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                  }),
                }).catch(() => {});
              }
            }
          } catch {
            // SW registration optional for initial prompt
          }
        }
      } else {
        setPushStatus("denied");
        setFeedbackMsg("Notifications were dismissed or blocked in browser settings.");
      }
    } catch {
      setPushStatus("denied");
      setFeedbackMsg("Could not enable notifications. Try another channel below.");
    }
  };

  return (
    <section
      data-testid="feed-connect-card"
      aria-labelledby="feed-connect-heading"
      className={`rounded-lg border border-slate-700 bg-slate-900/90 p-6 sm:p-8 ${className}`}
    >
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-teal-300">
          Zero-Friction Daily Briefing
        </span>
        <h2 id="feed-connect-heading" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Read where you already live.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
          No spam inboxes. No community chat chatter. Just 1 click to get the daily 3-minute film craft analysis delivered directly to your preferred feed or phone lockscreen.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Device Lockscreen Push (PWA) */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-950 text-teal-300 border border-teal-500/40">
                <Bell className="h-4 w-4" />
              </span>
              <h3 className="font-semibold text-white text-sm">Device Lockscreen (PWA)</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              1-tap browser prompt. Direct to your mobile lockscreen or desktop alert. Zero app install.
            </p>
          </div>

          <div className="mt-4 pt-2">
            {pushStatus === "granted" ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300">
                <Check className="h-4 w-4" /> Enabled on this device
              </span>
            ) : (
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushStatus === "requesting"}
                className="w-full rounded bg-teal-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-300 transition-all disabled:opacity-50"
              >
                {pushStatus === "requesting" ? "Requesting..." : "Enable in 1 Click"}
              </button>
            )}
          </div>
        </div>

        {/* 2. X / Twitter */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white border border-slate-700">
                𝕏
              </span>
              <h3 className="font-semibold text-white text-sm">𝕏 (Twitter) Feed</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Craft breakdowns, live release reactions, and visual scene analysis directly in your timeline.
            </p>
          </div>

          <div className="mt-4 pt-2">
            <a
              href="https://x.com/Greybrainlens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 hover:border-slate-500 transition-all"
            >
              <span>Follow @Greybrainlens</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 3. LinkedIn */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-950 text-blue-300 border border-blue-700/40 font-bold text-xs">
                in
              </span>
              <h3 className="font-semibold text-white text-sm">LinkedIn Research</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              In-depth research on film production decisions, economics, and directing craft.
            </p>
          </div>

          <div className="mt-4 pt-2">
            <a
              href="https://www.linkedin.com/company/146956056/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 hover:border-slate-500 transition-all"
            >
              <span>Follow on LinkedIn</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 4. Instagram */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-950 text-pink-300 border border-pink-700/40 text-xs">
                📸
              </span>
              <h3 className="font-semibold text-white text-sm">Instagram Slides</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Visual film cinematography cards, framing breakdowns, and craft carousels.
            </p>
          </div>

          <div className="mt-4 pt-2">
            <a
              href="https://www.instagram.com/greybrainlens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 hover:border-slate-500 transition-all"
            >
              <span>Follow @greybrainlens</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 5. Facebook */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/40 font-bold text-xs">
                f
              </span>
              <h3 className="font-semibold text-white text-sm">Facebook Page</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Full editorial articles, retrospective threads, and reader discussions.
            </p>
          </div>

          <div className="mt-4 pt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61596601130152"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 hover:border-slate-500 transition-all"
            >
              <span>Follow on Facebook</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <p className="mt-4 text-xs font-medium text-teal-300">
          {feedbackMsg}
        </p>
      )}
    </section>
  );
}
