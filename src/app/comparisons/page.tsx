"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Loader2 } from "lucide-react";
import type { SiteArticle } from "@/lib/articleTypes";

export default function ComparisonsPage() {
  const [articles, setArticles] = useState<SiteArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparisons() {
      try {
        const response = await fetch("/api/articles?kind=comparison&limit=60");
        if (!response.ok) throw new Error(`Comparisons request failed: ${response.status}`);
        const payload = (await response.json()) as { articles: SiteArticle[] };
        setArticles(payload.articles);
      } catch (error) {
        console.error("Failed to fetch comparisons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComparisons();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center mb-4">
            <Layers className="w-8 h-8 mr-4 text-purple-400" />
            Comparisons
          </h1>
          <p className="text-slate-400 text-lg">
            Side-by-side cinematic analysis across story, conceptualization, and execution.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 inline-block px-12 py-10">
              <Layers className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-500 mb-2">No Comparisons Yet</h2>
              <p className="text-slate-600 max-w-md">
                Imported Lens posts are now categorized. Head-to-head comparison pieces will appear here when available.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/reviews/${article.slug}`}
                className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-purple-500/60 transition duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-slate-800 to-red-900/30" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Comparison
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
