import React from "react";

export interface VerifiedChannel {
  id: "x" | "linkedin" | "instagram" | "facebook";
  label: string;
  displayHandle: string;
  url: string;
  description: string;
}

export const VERIFIED_CHANNELS: VerifiedChannel[] = [
  {
    id: "x",
    label: "X",
    displayHandle: "@Greybrainlens",
    url: "https://x.com/Greybrainlens",
    description: "Daily film craft threads & live reactions",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    displayHandle: "Greybrain AI",
    url: "https://www.linkedin.com/company/146956056/",
    description: "Executive research & industry analyses",
  },
  {
    id: "instagram",
    label: "Instagram",
    displayHandle: "@greybrainlens",
    url: "https://www.instagram.com/greybrainlens",
    description: "Visual shot breakdowns & film slides",
  },
  {
    id: "facebook",
    label: "Facebook",
    displayHandle: "Greybrain",
    url: "https://www.facebook.com/profile.php?id=61596601130152",
    description: "Long-form editorial & community reads",
  },
];

export function AudienceProofBar({ className = "" }: { className?: string }) {
  return (
    <div
      data-testid="audience-proof-bar"
      className={`border-y border-slate-800 bg-slate-900/60 py-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
            Direct Editorial Feeds:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {VERIFIED_CHANNELS.map((ch) => (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              title={ch.description}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-xs text-slate-200 transition-all hover:border-teal-400 hover:text-white hover:bg-slate-800"
            >
              <span className="font-semibold text-white">{ch.label}:</span>
              <span className="text-teal-300">{ch.displayHandle}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
