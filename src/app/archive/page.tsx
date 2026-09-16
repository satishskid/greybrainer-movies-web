import Link from "next/link";
import { Archive, ArrowLeft, ExternalLink, Film } from "lucide-react";
import { getLegacyArchiveArticles } from "@/lib/articles";

export const revalidate = 900;

export const metadata = {
  title: "GreyBrain Lens Archive (2025–2026) | Historical Reviews",
  description: "Historical early-phase reviews and pilot analyses preserved for research reference.",
};

export default async function ArchivePage() {
  const legacyArticles = await getLegacyArchiveArticles(100);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Executive Desk</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Archive className="w-4 h-4" />
            <span>Research Repository</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            GreyBrain Lens Archive (2025–2026)
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-3 leading-relaxed">
            These early film reviews were compiled during our initial methodology development phase. Modern diagnostic dossiers utilizing our 7-layer radar rubric, Morphokinetics™ audience retention graphs, and NDA-backed studio audits are featured on the main desk.
          </p>
        </div>

        {/* Legacy Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {legacyArticles.map((article) => (
            <Link
              key={article.id}
              href={`/reviews/${article.slug}`}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 shadow-md"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                {article.coverImageUrl ? (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                    <Film className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 border border-slate-700 rounded px-2 py-0.5 text-[10px] font-semibold text-slate-400 backdrop-blur-sm">
                  Legacy Pilot
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {article.title.replace(/^Greybrainer Analysis[:\-\s]*/i, "")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "2026 Archive"}</span>
                  <span className="text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Read Archive &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
