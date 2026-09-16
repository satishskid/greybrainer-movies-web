import Link from "next/link";
import type { Metadata } from "next";
import { Layers, Activity, ArrowRightLeft, ShieldCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Comparative Cinematic Intelligence | Greybrainer Movies",
  description:
    "Side-by-side Dual Morphokinetics and narrative pacing comparisons between sequels, prequels, and competing genre tentpoles.",
  alternates: { canonical: "/comparisons" },
  openGraph: {
    title: "Comparative Cinematic Intelligence | Greybrainer Movies",
    description:
      "Side-by-side Dual Morphokinetics and narrative pacing comparisons between sequels, prequels, and competing genre tentpoles.",
    url: absoluteUrl("/comparisons"),
    type: "website",
  },
};

export default async function ComparisonsPage() {
  const allArticles = await getAllArticles(220);
  const comparisonArticles = allArticles.filter((article) => article.kind === "comparison");

  const headToHeadBattles = [
    {
      title: "Sequel Escalation vs. Narrative Economy: KGF Chapter 1 vs. KGF Chapter 2",
      tag: "Sequel Forensic",
      verdict: "Chapter 1 had higher structural tension; Chapter 2 peaked on scale but suffered mid-act fatigue.",
      metrics: { filmA: "KGF 1 (Score: 8.9)", filmB: "KGF 2 (Score: 8.1)", delta: "-0.8 Act II Sag" },
      takeaway:
        "Dual Morphokinetics shows that doubling the action setpieces without expanding emotional vulnerability increases audience detachment past minute 70.",
    },
    {
      title: "Worldbuilding Exposition vs. Propulsive Climax: Dune Part One vs. Dune Part Two",
      tag: "Franchise Duel",
      verdict: "Part Two corrected Part One's truncated climax with continuous forward-moving tempo.",
      metrics: { filmA: "Dune 1 (Score: 8.4)", filmB: "Dune 2 (Score: 9.3)", delta: "+0.9 Climax Velocity" },
      takeaway:
        "Part Two's pacing succeeds because every conversational scene doubles as political warfare, maintaining tension without dead space.",
    },
    {
      title: "Mythological Grounding vs. Modern Spectacle: RRR vs. Kalki 2898 AD",
      tag: "Genre Showdown",
      verdict: "RRR maintained tighter three-act discipline; Kalki excelled in visual lore but staggered in Act I setup.",
      metrics: { filmA: "RRR (Score: 9.2)", filmB: "Kalki (Score: 8.5)", delta: "+0.7 Act I Setup Speed" },
      takeaway:
        "Comparative analysis reveals that cold-open character bonds (RRR) hook multi-demographic audiences 3x faster than high-density lore voiceovers.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-24 text-slate-100 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-400" />
            <span>Pillar 04 • Comparative Telemetry</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comparative Cinematic Intelligence
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-3xl leading-relaxed">
            Side-by-side head-to-head diagnostics comparing sequels against originals, or genre showdowns between competing studio tentpoles using Dual Morphokinetics.
          </p>
        </div>

        {/* SECTION 1: FEATURED HEAD-TO-HEAD BATTLES */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Dual Morphokinetics Head-to-Head Showdowns</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {headToHeadBattles.map((battle, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-3">
                    <span className="uppercase tracking-wider">{battle.tag}</span>
                    <span className="rounded bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[11px] text-purple-300">
                      {battle.metrics.delta}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-snug">
                    {battle.title}
                  </h3>

                  <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                      <span>{battle.metrics.filmA}</span>
                      <span className="text-slate-500">vs</span>
                      <span>{battle.metrics.filmB}</span>
                    </div>
                    <p className="text-slate-400 mt-2 text-[11px] leading-relaxed">
                      <strong>Verdict:</strong> {battle.verdict}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    {battle.takeaway}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Dual Telemetry Plot</span>
                  <span className="text-purple-400 font-semibold cursor-pointer">Inspect Dual Curves &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: PUBLISHED COMPARISON ARTICLES */}
        {comparisonArticles.length > 0 && (
          <section className="border-t border-slate-800/80 pt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Published Comparative Analyses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/reviews/${article.slug}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-purple-500/40 hover:bg-slate-900 transition"
                >
                  <div>
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 block">
                      Comparative Review
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-purple-400 font-semibold flex items-center justify-between">
                    <span>Read Head-to-Head &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
