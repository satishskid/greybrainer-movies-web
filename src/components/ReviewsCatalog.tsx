"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Layers, Sparkles, Filter } from "lucide-react";
import type { SiteArticle } from "@/lib/articleTypes";

interface Props {
  initialArticles: SiteArticle[];
}

type FilterCategory = "all" | "review" | "brief" | "insight" | "comparison";

export function ReviewsCatalog({ initialArticles }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  const filteredArticles = useMemo(() => {
    let result = initialArticles;

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((a) => a.kind === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const titleMatch = a.title.toLowerCase().includes(q);
        const excerptMatch = a.excerpt?.toLowerCase().includes(q);
        const tagsMatch = a.tags?.some((t) => t.toLowerCase().includes(q));
        const categoryMatch = a.categoryLabel?.toLowerCase().includes(q);
        return titleMatch || excerptMatch || tagsMatch || categoryMatch;
      });
    }

    return result;
  }, [initialArticles, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      all: initialArticles.length,
      review: initialArticles.filter((a) => a.kind === "review").length,
      brief: initialArticles.filter((a) => a.kind === "brief").length,
      insight: initialArticles.filter((a) => a.kind === "insight").length,
      comparison: initialArticles.filter((a) => a.kind === "comparison").length,
    };
  }, [initialArticles]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by film title, director, theme, or narrative failure-mode..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder:text-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Analyses", count: categoryCounts.all },
              { id: "review", label: "Deep Reviews", count: categoryCounts.review },
              { id: "brief", label: "Intelligence Briefs", count: categoryCounts.brief },
              { id: "insight", label: "Craft & Trends", count: categoryCounts.insight },
              { id: "comparison", label: "Head-to-Head", count: categoryCounts.comparison },
            ].map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as FilterCategory)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? "bg-red-600 text-white shadow-md shadow-red-950"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] ${
                      active ? "bg-red-700 text-white" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredArticles.length}</strong> verified analyses
          </div>
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No analyses found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No film analyses match &ldquo;{searchQuery}&rdquo;. Try searching for titles like Dune, KGF, Kantara, Oppenheimer, Stree 2, or Kalki.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/reviews/${article.slug}`}
              className="group bg-slate-900/70 rounded-xl border border-slate-800 overflow-hidden hover:border-red-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-900/30 via-slate-800 to-indigo-900/30" />
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow">
                      {article.kind === "review"
                        ? "Deep Review"
                        : article.kind === "brief"
                        ? "Intelligence Brief"
                        : article.kind === "insight"
                        ? "Craft & Trend"
                        : "Comparative"}
                    </span>
                    {article.categoryLabel && (
                      <span className="bg-slate-950/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {article.categoryLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h2 className="text-lg font-bold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{formatArticleDate(article)}</span>
                <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open Analysis &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatArticleDate(article: SiteArticle) {
  if (!article.publishedAt) return "Archive";
  return new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
