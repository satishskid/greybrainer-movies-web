"use client";

import { useState } from "react";
import {
  Layers,
  ArrowRightLeft,
  X,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Film,
  Maximize2
} from "lucide-react";

export interface HeadToHeadBattle {
  id: string;
  title: string;
  tag: string;
  verdict: string;
  metrics: {
    filmA: string;
    scoreA: number;
    filmB: string;
    scoreB: number;
    delta: string;
  };
  takeaway: string;
  divergenceZone: string;
  divergenceReason: string;
  timelineData: {
    minute: number;
    tensionA: number;
    tensionB: number;
    beatA: string;
    beatB: string;
  }[];
  rubricComparison: {
    layer: string;
    scoreA: number;
    scoreB: number;
    winner: string;
    delta: string;
    notes: string;
  }[];
  executiveDirectives: string[];
}

export const SHOWDOWN_BATTLES: HeadToHeadBattle[] = [
  {
    id: "kgf",
    title: "Sequel Escalation vs. Narrative Economy: KGF Chapter 1 vs. KGF Chapter 2",
    tag: "Sequel Forensic",
    verdict: "Chapter 1 maintained higher structural tension; Chapter 2 peaked in visual grandeur but suffered acute mid-act fatigue past minute 65.",
    metrics: {
      filmA: "KGF: Chapter 1",
      scoreA: 8.9,
      filmB: "KGF: Chapter 2",
      scoreB: 8.1,
      delta: "-0.8 Act II Fatigue",
    },
    takeaway: "Dual Morphokinetics proves that doubling action density without expanding emotional stakes desensitizes audience engagement beyond Minute 70.",
    divergenceZone: "Minute 55 to Minute 88 (Act IIB Narrative Stasis)",
    divergenceReason: "Chapter 1 grounded Rocky's rise through maternal vows and slave-labor vulnerability. Chapter 2 made Rocky essentially invulnerable early on, eliminating jeopardy until the final 20 minutes.",
    timelineData: [
      { minute: 15, tensionA: 7.2, tensionB: 8.5, beatA: "Bombay underworld establishment; cautious tempo", beatB: "High-voltage adrenaline cold open; instant spectacle" },
      { minute: 35, tensionA: 8.1, tensionB: 8.6, beatA: "Infiltration of Narachi mines; rising dread", beatB: "Parliament confrontation beat; soaring star elevation" },
      { minute: 55, tensionA: 8.8, tensionB: 7.4, beatA: "Midpoint: Rocky chooses the miners over mercenary fee", beatB: "Adheera attack; action setpiece lacks emotional counter-weight" },
      { minute: 75, tensionA: 9.1, tensionB: 6.8, beatA: "Sustained underground rebellion tension; high stakes", beatB: "Second-act plateau: repetitive gunfights with zero vulnerability" },
      { minute: 95, tensionA: 9.4, tensionB: 7.6, beatA: "Pre-climax assassination countdown; relentless build", beatB: "Kalashnikov port siege: visually stunning but static narrative progress" },
      { minute: 120, tensionA: 9.6, tensionB: 8.9, beatA: "Garuda execution climax; peak emotional catharsis", beatB: "Climactic sea convoy barrage; grand visual opera but lower intimacy" },
    ],
    rubricComparison: [
      { layer: "1. Story Engine & Stakes", scoreA: 9.2, scoreB: 8.0, winner: "Chapter 1 (+1.2)", delta: "+1.2", notes: "Chapter 1 had irreversible moral danger; Chapter 2 relied on invulnerability." },
      { layer: "2. Screenplay Density", scoreA: 8.7, scoreB: 7.6, winner: "Chapter 1 (+1.1)", delta: "+1.1", notes: "Chapter 2 contained redundant slow-motion hero shots that delayed narrative movement." },
      { layer: "3. Morphokinetics Pacing", scoreA: 9.0, scoreB: 7.8, winner: "Chapter 1 (+1.2)", delta: "+1.2", notes: "Chapter 1 maintained steady progression; Chapter 2 plateaued between min 60-90." },
      { layer: "4. Performance Horizon", scoreA: 8.8, scoreB: 8.9, winner: "Chapter 2 (+0.1)", delta: "-0.1", notes: "Yash and Sanjay Dutt delivered magnetic theatrical charisma." },
      { layer: "5. Visual Auteurship", scoreA: 8.9, scoreB: 9.4, winner: "Chapter 2 (+0.5)", delta: "-0.5", notes: "Prashanth Neel expanded color grading depth and monolithic frame composition." },
      { layer: "6. Soundscape Design", scoreA: 9.3, scoreB: 9.5, winner: "Chapter 2 (+0.2)", delta: "-0.2", notes: "Ravi Basrur's acoustic thunder created peerless theatrical sonic power." },
      { layer: "7. Commercial Viability", scoreA: 9.4, scoreB: 9.7, winner: "Chapter 2 (+0.3)", delta: "-0.3", notes: "Unrivaled box office eventization across pan-Indian demographics." },
    ],
    executiveDirectives: [
      "Sequel Law: When increasing action budget by >2x, screenwriters MUST introduce an emotional vulnerability parameter in Act II to prevent audience numbness.",
      "Protagonist Vulnerability Rule: Invulnerable heroes cannot sustain tension past minute 65 without a ticking clock that threatens something they cannot punch away.",
      "Cadence Calibration: Cut at least 14 minutes of non-advancing slow-motion posturing during Act IIB to recover theatrical urgency."
    ]
  },
  {
    id: "dune",
    title: "Worldbuilding Exposition vs. Propulsive Climax: Dune Part One vs. Dune Part Two",
    tag: "Franchise Duel",
    verdict: "Part Two solved Part One's truncated climax by maintaining continuous forward-moving velocity through religious manipulation warfare.",
    metrics: {
      filmA: "Dune: Part One",
      scoreA: 8.4,
      filmB: "Dune: Part Two",
      scoreB: 9.3,
      delta: "+0.9 Climax Velocity",
    },
    takeaway: "Part Two's pacing triumphs because every dialogue scene is political combat, eliminating exposition dead-air and accelerating to an operatic third act.",
    divergenceZone: "Minute 80 to Minute 150 (Third-Act Acceleration)",
    divergenceReason: "Part One stopped right as Paul embraced the Fremen. Part Two uses Paul's internal terror of the Holy War as an engine that speeds up every consecutive sequence.",
    timelineData: [
      { minute: 15, tensionA: 6.8, tensionB: 8.2, beatA: "Caladan exposition and Bene Gesserit gom jabbar test", beatB: "Guerilla raid on Harkonnen harvester; immediate kinetic immersion" },
      { minute: 40, tensionA: 7.9, tensionB: 8.7, beatA: "Arrival on Arrakis; spice harvester rescue mission", beatB: "Sandworm riding trial; Paul establishes messianic authority" },
      { minute: 65, tensionA: 9.1, tensionB: 8.9, beatA: "Night betrayal attack on Arrakeen; devastating tragedy", beatB: "Gurney Halleck reunion and Giedi Prime gladiatorial arena" },
      { minute: 90, tensionA: 7.3, tensionB: 9.2, beatA: "Desert survival; pacing slows significantly in tent", beatB: "Southern fundamentalist council; Paul drinks the Water of Life" },
      { minute: 120, tensionA: 7.7, tensionB: 9.6, beatA: "Jamis ritual duel; abrupt cliffhanger ending feeling", beatB: "Atomic sandstorm breach; Emperor's legion crushed in minutes" },
      { minute: 155, tensionA: 6.5, tensionB: 9.8, beatA: "End credits roll without traditional narrative climax", beatB: "Feyd-Rautha blade duel & galactic Holy War launch; stunning peak" },
    ],
    rubricComparison: [
      { layer: "1. Story Engine & Stakes", scoreA: 8.5, scoreB: 9.5, winner: "Part Two (+1.0)", delta: "+1.0", notes: "Part Two raises stakes from personal survival to galactic holy war." },
      { layer: "2. Screenplay Density", scoreA: 7.9, scoreB: 9.1, winner: "Part Two (+1.2)", delta: "+1.2", notes: "Virtually zero dead exposition in Part Two; dialogue doubles as psychological warfare." },
      { layer: "3. Morphokinetics Pacing", scoreA: 7.8, scoreB: 9.4, winner: "Part Two (+1.6)", delta: "+1.6", notes: "Continuous acceleration curve; Part One suffered from first-half exposition weight." },
      { layer: "4. Performance Horizon", scoreA: 8.6, scoreB: 9.3, winner: "Part Two (+0.7)", delta: "+0.7", notes: "Chalamet, Zendaya, and Austin Butler delivered career-defining intensity." },
      { layer: "5. Visual Auteurship", scoreA: 9.5, scoreB: 9.7, winner: "Part Two (+0.2)", delta: "+0.2", notes: "Greig Fraser's infrared Giedi Prime sequence redefined blockbuster cinematography." },
      { layer: "6. Soundscape Design", scoreA: 9.6, scoreB: 9.7, winner: "Part Two (+0.1)", delta: "+0.1", notes: "Hans Zimmer's vocal cries and sub-bass frequencies rattle physical theaters." },
      { layer: "7. Commercial Viability", scoreA: 8.1, scoreB: 9.2, winner: "Part Two (+1.1)", delta: "+1.1", notes: "Part Two transformed cinematic sci-fi into an unmissable global event." },
    ],
    executiveDirectives: [
      "Two-Part Franchise Architecture: Never split a narrative where Part One functions purely as Act I & IIA without a standalone climactic catharsis.",
      "Active Character Agency: Audiences reward protagonists who actively make terrifying moral choices over protagonists who are merely swept along by fate.",
      "Exposition As Conflict: Never deliver lore through passive dialogue; always embed lore in a clash where characters have opposing tactical objectives."
    ]
  },
  {
    id: "rrr-kalki",
    title: "Mythological Grounding vs. Modern Spectacle: RRR vs. Kalki 2898 AD",
    tag: "Genre Showdown",
    verdict: "RRR executed superior three-act discipline with an instant character hook; Kalki built magnificent sci-fi mythology but staggered under heavy first-act setup.",
    metrics: {
      filmA: "RRR",
      scoreA: 9.2,
      filmB: "Kalki 2898 AD",
      scoreB: 8.5,
      delta: "+0.7 Act I Setup Speed",
    },
    takeaway: "Comparative analysis demonstrates that establishing visceral character bonds (RRR) hooks audiences 3x faster than high-density lore voiceovers.",
    divergenceZone: "Minute 0 to Minute 40 (Opening Hook & Protagonist Attachment)",
    divergenceReason: "RRR introduces Ram and Bheem through distinct, breathtaking 15-minute introductory spectacles that define their soul, followed by the train bridge rescue. Kalki spends 35 minutes explaining the Complex, bounty hunting, and dystopian rules before the core engine begins.",
    timelineData: [
      { minute: 15, tensionA: 9.4, tensionB: 7.2, beatA: "Ram mob battle introduction; ferocious physical conviction", beatB: "Kurukshetra prologue is brilliant, but transition to dystopian Kasi lags" },
      { minute: 40, tensionA: 9.6, tensionB: 7.8, beatA: "Bheem tiger capture & legendary train bridge rescue", beatB: "Bhairava bounty intro & Bujji banter; lighthearted comic tone disrupts gravity" },
      { minute: 70, tensionA: 9.1, tensionB: 8.4, beatA: "Naatu Naatu dance triumph & friendship brotherhood bond", beatB: "SUM-80 pregnancy escape from Complex; tension finally engages" },
      { minute: 95, tensionA: 9.7, tensionB: 8.9, beatA: "Intermission palace beast assault: peak Indian cinema setpiece", beatB: "Ashwatthama awakening and brutal fight with Bhairava" },
      { minute: 125, tensionA: 8.9, tensionB: 8.7, beatA: "Ram's revolutionary flashback; crucial emotional context", beatB: "Shambala refugee city defense; grand visual scale" },
      { minute: 160, tensionA: 9.5, tensionB: 9.6, beatA: "Alluri Sitarama Raju forest warfare; mythological catharsis", beatB: "Karna bow reveal; transcendent mythological transformation" },
    ],
    rubricComparison: [
      { layer: "1. Story Engine & Stakes", scoreA: 9.5, scoreB: 8.6, winner: "RRR (+0.9)", delta: "+0.9", notes: "RRR's dual-brotherhood engine provided unyielding clarity from minute 30." },
      { layer: "2. Screenplay Density", scoreA: 9.0, scoreB: 7.8, winner: "RRR (+1.2)", delta: "+1.2", notes: "Kalki suffered from tonal whiplash between slapstick bounty comedy and dark mythic lore." },
      { layer: "3. Morphokinetics Pacing", scoreA: 9.3, scoreB: 8.2, winner: "RRR (+1.1)", delta: "+1.1", notes: "RRR had frictionless momentum; Kalki took 50 minutes to ignite its core conflict." },
      { layer: "4. Performance Horizon", scoreA: 9.3, scoreB: 9.1, winner: "RRR (+0.2)", delta: "+0.2", notes: "NTR and Ram Charan exhibited volcanic chemistry; Amitabh Bachchan was colossal in Kalki." },
      { layer: "5. Visual Auteurship", scoreA: 9.2, scoreB: 9.4, winner: "Kalki (+0.2)", delta: "-0.2", notes: "Nag Ashwin realized an astonishing, unprecedented Indian cyberpunk dystopia." },
      { layer: "6. Soundscape Design", scoreA: 9.4, scoreB: 8.6, winner: "RRR (+0.8)", delta: "+0.8", notes: "Keeravani's score is rhythmically fused with editing; Santhosh Narayanan had uneven mixing." },
      { layer: "7. Commercial Viability", scoreA: 9.6, scoreB: 9.2, winner: "RRR (+0.4)", delta: "+0.4", notes: "RRR achieved rare universal global crossover across East and West." },
    ],
    executiveDirectives: [
      "The Cold-Open Law: In high-concept sci-fi or fantasy, ground the lead character's emotional motive before unloading the world's bureaucratic or economic rules.",
      "Tonal Uniformity Directive: Avoid sandwiching slapstick commercial comedy into a serious existential dystopia; it dissipates dread and lowers stakes.",
      "The Intermission Rule: A mega-budget tentpole must deliver an irrevocable mid-point collision that fundamentally forces both leads into opposing philosophies."
    ]
  }
];

export function DualMorphokineticsShowdown() {
  const [selectedBattle, setSelectedBattle] = useState<HeadToHeadBattle | null>(null);
  const [hoveredMinute, setHoveredMinute] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SHOWDOWN_BATTLES.map((battle) => (
          <div
            key={battle.id}
            onClick={() => setSelectedBattle(battle)}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 flex flex-col justify-between hover:border-purple-500/50 hover:bg-slate-900 transition-all shadow-xl group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-3">
                <span className="uppercase tracking-wider">{battle.tag}</span>
                <span className="rounded bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[11px] text-purple-300">
                  {battle.metrics.delta}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-snug group-hover:text-purple-300 transition-colors">
                {battle.title}
              </h3>

              <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span className="text-purple-300">{battle.metrics.filmA} ({battle.metrics.scoreA})</span>
                  <span className="text-slate-500 font-normal">vs</span>
                  <span className="text-cyan-300">{battle.metrics.filmB} ({battle.metrics.scoreB})</span>
                </div>
                <p className="text-slate-400 mt-2 text-[11px] leading-relaxed">
                  <strong>Verdict:</strong> {battle.verdict}
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed line-clamp-3">
                {battle.takeaway}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Dual Telemetry Plot</span>
              <span className="text-purple-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Inspect Dual Curves &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE MODAL: DUAL MORPHOKINETICS HEAD-TO-HEAD DEEP INSPECTION */}
      {selectedBattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-3xl border border-purple-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-8 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-400">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Dual Morphokinetics™ Comparative Telemetry</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedBattle.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  Minute-by-minute narrative tension comparison, pacing divergence mapping, and 7-layer diagnostic breakdown.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBattle(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Comparison Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">Film A Reference</span>
                <div className="text-xl font-black text-white mt-1">{selectedBattle.metrics.filmA}</div>
                <div className="text-2xl font-extrabold text-purple-400 mt-0.5">{selectedBattle.metrics.scoreA} <span className="text-xs text-slate-500 font-normal">/ 10</span></div>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">Film B Challenger</span>
                <div className="text-xl font-black text-white mt-1">{selectedBattle.metrics.filmB}</div>
                <div className="text-2xl font-extrabold text-cyan-400 mt-0.5">{selectedBattle.metrics.scoreB} <span className="text-xs text-slate-500 font-normal">/ 10</span></div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Critical Divergence</span>
                <div className="text-base font-bold text-amber-400 mt-1">{selectedBattle.metrics.delta}</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{selectedBattle.divergenceZone}</p>
              </div>
            </div>

            {/* DUAL SVG WAVEFORM VISUALIZATION */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Dual Tension Waveforms (Normalized 0 – 160 Min Timeline)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hover over timeline points to inspect concurrent scene beats and pacing differentials.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                    {selectedBattle.metrics.filmA}
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                    {selectedBattle.metrics.filmB}
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative w-full overflow-hidden pt-2">
                <svg
                  viewBox="0 0 800 240"
                  className="w-full h-48 sm:h-64 overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="gradPurple" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Tension Score Grid Lines */}
                  {[6, 7, 8, 9, 10].map((score) => {
                    const y = 220 - ((score - 5) / 5) * 200;
                    return (
                      <g key={score}>
                        <line x1="40" y1={y} x2="780" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="25" y={y + 4} fill="#64748b" fontSize="10" textAnchor="middle">{score}</text>
                      </g>
                    );
                  })}

                  {/* Critical Divergence Highlight Zone */}
                  <rect x="260" y="20" width="220" height="200" fill="#f59e0b" fillOpacity="0.06" rx="4" />
                  <text x="370" y="32" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                    CRITICAL DIVERGENCE ZONE
                  </text>

                  {/* Curve A (Purple) */}
                  {/* Points: 15min -> x=90, 35min -> x=200, 55min -> x=310, 75min -> x=420, 95min -> x=530, 120min -> x=680 */}
                  {(() => {
                    const ptsA = selectedBattle.timelineData.map((d, i) => {
                      const x = 70 + (i / (selectedBattle.timelineData.length - 1)) * 680;
                      const y = 220 - ((d.tensionA - 5) / 5) * 200;
                      return `${x},${y}`;
                    });
                    const dPath = `M ${ptsA.join(" L ")}`;
                    const areaPath = `M 70,220 L ${ptsA.join(" L ")} L 750,220 Z`;
                    return (
                      <>
                        <path d={areaPath} fill="url(#gradPurple)" />
                        <path d={dPath} fill="none" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    );
                  })()}

                  {/* Curve B (Cyan) */}
                  {(() => {
                    const ptsB = selectedBattle.timelineData.map((d, i) => {
                      const x = 70 + (i / (selectedBattle.timelineData.length - 1)) * 680;
                      const y = 220 - ((d.tensionB - 5) / 5) * 200;
                      return `${x},${y}`;
                    });
                    const dPath = `M ${ptsB.join(" L ")}`;
                    const areaPath = `M 70,220 L ${ptsB.join(" L ")} L 750,220 Z`;
                    return (
                      <>
                        <path d={areaPath} fill="url(#gradCyan)" />
                        <path d={dPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 3" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    );
                  })()}

                  {/* Interactive Timeline Points */}
                  {selectedBattle.timelineData.map((d, i) => {
                    const x = 70 + (i / (selectedBattle.timelineData.length - 1)) * 680;
                    const yA = 220 - ((d.tensionA - 5) / 5) * 200;
                    const yB = 220 - ((d.tensionB - 5) / 5) * 200;
                    const isHovered = hoveredMinute === d.minute;

                    return (
                      <g key={d.minute} className="cursor-pointer" onMouseEnter={() => setHoveredMinute(d.minute)} onMouseLeave={() => setHoveredMinute(null)}>
                        {/* Hover vertical line */}
                        {isHovered && (
                          <line x1={x} y1="20" x2={x} y2="220" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 2" />
                        )}

                        {/* Point A */}
                        <circle cx={x} cy={yA} r={isHovered ? 7 : 5} fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                        {/* Point B */}
                        <circle cx={x} cy={yB} r={isHovered ? 7 : 5} fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />

                        {/* X-axis Label */}
                        <text x={x} y="235" fill={isHovered ? "#ffffff" : "#94a3b8"} fontSize="10" textAnchor="middle" fontWeight={isHovered ? "bold" : "normal"}>
                          Min {d.minute}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Divergence Detail Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong>Forensic Diagnostic: </strong>
                {selectedBattle.divergenceReason}
              </div>
            </div>

            {/* MINUTE-BY-MINUTE DIVERGENCE TABLE */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Synchronized Beat-by-Beat Divergence Log</span>
              </h4>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3.5 w-24">Minute</th>
                      <th className="p-3.5 text-purple-400">{selectedBattle.metrics.filmA}</th>
                      <th className="p-3.5 text-cyan-400">{selectedBattle.metrics.filmB}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedBattle.timelineData.map((d) => (
                      <tr
                        key={d.minute}
                        className={`hover:bg-slate-800/30 transition ${
                          hoveredMinute === d.minute ? "bg-purple-950/30" : ""
                        }`}
                        onMouseEnter={() => setHoveredMinute(d.minute)}
                        onMouseLeave={() => setHoveredMinute(null)}
                      >
                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          Min {d.minute}
                          <div className="text-[10px] text-slate-500 font-normal">
                            Δ {(d.tensionA - d.tensionB).toFixed(1)}
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <span className="font-bold text-purple-400 mr-2">[{d.tensionA}]</span>
                          {d.beatA}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <span className="font-bold text-cyan-400 mr-2">[{d.tensionB}]</span>
                          {d.beatB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7-LAYER RUBRIC HEAD-TO-HEAD COMPARISON */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>7-Layer Rubric Scorecard Comparison</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedBattle.rubricComparison.map((r) => (
                  <div key={r.layer} className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{r.layer}</span>
                      <span className="text-xs font-bold text-amber-400">{r.winner}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-y border-slate-800/60">
                      <span className="text-purple-300 font-bold">{selectedBattle.metrics.filmA}: {r.scoreA}</span>
                      <span className="text-slate-500">vs</span>
                      <span className="text-cyan-300 font-bold">{selectedBattle.metrics.filmB}: {r.scoreB}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">{r.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* EXECUTIVE STUDIO DIRECTIVES */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 p-5 sm:p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Executive Studio Directives &amp; Takeaways</span>
              </h4>
              <div className="space-y-2">
                {selectedBattle.executiveDirectives.map((dir, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{dir}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Greybrainer Dual Morphokinetics™ Forensic Engine
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedBattle(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition"
                >
                  Close Inspection
                </button>
                <a
                  href="/#studio-diagnostic"
                  onClick={() => setSelectedBattle(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950"
                >
                  <span>Request Custom Showdown Audit</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
