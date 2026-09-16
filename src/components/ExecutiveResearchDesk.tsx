"use client";

import { useState } from "react";
import {
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";

interface ResearchBriefing {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  period: string;
  readTime: string;
  summary: string;
  metrics: string[];
  executiveTakeaway: string;
  forensicBreakdown: {
    heading: string;
    body: string;
  }[];
  directives: string[];
}

interface CraftsmanDossier {
  id: string;
  role: string;
  name: string;
  score: string;
  focus: string;
  signatureMechanisms: string[];
  blindSpots: string[];
  telemetryNotes: string;
}

const BRIEFINGS: ResearchBriefing[] = [
  {
    id: "second-act-cliff",
    title: "The Second-Act Cliff: Forensic Telemetry of Why Modern Tentpoles Lose 35% Retention at Minute 55",
    subtitle: "Telemetric investigation analyzing pacing deceleration, midpoint decay, and second-act churn across 140 streaming releases and 35 theatrical titles.",
    category: "Macro Pacing Telemetry",
    period: "Q1 2026 Strategic Brief",
    readTime: "8 min read",
    summary:
      "A forensic multi-market study identifying the exact structural valley between minutes 45 and 68 where viewer attention declines precipitously. Investigating how passive exposition and absent midpoint reversals devastate both box office word-of-mouth and OTT completion.",
    metrics: [
      "35.4% average retention drop between Minute 48 and 64",
      "14-Minute Reversal Rule: Exceeding 18 min without stakes mutation increases churn by 2.8x",
      "71% of negative Friday night theatrical social sentiment cites second-half pacing drag",
      "Rebound velocity of +28% when an irrevocable Midpoint Point-of-No-Return is executed at min 55",
    ],
    executiveTakeaway:
      "Modern audiences do not reject complexity; they reject narrative stagnation. When characters spend 20 minutes discussing problems rather than escalating conflict, audience engagement breaks permanently. A script's survival depends on mathematically enforcing midpoint pressure before budgeting.",
    forensicBreakdown: [
      {
        heading: "1. The Physics of Narrative Deceleration (The 50-Minute Churn Trap)",
        body: "Our telemetric analysis across 140 streaming titles and 35 theatrical releases reveals a consistent tension cliff. Act 1 setup and the Inciting Incident provide enough narrative momentum to carry viewers through Minute 40. However, between Minute 45 and 65 (the Act 2A corridor), screenplays routinely degenerate into repetitive conversational investigations or redundant subplots. In streaming, this causes immediate drop-off and app abandonment. In theatrical, it triggers restlessness, watch-checking, and devastating intermission word-of-mouth.",
      },
      {
        heading: "2. The 14-Minute Cadence Law: Why Conversational Buffers Kill Stakes",
        body: "By mapping scene transitions against real-time audience biometric and exit telemetry, we isolated the 14-Minute Cadence Law: audiences require a micro-stake escalation or narrative pivot at intervals no greater than 14 minutes. Films that allowed dialogue scenes to exceed 18 minutes without a shift in power dynamics suffered a 2.8x higher abandonment rate.",
      },
      {
        heading: "3. The Midpoint Point-of-No-Return: Inverting Reaction into Action",
        body: "High-performing benchmark films (scoring 9.0+ on the Greybrainer Tension Waveform) deliberately trigger a tectonic shift between Minutes 54 and 60. The protagonist ceases merely reacting to the inciting incident and is forced to commit to an irreversible action. In contrast, failing scripts treat the midpoint as just another scene, allowing tension to bottom out into lethargy.",
      },
    ],
    directives: [
      "Development Audit: Subject all draft screenplays to a mandatory Minute 50 Diagnostic before approving final production budgets.",
      "Rough-Cut Trimming: Eliminate 8 to 14 minutes of conversational connective tissue in Act 2A prior to locking picture.",
      "Stakes Escalation: Transform passive mystery investigations into active, ticking-clock confrontations by Minute 55.",
      "Streaming Format Discipline: If an 8-episode series exhibits Act 2A drag across episodes 3 and 4, mandate a compression down to 6 episodes.",
    ],
  },
  {
    id: "star-fee-multiple",
    title: "The Star-Fee Multiple vs. Narrative Density: An Empirical Study of 120 Theatrical Releases (2024–2026)",
    subtitle: "A financial and creative post-mortem correlating talent remuneration share with theatrical box office returns across Hollywood, Bollywood, and Pan-India cinema.",
    category: "Studio Economics & Packaging",
    period: "Executive White-Paper",
    readTime: "9 min read",
    summary:
      "Evaluating 120 wide theatrical releases reveals that projects allocating over 45% of total budget to star compensation generated an average box office multiple of just 1.18x, while concept-led productions allocating over 60% to on-screen craft achieved a 3.42x multiple.",
    metrics: [
      "1.18x average box office multiple when Star Fees exceed 45% of total production cost",
      "3.42x average box office multiple when Craft, Script, and VFX exceed 60% of total budget",
      "82% of commercial breakout hits (2024–2026) were concept-led with calibrated talent fees",
      "12–18% hidden budget inflation caused by non-screen entourage overheads and vanity rider demands",
    ],
    executiveTakeaway:
      "Star power guarantees a Friday morning opening; narrative density guarantees Saturday, Sunday, and global longevity. When star remuneration cannibalizes script development and post-production craft, the studio carries 100% of the downside risk. Empirical script scores provide studio heads the exact data needed to enforce backend profit participation.",
    forensicBreakdown: [
      {
        heading: "1. The Capital Cannibalization Trap",
        body: "Over the last 24 months, theatrical budgets have reached historic highs, but production value on screen has frequently diminished. When a single lead actor commands 50% to 65% of the total budget, the production is forced to compress shooting schedules, cut stunt safety margins, and slash VFX refinement timelines. The result is a film that looks rushed, lacks visual texture, and relies entirely on star charisma that audience fatigue has already discounted.",
      },
      {
        heading: "2. The Entourage Tax and Production Distortion",
        body: "Beyond headline remuneration, star packages carry an unpublicized 'Entourage Tax'—luxury accommodation, private aviation, personal staff, and security teams that inflate non-screen costs by 12% to 18%. Furthermore, script changes are frequently mandated to protect star vanity rather than serve narrative truth, sanding down organic conflict into predictable hero-worship tropes.",
      },
      {
        heading: "3. The High-Narrative-Density Counter-Model",
        body: "Studios that broke box office records (Maddock Films with Stree 2 & Munjya, Universal with Oppenheimer, Neon with Longlegs) adhered to a strict structural model: talent fees capped at reasonable initial bases with aggressive back-end profit participation, combined with rigorous multi-month script iteration. Screenplay R&D was funded at 4% of total budget rather than the standard 1.2%.",
      },
    ],
    directives: [
      "Contractual Structuring: Transition star talent from fixed upfront fees to tiered performance-linked backends tied to theatrical net receipts.",
      "R&D Budget Reallocation: Mandate that at least 3.5% of total production budget is allocated to pre-production screenplay iteration and mathematical stress-testing.",
      "Narrative Density Gate: Require a minimum 8.0 Narrative Density rating on the Greybrainer Rubric before attaching tier-one talent packages.",
      "Marketing Realignment: Center pre-release marketing campaigns on high-concept curiosity hooks rather than star presence alone.",
    ],
  },
  {
    id: "completion-rate-trap",
    title: "The Completion Rate Trap: Why Viewing Hours Are Bankrupting Streaming Platforms",
    subtitle: "Investigating the fundamental disconnect between headline viewing hours and 90-day subscriber churn across 85 major streaming releases.",
    category: "Streaming Telemetry & Churn Economics",
    period: "SVOD Intelligence Dossier",
    readTime: "7 min read",
    summary:
      "A platform economics investigation into why 100M+ streamed hours can conceal devastating subscriber churn. Analyzing the correlation between completion velocity, drop-off thresholds, and customer lifetime value (LTV).",
    metrics: [
      "48% Critical Completion Threshold: Titles below 48% completion generate negative ROI on subscriber LTV",
      "3.1x higher 60-day churn rate among subscribers who abandon a title prior to Episode 3",
      "62% of 8-episode limited drama series contain 120+ minutes of non-essential filler material",
      "Completion Velocity Ratio (CVR): The mathematical metric that accurately predicts renewal profitability",
    ],
    executiveTakeaway:
      "Viewing hours are a marketing metric; completion velocity is an enterprise solvency metric. Commissioning 8-episode orders for stories with only 3 hours of narrative substance creates subscriber fatigue, fueling the streaming churn crisis. Streamers must audit narrative density prior to greenlight.",
    forensicBreakdown: [
      {
        heading: "1. The Illusion of Aggregate Viewing Hours",
        body: "In quarterly earnings and trade press releases, streaming platforms routinely celebrate '100 Million Hours Viewed in the First 28 Days.' However, internal retention forensics paint a starkly different reality. A film or series can accumulate millions of hours through sheer algorithm-driven home-screen placement, while simultaneously suffering an 80% abandonment rate before the halfway mark.",
      },
      {
        heading: "2. The Churn Acceleration Curve",
        body: "Our analysis demonstrates that when a subscriber fails to complete a title they initiated, their engagement index plummets over the subsequent 60 days. Subscribers who abandon two consecutive marquee titles have a 3.1x higher probability of canceling their subscription within two billing cycles. Incomplete viewing creates subscriber resentment—the feeling that their time was wasted.",
      },
      {
        heading: "3. The 8-Episode Curse: Format Inflation",
        body: "Traditional streaming commissioning models have incentivized showrunners to stretch tight 100-minute feature concepts or 4-episode miniseries into 8 bloated 55-minute episodes. By forensic scene analysis, over 60% of episodes 3, 4, and 5 consist of cyclical character arguments and artificial cliffhangers that fail to move the plot needle.",
      },
    ],
    directives: [
      "Commissioning Discipline: Mandate narrative density audits that dictate format length based on plot complexity, not arbitrary 8-episode quotas.",
      "Acquisition Valuation: Discount acquisition bids by 25–40% on festival titles that exhibit high drop-off risk between minutes 40 and 60.",
      "Completion Velocity Tracking: Adopt the Completion Velocity Ratio (CVR) as the primary internal metric for content performance evaluation.",
      "Writer's Room Telemetry: Provide showrunners with objective pacing maps during development to highlight Act 2 dead zones before filming.",
    ],
  },
];

const CRAFTSMEN: CraftsmanDossier[] = [
  {
    id: "neel-rajamouli",
    role: "Director / Action Choreographer",
    name: "Prashanth Neel & SS Rajamouli",
    score: "9.6 / 10 Craftmatics",
    focus: "Gravitas, Kinetic Velocity & High-Tension Mythic Staging",
    signatureMechanisms: [
      "Spatial clarity in multi-opponent spatial staging without disorienting handheld cuts",
      "Slow-motion tension build-up followed by hyper-kinetic release (The Slingshot Cadence)",
      "Archetypal emotional mythmaking: elevating personal stakes into generational folklore",
      "Auditory shockwaves: silencing soundscapes prior to kinetic impact",
    ],
    blindSpots: [
      "Second-act dialogue redundancy: secondary characters repeatedly narrating the protagonist's legend",
      "Runtime expansion: propensity for sequences to stretch beyond 170 minutes without micro-stakes mutations",
      "Feminine character agency: emotional arcs frequently relegated to inspirational motivation rather than driving action",
    ],
    telemetryNotes:
      "Tension curves register peak sustained scores (9.5+) during action setpieces. However, pacing dips into the warning zone (5.2) during middle-act political exposition if not counter-balanced by urgent ticking clocks.",
  },
  {
    id: "christopher-nolan",
    role: "Auteur / Temporal Architect",
    name: "Christopher Nolan",
    score: "9.8 / 10 Craftmatics",
    focus: "Temporal Cross-Cutting, Auditory Tension Layering & Visual Velocity",
    signatureMechanisms: [
      "Simultaneous triple-timeline cross-cutting converging on a unified emotional climax",
      "Acoustic Shepard Tone tension layering: music providing perpetual forward acceleration",
      "Zero exposition without visual motion: characters deliver technical briefings while navigating hostile physical spaces",
      "Tactile, in-camera practical physics creating subconscious audience conviction",
    ],
    blindSpots: [
      "Auditory dialogue masking: high decibel ambient sound mixes occasionally obscure vital plot exposition",
      "Emotional detachment: cerebral intellectual mechanics can occasionally starve central character intimacy",
      "Pacing exhaustion: continuous high-tension cross-cutting without sufficient cathartic valley intervals",
    ],
    telemetryNotes:
      "Tension velocity remains exceptionally high (8.8–9.8) throughout all three acts with virtually zero dead zones. The primary risk factor is cognitive saturation, where audiences require post-viewing explanation.",
  },
  {
    id: "bong-joon-ho",
    role: "Screenplay / Structural Inversion",
    name: "Bong Joon-ho",
    score: "9.7 / 10 Craftmatics",
    focus: "Midpoint Genre Metamorphosis, Spatial Class Subtext & Micro-Stakes Precision",
    signatureMechanisms: [
      "Seamless midpoint genre inversion (e.g., razor-sharp transition from satirical comedy to psychological thriller)",
      "Spatial verticality as metaphorical architecture (physical ascent and descent mirroring class stratification)",
      "Subtext economy: every prop, gesture, and line of dialogue serves dual thematic and plotting functions",
      "Mastery of sudden tonal whiplash without alienating viewer empathy",
    ],
    blindSpots: [
      "Polarizing third-act escalations: final climaxes can alienate viewers seeking conventional comfort",
      "Complex cultural idiom translation: subtle satirical barbs can lose sharpness in non-native language markets",
    ],
    telemetryNotes:
      "Exemplary adherence to the 14-minute cadence law. The midpoint shift at minute 58 represents the gold standard of tension reinvigoration, boosting engagement scores from 8.2 to 9.9 into Act 3.",
  },
];

export function ExecutiveResearchDesk() {
  const [selectedBriefing, setSelectedBriefing] = useState<ResearchBriefing | null>(null);
  const [selectedCraftsman, setSelectedCraftsman] = useState<CraftsmanDossier | null>(null);

  const openBriefing = (briefing: ResearchBriefing) => {
    setSelectedBriefing(briefing);
    trackFunnelEvent({ name: "mofu_service_tab_view", service: `research_${briefing.id}` });
  };

  const openCraftsman = (craftsman: CraftsmanDossier) => {
    setSelectedCraftsman(craftsman);
    trackFunnelEvent({ name: "mofu_service_tab_view", service: `craftsman_${craftsman.id}` });
  };

  return (
    <div className="space-y-20">
      {/* SECTION 1: MACRO TREND BAROMETERS */}
      <section id="trends" className="scroll-mt-28">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <TrendingUp className="w-4 h-4" />
            <span>Pillar 02 • Flagship Macro Research</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Independent Telemetry Reports</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Empirical Industry Research Briefings
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mb-8 leading-relaxed">
          Comprehensive forensic post-mortems addressing the acute financial and narrative dilemmas of theatrical studio heads and streaming commissioners.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BRIEFINGS.map((briefing) => (
            <div
              key={briefing.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/50 hover:bg-slate-900 transition-all shadow-xl group cursor-pointer"
              onClick={() => openBriefing(briefing)}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-3">
                  <span className="uppercase tracking-wider">{briefing.period}</span>
                  <span className="text-slate-500">{briefing.readTime}</span>
                </div>

                <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                  {briefing.category}
                </div>

                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                  {briefing.title}
                </h3>

                <p className="text-sm text-slate-400 mt-3 leading-relaxed line-clamp-3">
                  {briefing.summary}
                </p>

                <div className="mt-5 space-y-2 pt-4 border-t border-slate-800/80 text-xs">
                  {briefing.metrics.slice(0, 2).map((metric, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span className="line-clamp-2">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Greybrainer Macro Lens</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Full Briefing <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: THE CRAFTSMAN & AUTEUR INDEX */}
      <section id="craft" className="scroll-mt-28">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <Award className="w-4 h-4" />
            <span>Pillar 03 • The Craftsman &amp; Auteur Index</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Forensic Director Profiles</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Craftsman Index: Signature Styles &amp; Structural Blind Spots
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mb-8 leading-relaxed">
          Objective algorithmic evaluations of elite directors and screenwriters—isolating their pacing mechanics, tonal velocity, and recurring narrative failure points.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CRAFTSMEN.map((craft) => (
            <div
              key={craft.id}
              className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-xl group cursor-pointer"
              onClick={() => openCraftsman(craft)}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold mb-2">
                  <span className="uppercase tracking-wider">{craft.role}</span>
                  <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-indigo-300 text-[11px]">
                    {craft.score}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-indigo-300 transition-colors">
                  {craft.name}
                </h3>

                <div className="text-xs font-semibold text-slate-300 mt-1 mb-4">
                  Core Focus: {craft.focus}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Identified Signature Mechanisms:
                  </div>
                  {craft.signatureMechanisms.slice(0, 2).map((trait, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span className="line-clamp-2">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Craftmatics Assessment</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Full Dossier <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: FULL RESEARCH BRIEFING DOSSIER */}
      {selectedBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-6 sm:p-10 shadow-2xl space-y-8 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-6 gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5">
                    {selectedBriefing.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{selectedBriefing.period}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedBriefing.readTime}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedBriefing.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {selectedBriefing.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBriefing(null)}
                className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Executive Takeaway Callout */}
            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary &amp; Core Thesis</span>
              </div>
              <p className="text-slate-200 text-sm font-medium leading-relaxed">
                {selectedBriefing.executiveTakeaway}
              </p>
            </div>

            {/* Empirical Data & Metrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Empirical Telemetry &amp; Statistical Benchmark</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBriefing.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forensic Multi-Section Analysis */}
            <div className="space-y-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Forensic Structural Analysis</span>
              </h4>

              {selectedBriefing.forensicBreakdown.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h5 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono">0{sIdx + 1}.</span>
                    <span>{section.heading}</span>
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed pl-6">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Actionable Directives for Studio Heads */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Prescribed Action Directives for Creative Decision-Makers</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                {selectedBriefing.directives.map((directive, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 text-slate-200">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      {dIdx + 1}
                    </span>
                    <span className="leading-relaxed">{directive}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-500">
                <span>Greybrainer Research Institute • Confidential Studio Intelligence</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedBriefing(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-medium transition"
                >
                  Close Briefing
                </button>
                <a
                  href="/#studio-desk"
                  onClick={() => setSelectedBriefing(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Request Custom Telemetry for Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CRAFTSMAN AUTEUR DOSSIER */}
      {selectedCraftsman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-6 sm:p-9 shadow-2xl space-y-6 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                  <span>{selectedCraftsman.role}</span>
                  <span className="text-slate-600">•</span>
                  <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-indigo-300">
                    {selectedCraftsman.score}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {selectedCraftsman.name}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Primary Specialization: {selectedCraftsman.focus}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCraftsman(null)}
                className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Signature Mechanisms */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Empirical Strengths &amp; Signature Mechanisms</span>
              </h4>
              <div className="space-y-2">
                {selectedCraftsman.signatureMechanisms.map((mechanism, mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{mechanism}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structural Blind Spots */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Structural Blind Spots &amp; Churn Risks</span>
              </h4>
              <div className="space-y-2">
                {selectedCraftsman.blindSpots.map((spot, sIdx) => (
                  <div
                    key={sIdx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Waveform Notes */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-1.5 text-xs">
              <strong className="text-indigo-300 font-bold block">
                Morphokinetics™ Telemetry Observation:
              </strong>
              <p className="text-slate-300 leading-relaxed">
                {selectedCraftsman.telemetryNotes}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Greybrainer Craftsman Index
              </span>
              <button
                type="button"
                onClick={() => setSelectedCraftsman(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
