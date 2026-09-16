import Link from "next/link";
import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import type { SiteArticle } from "@/lib/articleTypes";
import { ExecutiveResearchDesk } from "@/components/ExecutiveResearchDesk";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Trend Intelligence & Craftsman Index | Greybrainer Movies",
  description:
    "Empirical industry trend barometers, macro research dossiers, and auteur craftsman benchmarks for film producers, streaming executives, and directors.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Trend Intelligence & Craftsman Index | Greybrainer Movies",
    description:
      "Empirical industry trend barometers, macro research dossiers, and auteur craftsman benchmarks for film producers, streaming executives, and directors.",
    url: absoluteUrl("/insights"),
    type: "website",
  },
};

export default async function InsightsPage() {
  const allArticles = await getAllArticles(220);
  const insights = allArticles.filter((article) => article.kind === "insight" || article.kind === "brief");

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-24 text-slate-100 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-20">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>Executive Cinematic Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trend Intelligence &amp; Craftsman Index
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-3xl leading-relaxed">
            Macroeconomic industry barometers, OTT retention telemetry, and director craft benchmarks for producers, commissioners, and creative executives.
          </p>
        </div>

        {/* INTERACTIVE EXECUTIVE RESEARCH DESK (TRENDS + CRAFTSMEN WITH LIVE DOSSIERS) */}
        <ExecutiveResearchDesk />

        {/* SECTION 3: PUBLISHED ARCHIVE OF RESEARCH PIECES */}
        {insights.length > 0 && (
          <section className="border-t border-slate-800/80 pt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Published Intelligence &amp; Thematic Analyses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((article) => (
                <Link
                  key={article.id}
                  href={`/reviews/${article.slug}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition"
                >
                  <div>
                    <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                      {article.categoryLabel || "Research"}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
                    <span>{formatDate(article)}</span>
                    <span className="text-teal-400 font-medium">Read &rarr;</span>
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

function formatDate(article: SiteArticle) {
  if (!article.publishedAt) return "";
  return new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
