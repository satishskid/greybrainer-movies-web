"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Zap, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";

interface TelemetryPoint {
  minute: number;
  tension: number;       // 0 - 10
  attention: number;     // 0 - 100
  remediated: number;    // 0 - 10
  milestone?: string;
  annotation?: string;
  isRisk?: boolean;
  directive?: string;
}

interface Props {
  movieTitle: string;
  runtimeMinutes?: number;
  teaserText?: string;
  overallScore?: string | number;
  storyScore?: string | number;
  executionScore?: string | number;
}

// Cubic Bezier Spline generator
function getSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

export function MorphokineticsWaveform({
  movieTitle,
  runtimeMinutes = 135,
  teaserText,
  overallScore,
  storyScore,
  executionScore,
}: Props) {
  const [viewMode, setViewMode] = useState<"remediation" | "retention">("remediation");
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Generate dynamic telemetry points tailored to this film's scores
  const baseScore = parseFloat(String(overallScore || "7.5")) || 7.5;
  const isHighTension = baseScore >= 8.0;

  const points: TelemetryPoint[] = [
    {
      minute: 0,
      tension: 3.5,
      attention: 92,
      remediated: 4.0,
      milestone: "Cold Hook",
      annotation: "Initial thematic hook and protagonist state of normalcy.",
    },
    {
      minute: 18,
      tension: 5.5,
      attention: 88,
      remediated: 5.8,
      milestone: "Inciting Disturbance",
      annotation: "Catalyst shatters protagonist equilibrium.",
    },
    {
      minute: 34,
      tension: 6.8,
      attention: 84,
      remediated: 7.2,
      milestone: "Point of No Return",
      annotation: "Act 1 lock: Protagonist fully commits to core narrative quest.",
    },
    {
      minute: 54,
      tension: isHighTension ? 5.2 : 3.4,
      attention: isHighTension ? 68 : 42,
      remediated: 6.8,
      milestone: "Sag Alert",
      isRisk: true,
      annotation: "Second-act drag: Conversational exposition slows emotional urgency.",
      directive: "Compress subplots; consolidate scene 42-45 exposition into physical action.",
    },
    {
      minute: 74,
      tension: isHighTension ? 7.8 : 6.0,
      attention: 75,
      remediated: 8.0,
      milestone: "Midpoint Shift",
      annotation: "Stakes invert: Protagonist shifts from defense to active offensive.",
    },
    {
      minute: 95,
      tension: isHighTension ? 6.5 : 4.8,
      attention: 62,
      remediated: 7.5,
      milestone: "Crisis / Dark Night",
      isRisk: !isHighTension,
      annotation: "Apparent defeat: Protagonist stripped of primary allies.",
      directive: "Elevate moral stakes to prevent viewer emotional fatigue.",
    },
    {
      minute: 116,
      tension: isHighTension ? 9.6 : 8.2,
      attention: 95,
      remediated: 9.8,
      milestone: "Climax Convergence",
      annotation: "All narrative threads converge in primary conflict confrontation.",
    },
    {
      minute: runtimeMinutes,
      tension: 4.5,
      attention: 88,
      remediated: 5.0,
      milestone: "Catharsis",
      annotation: "Emotional aftermath resolution and philosophical takeaway.",
    },
  ];

  const SVG_WIDTH = 720;
  const SVG_HEIGHT = 260;
  const MARGIN = { top: 35, right: 35, bottom: 45, left: 45 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

  const toX = (min: number) => MARGIN.left + (min / runtimeMinutes) * CHART_WIDTH;
  const toYTension = (score: number) => MARGIN.top + CHART_HEIGHT - (score / 10) * CHART_HEIGHT;
  const toYAttention = (score: number) => MARGIN.top + CHART_HEIGHT - (score / 100) * CHART_HEIGHT;

  const origPoints = points.map((p) => ({ x: toX(p.minute), y: toYTension(p.tension) }));
  const remedPoints = points.map((p) => ({ x: toX(p.minute), y: toYTension(p.remediated) }));
  const attenPoints = points.map((p) => ({ x: toX(p.minute), y: toYAttention(p.attention) }));

  const origSpline = getSmoothSplinePath(origPoints);
  const remedSpline = getSmoothSplinePath(remedPoints);
  const attenSpline = getSmoothSplinePath(attenPoints);

  const areaBottom = MARGIN.top + CHART_HEIGHT;
  const origArea = `${origSpline} L ${origPoints[origPoints.length - 1].x} ${areaBottom} L ${origPoints[0].x} ${areaBottom} Z`;

  return (
    <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl my-10">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Proprietary Telemetry Waveform</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {movieTitle}: Morphokinetics™ Narrative Pacing
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Minute-by-minute audience retention risk vs. narrative tension. Identifies structural sag points and retention thresholds.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode("remediation")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === "remediation"
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3 h-3 text-red-400" />
            <span>Draft vs Remediated</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("retention")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === "retention"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3 h-3 text-sky-400" />
            <span>Retention Probability</span>
          </button>
        </div>
      </div>

      {/* SVG Curve */}
      <div className="mt-5 bg-slate-950/70 rounded-xl border border-slate-800/80 p-4 relative">
        <div className="flex items-center justify-between text-xs mb-3 px-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
              <span>Theatrical Cut Tension</span>
            </span>

            {viewMode === "remediation" ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                <span>Target Remediated Curve</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-400 inline-block" />
                <span>Audience Retention Probability</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Runtime: ~{runtimeMinutes}m
          </span>
        </div>

        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="articleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Drop-off Danger Zone Shading (Minute 48 to 68) */}
          <rect
            x={toX(48)}
            y={MARGIN.top}
            width={toX(68) - toX(48)}
            height={CHART_HEIGHT}
            fill="#ef4444"
            fillOpacity="0.12"
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="3 2"
            rx="3"
          />
          <text
            x={toX(58)}
            y={MARGIN.top + 16}
            fill="#f87171"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="1"
          >
            DROP-OFF DANGER ZONE (Act 2A)
          </text>

          {/* Grid lines */}
          {[2, 4, 6, 8, 10].map((score) => (
            <g key={score}>
              <line
                x1={MARGIN.left}
                y1={toYTension(score)}
                x2={MARGIN.left + CHART_WIDTH}
                y2={toYTension(score)}
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <text
                x={MARGIN.left - 8}
                y={toYTension(score) + 3}
                fill="#475569"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {score}
              </text>
            </g>
          ))}

          {/* Area fill under original tension */}
          <path d={origArea} fill="url(#articleAreaGrad)" />

          {/* Mode Line */}
          {viewMode === "remediation" ? (
            <path
              d={remedSpline}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeDasharray="4 2"
            />
          ) : (
            <path
              d={attenSpline}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
            />
          )}

          {/* Original Tension Curve */}
          <path
            d={origSpline}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
          />

          {/* Timeline Milestones on X-axis */}
          {[0, 30, 60, 90, 120, runtimeMinutes].map((min) => (
            <g key={min}>
              <line
                x1={toX(min)}
                y1={MARGIN.top}
                x2={toX(min)}
                y2={MARGIN.top + CHART_HEIGHT}
                stroke="#1e293b"
                strokeWidth="0.8"
              />
              <text
                x={toX(min)}
                y={MARGIN.top + CHART_HEIGHT + 16}
                fill="#64748b"
                fontSize="9"
                textAnchor="middle"
                fontWeight="bold"
              >
                {min === 0 ? "0m" : `${min}m`}
              </text>
            </g>
          ))}

          {/* Data Circles */}
          {points.map((p, idx) => {
            const cx = toX(p.minute);
            const cy = toYTension(p.tension);
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(p);
                  setHoverPosition({ x: cx, y: cy });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setHoverPosition(null);
                }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={p.isRisk ? 5.5 : 3.5}
                  fill={p.isRisk ? "#ef4444" : "#f87171"}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  className="transition-transform hover:scale-150"
                />
                {p.milestone && (
                  <text
                    x={cx}
                    y={cy - 8}
                    fill={p.isRisk ? "#f87171" : "#94a3b8"}
                    fontSize="7.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {p.milestone}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover Tooltip */}
          {hoveredPoint && hoverPosition && (
            <g
              transform={`translate(${Math.min(SVG_WIDTH - 210, Math.max(MARGIN.left, hoverPosition.x - 100))}, ${
                hoverPosition.y > 130 ? hoverPosition.y - 95 : hoverPosition.y + 12
              })`}
              className="pointer-events-none"
            >
              <rect
                width="200"
                height="85"
                rx="6"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
                filter="drop-shadow(0 6px 12px rgba(0,0,0,0.5))"
              />
              <text x="10" y="18" fill="#ffffff" fontSize="10" fontWeight="bold">
                Minute {hoveredPoint.minute}m: {hoveredPoint.milestone}
              </text>
              <text x="10" y="32" fill="#f87171" fontSize="9" fontWeight="bold">
                Tension: {hoveredPoint.tension}/10 | Retention: {hoveredPoint.attention}%
              </text>
              <foreignObject x="10" y="36" width="180" height="42">
                <div className="text-[9px] text-slate-300 line-clamp-2 leading-tight">
                  {hoveredPoint.annotation}
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>

      {/* Teaser & Editorial Insight */}
      {teaserText && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-teal-300 uppercase tracking-wider text-[11px] block mb-1">
            Morphokinetics Observation:
          </strong>
          {teaserText}
        </div>
      )}
    </section>
  );
}
