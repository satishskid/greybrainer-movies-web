"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, User, ArrowLeft, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SiteArticle } from "@/lib/articleTypes";

interface ReviewArticleProps {
  article: SiteArticle;
}

export function ReviewArticle({ article }: ReviewArticleProps) {
  const displayContent = article.editorial || article.content || "";
  const publishDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <article className="min-h-screen bg-slate-900">
      {/* Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20 z-10" />
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-800 to-indigo-900/40" />
        )}

        <div className="relative z-20 h-full flex flex-col justify-end max-w-4xl mx-auto px-8 pb-12">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition mb-6 inline-flex items-center w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider w-fit mb-4">
            {article.categoryLabel}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center space-x-6 text-slate-300 text-sm">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {article.createdBy || "Greybrainer AI"}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {publishDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <button
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: article.title,
                    url: window.location.href,
                  });
                  return;
                }

                await navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center hover:text-white transition"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Source
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-red-400
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-slate-200
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
          prose-ul:text-slate-300
          prose-ol:text-slate-300
          prose-blockquote:border-red-500 prose-blockquote:text-slate-400
          prose-hr:border-slate-700
          prose-code:text-red-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Powered by</span>
              <p className="text-lg font-bold text-red-500">GREYBRAINER</p>
              <p className="text-sm text-slate-400 mt-1">AI-Powered Cinematic Intelligence</p>
            </div>
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition text-sm"
            >
              ← More Reviews
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
