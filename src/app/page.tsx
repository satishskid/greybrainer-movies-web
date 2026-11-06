import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import type { SiteArticle } from "@/lib/articleTypes";
import { MorphokineticsWaveform } from "@/components/MorphokineticsWaveform";
import { StudioEnquiry } from "@/components/StudioEnquiry";

// ponytail: render per request so new approvals appear at once; add a cache when traffic needs it.
export const dynamic = "force-dynamic";

const reviewedScores = (article: SiteArticle) =>
  (article.craftmatics ?? []).filter(c => c.status === "reviewed" && typeof c.score === "number");

// The report that best shows the method: newest review with editor-reviewed Craftmatics, else the newest article.
const pickFeatured = (articles: SiteArticle[]) =>
  articles.find(a => a.kind === "review" && reviewedScores(a).length > 0) ?? articles[0] ?? null;

export default async function Home() {
  const articles = await getAllArticles(60);
  const featured = pickFeatured(articles);
  const more = articles.filter(a => a.slug !== featured?.slug).slice(0, 6);

  return (
    <main className="flex-1 bg-slate-950 pb-20 text-slate-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="pt-24 pb-10">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">Film analysis for the people who make films</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            What works in a film, what does not, why, and what a maker could change. Each report is AI-assisted research,
            checked against sources and approved by an editor before it is published.
          </p>
        </section>

        {featured ? <FeaturedReport article={featured} /> : (
          <p className="border-t border-slate-800 py-10 text-slate-400">The first reports are being reviewed. Please check back soon.</p>
        )}

        <section id="method" aria-labelledby="method-heading" className="scroll-mt-24 border-t border-slate-800 py-12">
          <h2 id="method-heading" className="text-2xl font-bold text-white">What a report contains</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              ["Three-layer assessment", "Story and script, direction and orchestration, performance and execution, each scored out of 10 with the reasoning."],
              ["Morphokinetics", "A reading of how the film's tension rises and falls across its running time, drawn from the research, not from audience measurement."],
              ["Craftmatics", "Eight screenplay and editing criteria scored 0 to 4, each tied to a quoted piece of evidence and the department responsible."],
              ["Revisions to test", "Concrete changes a writer, director or editor could try, with what to preserve and the trade-off involved."],
              ["Full research and sources", "The complete analysis, with corrections the engine made and the limits of what the evidence supports."],
            ].map(([term, detail]) => (
              <div key={term} className="border-l-2 border-teal-500 pl-4">
                <dt className="font-semibold text-white">{term}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-400">{detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-400">
            Limits: reports interpret the film and what has been written about it. They do not measure audiences, predict box office,
            or replace watching the film. Scores marked &ldquo;AI-proposed, editor accepted&rdquo; were proposed by the engine and accepted by an editor;
            criteria without enough evidence are left unscored.
          </p>
        </section>

        {more.length > 0 && (
          <section aria-labelledby="more-heading" className="border-t border-slate-800 py-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="more-heading" className="text-2xl font-bold text-white">More reports</h2>
              <Link href="/reviews" className="text-sm font-semibold text-teal-300 hover:text-white">All reports</Link>
            </div>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map(article => (
                <li key={article.slug}>
                  <Link href={`/reviews/${article.slug}`} className="group block">
                    {article.coverImageUrl && <img src={article.coverImageUrl} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover opacity-80 group-hover:opacity-100" />}
                    <h3 className="mt-3 font-semibold text-white group-hover:text-teal-300">{article.title}</h3>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-400">{article.searchHeadline || article.verdict || article.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="border-t border-slate-800 py-12">
          <StudioEnquiry />
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Greybrainer</span>
          <nav className="flex flex-wrap gap-5">
            <Link href="/reviews" className="hover:text-white">Reports</Link>
            <Link href="/#method" className="hover:text-white">Method</Link>
            <Link href="/credits" className="hover:text-white">Image credits</Link>
            <a href="mailto:dr.satish@greybrain.ai" className="hover:text-white">Contact</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}

function FeaturedReport({ article }: { article: SiteArticle }) {
  const scores = reviewedScores(article);
  const finding = article.searchHeadline || article.verdict || article.excerpt;
  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : null;
  return (
    <section aria-labelledby="featured-heading" className="border-t border-slate-800 py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Latest report{published ? ` · ${published}` : ""}</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-[180px_1fr]">
        {article.posterImageUrl && <img src={article.posterImageUrl} alt={`${article.title} poster`} width={180} height={270} className="aspect-[2/3] w-36 object-cover sm:w-44" />}
        <div>
          <h2 id="featured-heading" className="text-2xl font-bold text-white sm:text-3xl">
            <Link href={`/reviews/${article.slug}`} className="hover:text-teal-300">{article.title}</Link>
          </h2>
          {finding && <p className="mt-3 text-lg leading-8 text-slate-200">{finding}</p>}
          {article.cast && <p className="mt-3 text-sm text-slate-400"><span className="text-slate-500">Featuring </span>{article.cast}</p>}
          <Link href={`/reviews/${article.slug}`} className="mt-5 inline-block bg-teal-400 px-4 py-2 font-semibold text-slate-950 hover:bg-teal-300">Read the full report</Link>
        </div>
      </div>

      {scores.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-white">Craftmatics</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {scores.map(c => (
              <li key={c.id}>
                <div className="flex justify-between gap-3 text-sm"><span className="text-slate-200">{c.label}</span><span className="text-teal-300">{c.score}/4</span></div>
                <div className="mt-1 h-1.5 bg-slate-800"><div className="h-full bg-teal-400" style={{ width: `${c.score! * 25}%` }} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            {scores.every(c => c.decision === "accepted") ? "AI-proposed, editor accepted. " : "Editor-reviewed. "}
            Evidence for each score is in the report.
          </p>
        </div>
      )}

      {(article.engagementMoments?.length ?? 0) > 0 && (
        <MorphokineticsWaveform movieTitle={article.title} teaserText={article.morphokineticsTeaser} moments={article.engagementMoments} />
      )}
    </section>
  );
}
