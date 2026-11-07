import Link from "next/link";
import type { SiteArticle } from "@/lib/articleTypes";
import { MorphokineticsWaveform } from "@/components/MorphokineticsWaveform";
import { CraftmaticsReport } from "@/components/CraftmaticsReport";
import { ImageCredits } from "@/components/ImageCredits";

interface ReviewArticleProps {
  article: SiteArticle;
  relatedArticles?: SiteArticle[];
}

const reviewed = (article: SiteArticle) =>
  (article.craftmatics ?? []).filter(c => c.status === "reviewed" && typeof c.score === "number" && !!c.evidence && !!c.improvement);

export function ReviewArticle({ article, relatedArticles = [] }: ReviewArticleProps) {
  const finding = article.searchHeadline || article.verdict || article.excerpt;
  const published = article.status === "published" && article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const revisions = reviewed(article);
  const layers = article.layers ?? [];

  return (
    <article className="min-h-screen bg-slate-950 pb-20 pt-28 sm:pt-24 text-slate-300">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* 1. Film identity and the finding */}
        <header className={`grid gap-6 border-b border-slate-800 pb-8 sm:gap-8 ${article.posterImageUrl ? 'sm:grid-cols-[160px_1fr]' : ''}`}>
          {article.posterImageUrl && (
            <img src={article.posterImageUrl} alt={`${article.title} poster`} width={160} height={240}
              className="hidden aspect-[2/3] w-40 rounded object-cover sm:block" />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              <Link href="/reviews" className="hover:text-white">Research</Link>
              {" · "}{article.categoryLabel}{article.year ? ` · ${article.year}` : ""}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{article.title}</h1>
            {finding && <p className="mt-4 text-lg leading-8 text-slate-200">{finding}</p>}
            {article.cast && <p className="mt-4 text-sm text-slate-400"><span className="text-slate-500">Featuring </span>{article.cast}</p>}
            <p className="mt-2 text-xs text-slate-500">
              {published ? `Published ${published}` : "Saved for publication; not yet verified live."}
            </p>
          </div>
        </header>

        <aside aria-label="Research limitations" className="mt-6 border-l-2 border-amber-400 pl-4 text-sm leading-6 text-slate-300">
          {article.historicalArchive
            ? 'From the Greybrainer archive, restored with its original publication date. It has not been re-approved under the current editorial process. '
            : 'AI-assisted research, reviewed by an editor before publication. '}
          Scores, timings and the waveform are interpretations of the film and its sources,
          not measured audience data. Check claims and suggested edits against the film before making production decisions.
          {article.historicalArchive && article.originalSourceUrl?.startsWith('https://medium.com/') && (
            <> <a href={article.originalSourceUrl} rel="noopener noreferrer" className="text-teal-300 underline">Original publication</a>.</>
          )}
        </aside>

        {/* 2. Three-layer assessment */}
        {layers.length > 0 && (
          <section aria-labelledby="layers-heading" className="mt-10">
            <h2 id="layers-heading" className="text-2xl font-bold text-white">Three-layer assessment</h2>
            <p className="mt-2 text-sm text-slate-400">Research scores out of 10 from the analysis below{article.overallScore ? `; overall ${article.overallScore}/10` : ""}.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {layers.map(layer => (
                <div key={layer.label} className="border-t border-slate-700 pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-white">{layer.label}</h3>
                    <span className="text-xl font-bold text-teal-300">{layer.score}<span className="text-sm text-slate-500">/10</span></span>
                  </div>
                  <div className="mt-3 h-2 bg-slate-800" role="img" aria-label={`${layer.label}: ${layer.score} out of 10`}>
                    <div className="h-full bg-teal-400" style={{ width: `${layer.score * 10}%` }} />
                  </div>
                  {layer.description && <p className="mt-3 text-sm leading-6 text-slate-400">{layer.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Morphokinetics */}
        {(!article.historicalArchive || (article.engagementMoments?.length ?? 0) > 0) && <MorphokineticsWaveform movieTitle={article.title} teaserText={article.morphokineticsTeaser} moments={article.engagementMoments} />}

        {/* 4. Craftmatics */}
        {!article.historicalArchive && <CraftmaticsReport criteria={article.craftmatics} />}

        {/* 5. Revisions and tradeoffs */}
        {!article.historicalArchive && <section aria-labelledby="revisions-heading" className="mt-10">
          <h2 id="revisions-heading" className="text-2xl font-bold text-white">Revisions to test</h2>
          {revisions.length ? (
            <ol className="mt-5 space-y-5">
              {revisions.map(c => (
                <li key={c.id} className="border-l-2 border-amber-400 pl-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{c.label} · {c.department}</p>
                  <p className="mt-1 leading-7 text-slate-200">{c.improvement}</p>
                  {c.tradeOff && <p className="mt-1 text-sm text-slate-400"><strong className="text-slate-300">Trade-off: </strong>{c.tradeOff}</p>}
                  {c.preserve && <p className="mt-1 text-sm text-slate-400"><strong className="text-slate-300">Preserve: </strong>{c.preserve}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-400">
              No editor-reviewed revisions yet. The full research below includes the analysis&apos;s own suggested improvements; those have not been editorially approved.
            </p>
          )}
        </section>}

        {/* 6. Full research */}
        <section aria-labelledby="research-heading" className="mt-12 border-t border-slate-800 pt-10">
          <h2 id="research-heading" className="text-2xl font-bold text-white">Full research</h2>
          {/* Backend-escaped HTML; headings shift down one level so the page keeps one h1. Text is unchanged, which the receipt check relies on. */}
          <div className="prose prose-invert mt-6 max-w-none prose-headings:text-white prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-slate-300 prose-a:text-teal-300 prose-li:text-slate-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: (article.contentHtml ?? "").replace(/<(\/?)h([1-5])>/g, (_, close, level) => `<${close}h${Number(level) + 1}>`) }} />
        </section>

        {relatedArticles.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-14 border-t border-slate-800 pt-8">
            <h2 id="related-heading" className="text-xl font-bold text-white">Related research</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {relatedArticles.map(related => (
                <li key={related.slug}>
                  <Link href={`/reviews/${related.slug}`} className="block border-t border-slate-700 pt-3 text-sm font-semibold text-white hover:text-teal-300">{related.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ImageCredits attribution={article.imageAttribution} imageUrl={article.posterImageUrl || article.coverImageUrl} />

        {/* 7. Enquiry */}
        <section aria-labelledby="enquiry-heading" className="mt-14 border border-slate-700 p-6">
          <h2 id="enquiry-heading" className="text-xl font-bold text-white">Working on a film?</h2>
          <p className="mt-2 leading-7 text-slate-300">
            The same method can be applied to a script or rough cut before release, under NDA, with findings for the writer, director and editor.
          </p>
          <Link href="/#studio-diagnostic" className="mt-4 inline-block bg-teal-400 px-4 py-2 font-semibold text-slate-950 hover:bg-teal-300">
            Request a confidential pre-production analysis
          </Link>
        </section>
      </div>
    </article>
  );
}
