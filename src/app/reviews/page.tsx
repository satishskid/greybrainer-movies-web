"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface PublishedArticle {
  id: string;
  title: string;
  slug: string;
  editorial: string | null;
  content: string;
  coverImageUrl?: string;
  publishedAt?: any;
  createdAt?: any;
}

export default function ReviewsPage() {
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const q = query(
          collection(db, "published_research"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc")
        );
        const snapshot = await getDocs(q);
        setArticles(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as PublishedArticle)
        );
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center mb-4">
            <BookOpen className="w-8 h-8 mr-4 text-indigo-400" />
            Deep Reviews
          </h1>
          <p className="text-slate-400 text-lg">
            Comprehensive three-layer film analyses powered by the Greybrainer Methodology.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No published reviews yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/reviews/${article.slug}`}
                className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-900/30 via-slate-800 to-indigo-900/30" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Deep Review
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {(article.editorial || article.content || "")
                      .replace(/[#*_\n]/g, "")
                      .slice(0, 150)}
                    …
                  </p>
                  <p className="text-xs text-slate-500 mt-3">
                    {article.publishedAt?.seconds
                      ? format(new Date(article.publishedAt.seconds * 1000), "MMM d, yyyy")
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
