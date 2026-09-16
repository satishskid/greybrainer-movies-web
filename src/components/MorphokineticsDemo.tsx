"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Layers } from "lucide-react";

interface TelemetryPoint {
  minute: number;
  tension: number;
  attention: number;
  annotation?: string;
  isRiskPoint?: boolean;
}

const MASTERCLASS_DATA: TelemetryPoint[] = [
  { minute: 0, tension: 35, attention: 90, annotation: "Cold Open Hook" },
  { minute: 15, tension: 50, attention: 88, annotation: "Inciting Disturbance" },
  { minute: 30, tension: 62, attention: 85 },
  { minute: 45, tension: 70, attention: 87, annotation: "Point of No Return" },
  { minute: 60, tension: 65, attention: 84 },
  { minute: 75, tension: 80, attention: 92, annotation: "Midpoint Reversal" },
  { minute: 90, tension: 75, attention: 89 },
  { minute: 105, tension: 88, attention: 94, annotation: "Dark Night of Soul" },
  { minute: 120, tension: 98, attention: 99, annotation: "Climax Convergence" },
  { minute: 135, tension: 45, attention: 90, annotation: "Resonant Catharsis" },
];

const FLAWED_SAG_DATA: TelemetryPoint[] = [
  { minute: 0, tension: 80, attention: 95, annotation: "Heavy CGI Exposition" },
  { minute: 15, tension: 45, attention: 75 },
  { minute: 30, tension: 40, attention: 62, annotation: "Disjointed Subplots", isRiskPoint: true },
  { minute: 45, tension: 32, attention: 48, annotation: "Second-Act Sag Threshold", isRiskPoint: true },
  { minute: 60, tension: 30, attention: 42, annotation: "Severe OTT Drop-Off Risk", isRiskPoint: true },
  { minute: 75, tension: 45, attention: 50 },
  { minute: 90, tension: 52, attention: 56, annotation: "Tardy Conflict Escalation" },
  { minute: 105, tension: 65, attention: 64 },
  { minute: 120, tension: 82, attention: 70, annotation: "Rushed Climax" },
  { minute: 135, tension: 30, attention: 50, annotation: "Abrupt Resolution" },
];

export function MorphokineticsDemo() {
  const [activeMode, setActiveMode] = useState<"masterclass" | "flawed">("masterclass");
  const data = activeMode === "masterclass" ? MASTERCLASS_DATA : FLAWED_SAG_DATA;

  // Coordinate math for 140-minute SVG graph
  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const toX = (minute: number) => paddingX + (minute / 135) * graphWidth;
  const toY = (score: number) => height - paddingY - (score / 100) * graphHeight;

  const tensionPoints = data.map((p) => `${toX(p.minute)},${toY(p.tension)}`).join(" ");
  const attentionPoints = data.map((p) => `${toX(p.minute)},${toY(p.attention)}`).join(" ");

  const tensionArea = `${toX(0)},${toY(0)} ${tensionPoints} ${toX(135)},${toY(0)}`;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-400">
            <Activity className="w-4 h-4" />
            <span>Proprietary Telemetry Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Morphokinetics™ Runtime Engagement Graph
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Minute-by-minute audience retention risk vs. narrative tension. Used by OTT acquisition teams and producers to isolate structural drop-off points before greenlight.
          </p>
        </div>

        {/* Mode Toggle Controls */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode("masterclass")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === "masterclass"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Masterclass Benchmark</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("flawed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === "flawed"
                ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Flawed 2nd-Act Sag</span>
          </button>
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <div className="mt-6 relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            <linearGradient id="tensionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={activeMode === "masterclass" ? "#10b981" : "#ef4444"}
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor={activeMode === "masterclass" ? "#10b981" : "#ef4444"}
                stopOpacity="0.0"
              />
            </linearGradient>
            <linearGradient id="attentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75, 100].map((score) => (
            <g key={score}>
              <line
                x1={paddingX}
                y1={toY(score)}
                x2={width - paddingX}
                y2={toY(score)}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 10}
                y={toY(score) + 4}
                fill="#475569"
                fontSize="10"
                textAnchor="end"
                fontWeight="500"
              >
                {score}
              </text>
            </g>
          ))}

          {/* X Axis Minute Markers */}
          {[0, 30, 60, 90, 120, 135].map((min) => (
            <text
              key={min}
              x={toX(min)}
              y={height - 10}
              fill="#64748b"
              fontSize="10"
              textAnchor="middle"
            >
              {min}m
            </text>
          ))}

          {/* Tension fill Area */}
          <polygon points={tensionArea} fill="url(#tensionGradient)" />

          {/* Lines */}
          <polyline
            fill="none"
            stroke={activeMode === "masterclass" ? "#10b981" : "#ef4444"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={tensionPoints}
          />

          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={attentionPoints}
          />

          {/* Points & Annotations */}
          {data.map((point, index) => {
            const cx = toX(point.minute);
            const cy = toY(point.tension);
            const isSag = point.isRiskPoint;

            return (
              <g key={index} className="group">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSag ? "7" : "5"}
                  fill={isSag ? "#ef4444" : activeMode === "masterclass" ? "#10b981" : "#f59e0b"}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {point.annotation && (
                  <g>
                    <rect
                      x={cx - (isSag ? 75 : 55)}
                      y={cy - 28}
                      width={isSag ? 150 : 110}
                      height={20}
                      rx="4"
                      fill={isSag ? "#450a0a" : "#0f172a"}
                      stroke={isSag ? "#ef4444" : "#334155"}
                      strokeWidth="1"
                      className="opacity-80 group-hover:opacity-100"
                    />
                    <text
                      x={cx}
                      y={cy - 15}
                      fill={isSag ? "#fca5a5" : "#e2e8f0"}
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {point.annotation}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Diagnostic Readout */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                activeMode === "masterclass" ? "bg-emerald-400" : "bg-red-500"
              }`}
            />
            <span className="text-slate-300 font-medium">Narrative Tension Velocity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-sky-400 border-b border-dashed border-sky-400" />
            <span className="text-slate-300 font-medium">Projected Audience Attention / Retention</span>
          </div>
        </div>

        <div className="text-slate-400">
          {activeMode === "masterclass" ? (
            <span className="text-emerald-400 font-medium">
              ✓ Structural integrity verified: 0 critical drop-off thresholds.
            </span>
          ) : (
            <span className="text-red-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical: 32% audience drop-off predicted between min 45–60.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
