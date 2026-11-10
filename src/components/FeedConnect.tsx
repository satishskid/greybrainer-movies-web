"use client";

import React from "react";
import { Bell, ExternalLink } from "lucide-react";

export function FeedConnect({ className = "" }: { className?: string }) {
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
          No spam inboxes. No community chat chatter. Follow our verified publication channels for daily film craft analysis directly in your existing feed.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. X / Twitter */}
        <div className="flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-950/70 p-4 transition-all hover:border-teal-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white border border-slate-700 font-bold text-xs">
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

        {/* 2. LinkedIn */}
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

        {/* 3. Instagram */}
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

        {/* 4. Facebook */}
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

      {/* Lockscreen Note */}
      <div className="mt-4 flex items-center gap-2 rounded border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-400">
        <Bell className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        <span>
          <strong>Device Push Notifications:</strong> Currently in development. Follow our verified social feeds above for immediate daily publication alerts.
        </span>
      </div>
    </section>
  );
}
