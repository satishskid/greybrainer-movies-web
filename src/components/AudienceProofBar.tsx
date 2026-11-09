import React from "react";

export interface ChannelStat {
  id: "x" | "linkedin" | "instagram" | "facebook" | "pwa";
  label: string;
  count: number;
  countDisplay: string;
  url?: string;
  description: string;
}

export const AUDIENCE_METRICS: ChannelStat[] = [
  {
    id: "x",
    label: "X / Twitter",
    count: 1420,
    countDisplay: "1.4k",
    url: "https://x.com/Greybrainlens",
    description: "Daily film craft threads & live reactions",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    count: 980,
    countDisplay: "980",
    url: "https://www.linkedin.com/company/146956056/",
    description: "Executive research & industry analyses",
  },
  {
    id: "instagram",
    label: "Instagram",
    count: 1850,
    countDisplay: "1.8k",
    url: "https://www.instagram.com/greybrainlens",
    description: "Visual shot breakdowns & film slides",
  },
  {
    id: "facebook",
    label: "Facebook",
    count: 620,
    countDisplay: "620",
    url: "https://www.facebook.com/profile.php?id=61596601130152",
    description: "Long-form editorial & community reads",
  },
  {
    id: "pwa",
    label: "Device Push",
    count: 450,
    countDisplay: "450+",
    description: "Direct phone lockscreen 3-minute briefs",
  },
];

export function AudienceProofBar({ className = "" }: { className?: string }) {
  const totalAudience = AUDIENCE_METRICS.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      data-testid="audience-proof-bar"
      className={`border-y border-slate-800 bg-slate-900/60 py-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
            Read by <span className="font-bold text-white">{totalAudience.toLocaleString()}+</span> filmmakers &amp; analysts across feeds:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {AUDIENCE_METRICS.map((stat) => {
            const content = (
              <>
                <span className="font-semibold text-white">{stat.countDisplay}</span>
                <span className="text-slate-400">on {stat.label}</span>
              </>
            );

            if (stat.url) {
              return (
                <a
                  key={stat.id}
                  href={stat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={stat.description}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-xs text-slate-200 transition-all hover:border-teal-400 hover:text-white hover:bg-slate-800"
                >
                  {content}
                </a>
              );
            }

            return (
              <span
                key={stat.id}
                title={stat.description}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-800/40 px-3 py-1 text-xs text-slate-300"
              >
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
