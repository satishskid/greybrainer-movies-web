"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, User, ArrowLeft, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SiteArticle } from "@/lib/articleTypes";
import { publicAuthorName } from "@/lib/site";

interface ReviewArticleProps {
  article: SiteArticle;
  relatedArticles?: SiteArticle[];
}

export function ReviewArticle({ article, relatedArticles = [] }: ReviewArticleProps) {
  const showBoth = article.editorial && article.content && article.editorial !== article.content;
  const displayContent = showBoth 
    ? `${article.editorial}\n\n---\n\n## Detailed Research Analysis\n\n${article.content}`
    : (article.editorial || article.content || "");
  const publishDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const authorName = publicAuthorName(article.createdBy);
  const structuredHighlights = [
    article.verdict,
    article.whoShouldWatch,
    article.morphokineticsTeaser,
    article.producerInsight,
  ].some(Boolean);
  const layerScores = [
    { label: "Story/Script", value: article.storyScore },
    { label: "Conceptualization", value: article.conceptScore },
    { label: "Performance/Execution", value: article.executionScore },
    { label: "Overall", value: article.overallScore },
  ].filter((score) => score.value);

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
              {authorName}
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
        {structuredHighlights && (
          <section className="mb-12 border border-slate-800 bg-slate-900/80 rounded-lg overflow-hidden">
            {article.searchHeadline && article.searchHeadline !== article.title && (
              <div className="border-b border-slate-800 px-6 py-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Search Headline
                </span>
                <h2 className="mt-2 text-2xl font-bold text-white">{article.searchHeadline}</h2>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {article.verdict && (
                <div className="border-b md:border-r border-slate-800 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
                    50-Word Verdict
                  </h2>
                  <p className="mt-3 text-slate-200 leading-7">{article.verdict}</p>
                </div>
              )}

              {article.whoShouldWatch && (
                <div className="border-b border-slate-800 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
                    Who Should Watch
                  </h2>
                  <p className="mt-3 text-slate-200 leading-7">{article.whoShouldWatch}</p>
                </div>
              )}
            </div>

            {layerScores.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800">
                {layerScores.map((score) => (
                  <div key={score.label} className="p-5 border-r border-slate-800 last:border-r-0">
                    <div className="text-xs uppercase tracking-wider text-slate-500">{score.label}</div>
                    <div className="mt-2 text-2xl font-bold text-white">{score.value}</div>
                  </div>
                ))}
              </div>
            )}

            {(article.morphokineticsTeaser || article.producerInsight) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {article.morphokineticsTeaser && (
                  <div className="border-b md:border-b-0 md:border-r border-slate-800 p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-300">
                      Morphokinetics Teaser
                    </h2>
                    <p className="mt-3 text-slate-300 leading-7">{article.morphokineticsTeaser}</p>
                  </div>
                )}

                {article.producerInsight && (
                  <div className="p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
                      Producer / Director Lens
                    </h2>
                    <p className="mt-3 text-slate-300 leading-7">{article.producerInsight}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {article.diagnosticImages.length > 0 && (
          <section className="mb-12">
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Greybrainer Diagnostic Visuals
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Three-layer and Morphokinetics read
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.diagnosticImages.map((image) => (
                <figure
                  key={image.url}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                >
                  <img
                    src={image.url}
                    alt={`${article.title} ${image.label}`}
                    className="w-full rounded-md object-contain"
                  />
                  <figcaption className="mt-3 text-sm text-slate-400">{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {article.inlineImageUrls.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.inlineImageUrls.slice(0, 4).map((imageUrl, index) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`${article.title} visual ${index + 1}`}
                className="w-full rounded-lg border border-slate-800 object-cover"
              />
            ))}
          </div>
        )}

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

        {article.faqs.length > 0 && (
          <section className="mt-16 border-t border-slate-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">Reader Questions</h2>
            <div className="space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-slate-300 leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="mt-16 border-t border-slate-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">Related Greybrainer Reads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/reviews/${related.slug}`}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 hover:border-red-500/60 transition"
                >
                  <span className="text-xs uppercase tracking-wider text-slate-500">
                    {related.categoryLabel}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-white line-clamp-3">{related.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

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
