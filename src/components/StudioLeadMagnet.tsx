"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Mail,
  Building2,
  Eye,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";

interface SpecimenPage {
  id: "verdict" | "radar" | "telemetry" | "directives";
  title: string;
  icon: React.ElementType;
}

export function StudioLeadMagnet() {
  const [activeService, setActiveService] = useState<"screenplay" | "roughcut" | "ott">("screenplay");
  const [activeSpecimenPage, setActiveSpecimenPage] = useState<"verdict" | "radar" | "telemetry" | "directives">("verdict");

  // VIP Registration state
  const [vipEmail, setVipEmail] = useState("");
  const [vipStudio, setVipStudio] = useState("");
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [vipSubmitted, setVipSubmitted] = useState(false);
  const [vipError, setVipError] = useState<string | null>(null);

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail || !vipEmail.includes("@")) {
      setVipError("Please provide a valid work email.");
      return;
    }

    setVipSubmitting(true);
    setVipError(null);

    try {
      const res = await fetch("/api/studio-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: vipEmail,
          studioName: vipStudio || "Studio / Independent",
          type: "vip_registration",
          serviceInterest: activeService,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed. Please contact dr.satish@greybrain.ai directly.");
      }

      setVipSubmitted(true);
      trackFunnelEvent({
        name: "bofu_vip_registered",
        email: vipEmail,
        studio: vipStudio,
      });
    } catch (err: any) {
      setVipError(err.message || "Failed to register.");
    } finally {
      setVipSubmitting(false);
    }
  };

  const services = [
    {
      id: "screenplay",
      badge: "Pre-Production",
      title: "Pre-Greenlight Screenplay Stress-Test",
      desc: "Isolate second-act narrative drag, redundant subplots, protagonist stakes decay, and commercial drop-off risks before budgeting or shooting.",
      deliverable: "15-Page Comprehensive Diagnostic Memo + Scene-by-Scene Tension Telemetry + Rewrite Directives",
      turnaround: "5 Business Days",
    },
    {
      id: "roughcut",
      badge: "Post-Production",
      title: "Rough-Cut Screening Audit",
      desc: "Second-by-second tension telemetry, micro-pacing sag detection, and audience attention drop-off alerts to guide final picture lock.",
      deliverable: "Morphokinetics Runtime Telemetry Curve + Scene-level Trim Directives + Emotional Climax Convergence Report",
      turnaround: "72 Hours",
    },
    {
      id: "ott",
      badge: "Acquisition & Streaming",
      title: "OTT Acquisition Due Diligence",
      desc: "Independent, unvarnished commercial viability scoring and completion-rate risk modeling for Netflix, Prime Video, Hotstar, and theatrical distributors.",
      deliverable: "Platform Fit Index (Theatrical vs SVOD vs AVOD) + 7-Layer Benchmark vs Recent Genre Comps",
      turnaround: "48 Hours",
    },
  ] as const;

  const specimenPages: SpecimenPage[] = [
    { id: "verdict", title: "1. Verdict", icon: FileText },
    { id: "radar", title: "2. 7-Layer Radar", icon: Layers },
    { id: "telemetry", title: "3. Pacing Waveform", icon: Activity },
    { id: "directives", title: "4. Directives", icon: Sparkles },
  ];

  return (
    <section id="studio-diagnostic" className="relative rounded-3xl border border-red-900/40 bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/30 p-6 sm:p-12 shadow-2xl overflow-hidden scroll-mt-24">
      {/* Decorative Glows */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-12">
        {/* Header: Repositioned as Studio Advisory Desk */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Studio Advisory &amp; Diagnostic Services</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Second Room for Studio Heads, Producers &amp; Buyers.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We do not ask studio executives to type confidential script treatments into public web forms. Instead, examine our methodology, explore an unredacted specimen below, and engage through our confidential bilateral NDA desk.
          </p>
        </div>

        {/* EXECUTIVE DILEMMA SELECTOR */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Select Your Immediate Strategic Dilemma</span>
            </span>
            <span className="text-[11px] text-slate-500">Tailored Diagnostic Pathways</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveService("screenplay");
                trackFunnelEvent({ name: "mofu_service_tab_view", service: "screenplay_dilemma" });
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeService === "screenplay"
                  ? "border-amber-500/60 bg-amber-950/20 text-white shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <strong className="block text-amber-300 font-semibold mb-1">
                "Script in Development"
              </strong>
              <span>Will Act 2 sag or lose viewer stakes before budgeting $20M+?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveService("roughcut");
                trackFunnelEvent({ name: "mofu_service_tab_view", service: "roughcut_dilemma" });
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeService === "roughcut"
                  ? "border-red-500/60 bg-red-950/20 text-white shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <strong className="block text-red-300 font-semibold mb-1">
                "Rough-Cut Standoff"
              </strong>
              <span>Director delivered 160 mins. Where do we trim 20 mins without breaking story?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveService("ott");
                trackFunnelEvent({ name: "mofu_service_tab_view", service: "ott_dilemma" });
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeService === "ott"
                  ? "border-sky-500/60 bg-sky-950/20 text-white shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <strong className="block text-sky-300 font-semibold mb-1">
                "OTT Acquisition Risk"
              </strong>
              <span>Will subscribers finish this title or abandon it at minute 50?</span>
            </button>
          </div>
        </div>

        {/* PART 1: THE 3 CORE STUDIO SERVICES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span>Commissioned Advisory Tiers</span>
            </h3>
            <span className="text-xs text-amber-400 font-medium">Click to inspect service scope</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((srv) => {
              const isSelected = activeService === srv.id;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setActiveService(srv.id);
                    trackFunnelEvent({ name: "mofu_service_tab_view", service: srv.id });
                  }}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "border-red-500 bg-slate-900/95 shadow-xl shadow-red-950/40 ring-1 ring-red-500/50"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                      <span className={isSelected ? "text-red-400" : "text-slate-500"}>
                        {srv.badge}
                      </span>
                      <span className="text-slate-400">{srv.turnaround}</span>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {srv.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-slate-400 font-semibold">Deliverable: </span>
                    <span>{srv.deliverable}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* THE METHODOLOGY CONTRAST */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why Traditional Coverage &amp; Focus Groups Fail Modern Studios</span>
            </h4>
            <span className="text-xs text-slate-500">The Empirical Advantage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="text-red-400 font-bold flex items-center justify-between">
                <span>Traditional Reader Coverage</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300">Flawed</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Subjective impressions ("witty dialogue, needs more heart") written by junior readers. Fails to identify mathematical second-act drop-offs before shooting.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="text-amber-400 font-bold flex items-center justify-between">
                <span>25-Person Recruited Focus Groups</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Biased</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Contradictory exit surveys conducted after VFX are locked and budgets depleted. Directors dismiss notes as "unrepresentative noise."
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center justify-between">
                <span>Greybrainer Morphokinetics™</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">Empirical</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Minute-by-minute tension waveform + 7-layer structural diagnostic. Isolates exact scenes causing audience fatigue and delivers actionable rewrite directives under bilateral NDA.
              </p>
            </div>
          </div>
        </div>

        {/* PART 2: INTERACTIVE SPECIMEN DIAGNOSTIC DOSSIER (SHOW POSSIBILITIES) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
          {/* Dossier Top Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Specimen Diagnostic Dossier #GB-2026-X48
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                    REDACTED
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Project Chimera (122-Min Action Noir / Psychological Thriller)
                </h4>
              </div>
            </div>

            {/* Specimen Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {specimenPages.map((pg) => {
                const Icon = pg.icon;
                const isCurrent = activeSpecimenPage === pg.id;
                return (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => {
                      setActiveSpecimenPage(pg.id);
                      trackFunnelEvent({ name: "mofu_specimen_tab_view", tab: pg.id });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isCurrent
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pg.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dossier Interactive Content Body */}
          <div className="p-6 sm:p-8">
            {activeSpecimenPage === "verdict" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4 rounded-xl border border-red-900/40 bg-gradient-to-b from-red-950/20 to-slate-900 p-6 text-center">
                  <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                    Empirical Recommendation
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 mt-2">
                    7.8 <span className="text-xl text-slate-500 font-normal">/ 10</span>
                  </div>
                  <div className="mt-2 inline-block rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300">
                    CONDITIONAL GREENLIGHT
                  </div>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    High commercial upside (Theatrical + Global SVOD), contingent upon resolving second-act pacing stagnation between minutes 54 and 68.
                  </p>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                      Executive Summary &amp; Risk Matrix
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                        <strong className="text-emerald-400 block mb-1">Primary Strength:</strong>
                        <span className="text-slate-300">
                          Auteur visual identity &amp; protagonist internal conflict rank in the 92nd percentile against recent genre benchmarks.
                        </span>
                      </div>
                      <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3.5">
                        <strong className="text-red-400 block mb-1">Critical Vulnerability:</strong>
                        <span className="text-slate-300">
                          Protagonist paralysis in Act 2B causes a 38% projected drop-off in streaming viewer retention prior to midpoint reversal.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Editorial Board Observation: </strong>
                    The third act convergence delivers exceptional emotional catharsis (9.1/10 tension index). The script requires targeted pruning rather than a structural overhaul. See Tab 4 for exact scene-by-scene rewrite directives.
                  </div>
                </div>
              </div>
            )}

            {activeSpecimenPage === "radar" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-white">
                    7-Layer Cinematic Diagnostic Rubric (Specimen Chimera)
                  </h5>
                  <span className="text-xs text-slate-400">
                    Weighted against historical database of 340+ theatrical and OTT releases
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: "1. Story Engine & Stakes", score: "8.8", tag: "High Urgency", color: "text-emerald-400", desc: "Clear protagonist motivation with severe consequence calculus." },
                    { name: "2. Screenplay Density", score: "7.9", tag: "Minor Bloat", color: "text-amber-400", desc: "Scenes 44-48 contain repetitive conversational beats." },
                    { name: "3. Morphokinetics Pacing", score: "7.1", tag: "Attention Cliff", color: "text-red-400", desc: "Prolonged drop-off vulnerability between minute 54 and 68." },
                    { name: "4. Performance Horizon", score: "9.1", tag: "Award-Caliber", color: "text-emerald-400", desc: "Protagonist monologue provides prime actor showcase." },
                    { name: "5. Visual Auteurship", score: "8.6", tag: "Distinctive", color: "text-emerald-400", desc: "Dynamic noir blocking and low-key lighting opportunities." },
                    { name: "6. Soundscape Design", score: "8.0", tag: "Atmospheric", color: "text-slate-300", desc: "Acoustic tension and silence used strategically." },
                    { name: "7. Commercial Viability", score: "7.5", tag: "SVOD Optimal", color: "text-amber-400", desc: "Strong global appeal; requires tighter pacing for theatrical release." },
                  ].map((layer) => (
                    <div key={layer.name} className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">{layer.name}</span>
                        <span className={`text-base font-black ${layer.color}`}>{layer.score}</span>
                      </div>
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                        {layer.tag}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{layer.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSpecimenPage === "telemetry" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      Morphokinetics™ Minute-by-Minute Waveform
                    </h5>
                    <p className="text-xs text-slate-400">
                      Red line shows original draft tension; Green shows projected curve after executing Greybrainer rewrite directives.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-red-400">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                      Original Draft
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      Remediated
                    </span>
                  </div>
                </div>

                {/* SVG Telemetry Curve */}
                <div className="w-full bg-slate-900/80 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
                  <svg viewBox="0 0 700 180" className="w-full h-44">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="680" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="40" y1="60" x2="680" y2="60" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="40" y1="100" x2="680" y2="100" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="40" y1="140" x2="680" y2="140" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

                    {/* Shaded Drop-off Danger Zone (Minutes 54 to 68) */}
                    <rect x="280" y="20" width="100" height="120" fill="#ef4444" fillOpacity="0.12" />
                    <text x="290" y="35" fill="#f87171" fontSize="9" fontWeight="bold">DROP-OFF DANGER ZONE</text>

                    {/* Original Draft Curve (Drops significantly in Act 2) */}
                    <path
                      d="M 50 120 Q 150 70 240 80 T 330 135 T 430 90 T 540 40 T 660 30"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />

                    {/* Remediated Curve (Holds tension high) */}
                    <path
                      d="M 50 120 Q 150 70 240 75 T 330 70 T 430 65 T 540 35 T 660 25"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />

                    {/* Timeline Markers */}
                    <text x="50" y="165" fill="#64748b" fontSize="10">0m (Hook)</text>
                    <text x="220" y="165" fill="#64748b" fontSize="10">35m (Inciting)</text>
                    <text x="310" y="165" fill="#ef4444" fontSize="10" fontWeight="bold">58m (Sag Alert)</text>
                    <text x="440" y="165" fill="#64748b" fontSize="10">80m (Midpoint)</text>
                    <text x="540" y="165" fill="#64748b" fontSize="10">105m (Crisis)</text>
                    <text x="640" y="165" fill="#10b981" fontSize="10" fontWeight="bold">120m (Climax)</text>
                  </svg>
                </div>
              </div>
            )}

            {activeSpecimenPage === "directives" && (
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white">
                  Prioritized Rewrite Remediation Directives (Page 11 of Dossier)
                </h5>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-md bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-white">Consolidate Detective Vance's Exposition (Scenes 37–41): </strong>
                      Merge the warehouse briefing into the physical pursuit scene. Eliminates 5m 20s of conversational dead time while maintaining plot clues.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-md bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <strong className="text-white">Escalate Protagonist Active Stakes at Minute 60: </strong>
                      Shift protagonist from reactive witness to active instigator by having them discover the encrypted ledger 10 minutes earlier. Eliminates the second-act attention drop.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-md bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <strong className="text-white">Sharpen Climax Catharsis Cadence: </strong>
                      Compress the aftermath montage by 90 seconds to maximize lingering thematic impact rather than over-explaining the resolution.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PART 3: BOFU LADDERED ENGAGEMENT (ZERO INTIMIDATING 8-FIELD FORM!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          {/* Left Column: Direct Bilateral NDA Channel */}
          <div className="lg:col-span-6 rounded-2xl border border-red-900/50 bg-gradient-to-br from-red-950/40 to-slate-950 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">
                <Lock className="w-3.5 h-3.5" />
                <span>Tier 3: Bilateral NDA Direct Desk</span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Commission an Audit for Your Active Slate.
              </h4>

              <p className="text-sm text-slate-300 leading-relaxed">
                We sign standard bilateral non-disclosure agreements before receiving any screenplay, bible, or rough cut. Inquire directly with Dr. Satish and our Senior Editorial Board.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard Bilateral NDA countersigned within 4 business hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct editorial review by senior industry dramaturgs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict IP security: scripts are never shared or fed into third-party AI models</span>
                </div>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="space-y-3 pt-2">
              <a
                href="mailto:dr.satish@greybrain.ai?subject=%5BCONFIDENTIAL%20STUDIO%20AUDIT%5D%20Script%20%2F%20Rough-Cut%20Inquiry&body=Dear%20Dr.%20Satish%2C%0A%0AWe%20would%20like%20to%20explore%20commissioning%20a%20Greybrainer%20diagnostic%20audit%20under%20bilateral%20NDA.%0A%0AStudio%20%2F%20Production%20House%3A%20%0AContact%20Name%20%26%20Title%3A%20%0AProject%20Format%20(Feature%20%2F%20Series)%3A%20%0APreferred%20Turnaround%3A%20%0A%0ABest%20regards%2C"
                onClick={() => trackFunnelEvent({ name: "bofu_nda_inquiry_clicked", channel: "email" })}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3.5 px-6 text-sm font-bold text-white shadow-xl shadow-red-950/60 transition-all hover:scale-[1.01]"
              >
                <Mail className="w-4 h-4" />
                <span>Email Bilateral NDA Desk (dr.satish@greybrain.ai)</span>
              </a>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>🔒 Bilateral NDA Pre-requisite</span>
                <span>Response turnaround: &lt; 4 Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Field VIP Executive Registration (Low Friction) */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tier 2: VIP Executive Pass</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white">
                Access Unredacted Case Studies &amp; Bi-Weekly OTT Memos.
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Verified studio executives, acquisitions leads, and showrunners receive our full unredacted diagnostic archives and confidential streaming valuation benchmarks.
              </p>
            </div>

            {vipSubmitted ? (
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="text-base font-bold text-white">Executive Pass Registered</h5>
                <p className="text-xs text-slate-300">
                  Welcome aboard. Our executive relations team will send your credentials and the unredacted dossier archive to <span className="text-white font-semibold">{vipEmail}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} className="space-y-3">
                {vipError && (
                  <div className="p-2.5 rounded-lg border border-red-500/40 bg-red-500/10 text-xs text-red-300">
                    {vipError}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={vipEmail}
                      onChange={(e) => setVipEmail(e.target.value)}
                      placeholder="Work Email (e.g. executive@studio.com)"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 py-3 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      value={vipStudio}
                      onChange={(e) => setVipStudio(e.target.value)}
                      placeholder="Studio / Production House (Optional)"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 py-3 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={vipSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs sm:text-sm font-bold text-white transition-all disabled:opacity-50"
                >
                  {vipSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Register for VIP Executive Pass (Free)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-500 text-center">
                  Instant access to unredacted dossiers. Zero public disclosure.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
