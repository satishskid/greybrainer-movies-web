"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Film, TrendingUp, BookOpen, Layers, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface PublishedArticle {
  id: string;
  title: string;
  type: string;
  slug: string;
  editorial: string | null;
  content: string;
  coverImageUrl?: string;
  createdBy: string;
  publishedAt?: any;
  createdAt?: any;
  status: string;
}

export default function Home() {
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublished() {
      try {
        const q = query(
          collection(db, "published_research"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc"),
          limit(12)
        );
        const snapshot = await getDocs(q);
        setArticles(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as PublishedArticle)
        );
      } catch (err) {
        console.error("Failed to fetch published articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublished();
  }, []);

  const hero = articles[0] || null;
  const deepReviews = articles.filter((a) => a.type === "research_export");
  const insights = articles.filter((a) => a.type !== "research_export");

  function getDateString(article: PublishedArticle) {
    const ts = article.publishedAt || article.createdAt;
    if (!ts?.seconds) return "";
    return format(new Date(ts.seconds * 1000), "MMM d, yyyy");
  }

  function getExcerpt(article: PublishedArticle, maxLen = 180) {
    const text = article.editorial || article.content || "";
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).replace(/[#*_\n]/g, "").trim() + "…";
  }

  return (
    <main className="flex-1 pb-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
        {hero?.coverImageUrl ? (
          <img
            src={hero.coverImageUrl}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80")',
            }}
          />
        )}
        <div className="relative z-20 h-full flex flex-col justify-end px-8 pb-24 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              Latest Deep Review
            </span>
            {hero && <span className="text-yellow-400 font-bold">★ Greybrainer Certified</span>}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            {hero ? hero.title : "Greybrainer Movies"}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 line-clamp-3">
            {hero
              ? getExcerpt(hero)
              : "Comprehensive cinematic research, deep reviews, and morphokinetic breakdowns powered by the Greybrainer Methodology."}
          </p>
          <div className="flex space-x-4">
            <Link
              href={hero ? `/reviews/${hero.slug}` : "/reviews"}
              className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold hover:bg-slate-200 transition flex items-center"
            >
              <Film className="w-5 h-5 mr-2" />
              Read Analysis
            </Link>
            <Link
              href="/hub"
              className="bg-slate-600/60 backdrop-blur-md text-white px-8 py-3 rounded-md font-semibold hover:bg-slate-600/80 transition"
            >
              Writer Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-30 space-y-16">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        )}

        {/* Deep Reviews Row */}
        {deepReviews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-indigo-400" />
                Deep Reviews
              </h2>
              <Link href="/reviews" className="text-sm text-slate-400 hover:text-white transition">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deepReviews.map((article) => (
                <Link
                  key={article.id}
                  href={`/reviews/${article.slug}`}
                  className="group aspect-video bg-slate-800 rounded-lg border border-slate-700 hover:scale-[1.03] transition duration-300 cursor-pointer overflow-hidden relative"
                >
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-800 to-indigo-900/40" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                    <h3 className="font-bold text-white">{article.title}</h3>
                    <p className="text-sm text-slate-400">{getDateString(article)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Daily Briefings Row (Placeholder - future content type) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-red-500" />
              Daily Briefings
            </h2>
            <span className="text-sm text-slate-500">Coming Soon</span>
          </div>
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-[300px] h-48 bg-slate-800/50 rounded-lg border border-slate-700/30 flex flex-col justify-end p-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                <div className="relative z-20">
                  <span className="text-xs text-slate-500 mb-2 block">Coming Soon</span>
                  <h3 className="text-lg font-semibold text-slate-500">Daily Industry Brief</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights & Research Row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Layers className="w-6 h-6 mr-3 text-teal-400" />
              Insights & Morphokinetics
            </h2>
          </div>
          {insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((article) => (
                <Link
                  key={article.id}
                  href={`/reviews/${article.slug}`}
                  className="h-64 bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col cursor-pointer hover:bg-slate-800/80 transition"
                >
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                    Research
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {getExcerpt(article, 120)}
                  </p>
                  <div className="mt-auto text-sm text-slate-500">Read Research →</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/30 p-6 flex flex-col"
                >
                  <span className="text-xs font-semibold text-teal-400/40 uppercase tracking-wider mb-2">
                    Research
                  </span>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">Coming Soon</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Thematic explorations and morphokinetic breakdowns will appear here.
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About / Footer */}
        <footer className="border-t border-slate-800 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-red-500 mb-2">GREYBRAINER</h3>
              <p className="text-sm text-slate-400">
                AI-powered cinematic intelligence. Comprehensive film analysis using a proprietary three-layer methodology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Content</h4>
              <nav className="space-y-2 text-sm text-slate-400">
                <Link href="/reviews" className="block hover:text-white transition">Deep Reviews</Link>
                <Link href="/insights" className="block hover:text-white transition">Insights & Research</Link>
                <Link href="/comparisons" className="block hover:text-white transition">Comparisons</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Connect</h4>
              <nav className="space-y-2 text-sm text-slate-400">
                <a href="https://www.linkedin.com/company/greybrainer/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">LinkedIn</a>
                <a href="https://medium.com/@GreyBrainer" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Medium</a>
                <a href="https://x.com/Greybrainlens" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">X (Twitter)</a>
                <a href="https://www.facebook.com/share/1DmapQ7Hw3/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Facebook</a>
                <a href="https://www.instagram.com/greybrainlens" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Instagram</a>
                <a href="https://greybrain.ai" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">greybrain.ai</a>
              </nav>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Greybrainer. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}
