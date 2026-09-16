import Link from "next/link";
import type { Metadata } from "next";
import { Layers, ArrowRightLeft } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import { DualMorphokineticsShowdown } from "@/components/DualMorphokineticsShowdown";

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

        {/* SECTION 1: INTERACTIVE DUAL MORPHOKINETICS SHOWDOWNS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Dual Morphokinetics Head-to-Head Showdowns</span>
          </h2>

          <DualMorphokineticsShowdown />
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
