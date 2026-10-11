import type { EngagementMoment } from "@/lib/articleTypes";

interface Props {
  movieTitle: string;
  teaserText?: string;
  moments?: EngagementMoment[];
}

export function MorphokineticsWaveform({ movieTitle, teaserText, moments = [] }: Props) {
  const points = moments.filter(point => Number.isFinite(point.position) && point.position >= 0 && point.position <= 1 && Number.isFinite(point.intensity) && point.intensity >= 0 && point.intensity <= 10 && point.event).sort((a, b) => a.position - b.position);
  const x = (position: number) => 45 + position * 630;
  const y = (intensity: number) => 240 - intensity * 20;
  const path = points.map((point, index) => `${index ? "L" : "M"} ${x(point.position)} ${y(point.intensity)}`).join(" ");
  return (
    <section className="my-10 border-y border-slate-700 py-8">
      <h2 className="text-2xl font-bold text-white">Morphokinetics: how {movieTitle} moves and feels</h2>
      <p className="mt-2 text-sm text-slate-400">Research-estimated emotional intensity, not measured audience retention. Positions are approximate proportions of the story.</p>
      {points.length >= 2 ? (
        <>
          <svg role="img" aria-label={`Research-supported emotional intensity for ${movieTitle}`} viewBox="0 0 720 280" className="mt-6 w-full">
            {[0, 2, 4, 6, 8, 10].map(value => <g key={value}><line x1="45" x2="675" y1={y(value)} y2={y(value)} stroke="#475569" /><text x="28" y={y(value) + 4} fill="#cbd5e1" fontSize="12">{value}</text></g>)}
            <path d={path} fill="none" stroke="#ef4444" strokeWidth="3" />
            {points.map((point, index) => <circle key={index} cx={x(point.position)} cy={y(point.intensity)} r="4" fill="#2dd4bf"><title>{`${Math.round(point.position * 100)}%: ${point.event} (${point.intensity}/10)`}</title></circle>)}
            <text x="45" y="267" fill="#cbd5e1" fontSize="12">Beginning</text><text x="675" y="267" textAnchor="end" fill="#cbd5e1" fontSize="12">End</text>
          </svg>
          {teaserText && <details className="mt-4 border-y border-slate-700 py-3"><summary className="cursor-pointer font-semibold text-teal-300">Research interpretation</summary><p className="mt-3 leading-7 text-slate-200">{teaserText}</p></details>}
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">{points.map((point, index) => <li key={index} className="border-l-2 border-teal-400 pl-3"><span className="text-sm font-semibold text-teal-300">{Math.round(point.position * 100)}% · {point.intensity}/10</span><p className="mt-1 text-sm leading-6 text-slate-200">{point.event}</p>{point.emotion && <p className="text-xs text-slate-400">{point.emotion}</p>}</li>)}</ol>
        </>
      ) : <><p className="mt-5 text-sm text-slate-400">A research-supported timeline is not available for this report. No pacing curve has been inferred from its overall score.</p>{teaserText && <p className="mt-4 leading-7 text-slate-200">{teaserText}</p>}</>}
    </section>
  );
}
