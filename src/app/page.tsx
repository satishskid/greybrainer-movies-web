import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { SITE_DESCRIPTION, absoluteUrl } from "@/lib/site";
import { StudioEnquiry } from "@/components/StudioEnquiry";
import type { SiteArticle } from "@/lib/articleTypes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Greybrainer Movies | Film craft, reviews and research" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "Greybrainer Movies", description: SITE_DESCRIPTION, url: absoluteUrl("/"), type: "website" },
};
const categories = [
  { kind: "review", title: "Deep reviews", description: "Story, direction and performance: what worked, why, and what could improve." },
  { kind: "brief", title: "Daily briefings", description: "Releases and industry developments on the editorial desk." },
  { kind: "insight", title: "Craft & insights", description: "Research into the decisions behind the screen." },
  { kind: "comparison", title: "Comparisons", description: "Different films, examined through the same craft framework." },
] as const;

export default async function Home() {
  const articles = await getAllArticles(200);
  return <HomeContent articles={articles} />;
}

export function HomeContent({ articles }: { articles: SiteArticle[] }) {
  const visibleArticles = categories.flatMap(category => articles.filter(a => a.kind === category.kind).slice(0, 6));
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage", url: absoluteUrl("/"),
    name: "Greybrainer Movies", description: SITE_DESCRIPTION,
    mainEntity: { "@type": "ItemList", itemListElement: visibleArticles.map((a, i) => ({
      "@type": "ListItem", position: i + 1, name: a.title, url: absoluteUrl(`/reviews/${a.slug}`),
    })) },
  };
  return (
    <main className="flex-1 bg-slate-950 pb-16 text-slate-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="border-b border-slate-700 pb-8 pt-28">
          <p className="text-xs font-semibold uppercase text-teal-300">Film intelligence · Editorial research</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">Greybrainer Movies</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8">What worked. Why it worked. What could be better. Evidence-linked film analysis for writers, directors and producers.</p>
          <nav aria-label="Report categories" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {categories.map(c => <a key={c.kind} href={`#${c.kind}`} className="text-white underline decoration-teal-600 underline-offset-4">{c.title} <span className="text-slate-400">{articles.filter(a => a.kind === c.kind).length}</span></a>)}
            <Link href="/reviews" className="font-semibold text-teal-300">All {articles.length} reports <ArrowRight className="inline h-4 w-4" /></Link>
          </nav>
        </header>
        {articles.length === 0 && <p className="py-12">Reports are temporarily unavailable. Please try again shortly.</p>}
        {categories.map(category => {
          const matches = articles.filter(a => a.kind === category.kind);
          if (!matches.length) return null;
          return <section key={category.kind} id={category.kind} aria-labelledby={`${category.kind}-heading`} className="scroll-mt-24 border-b border-slate-800 py-9">
            <h2 id={`${category.kind}-heading`} className="text-2xl font-bold text-white">{category.title} <span className="text-base font-normal text-slate-400">({matches.length})</span></h2>
            <p className="mt-2 text-sm text-slate-400">{category.description}</p>
            <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {matches.slice(0, 6).map(article => <li key={article.slug} className="min-w-0">
                <Link href={`/reviews/${article.slug}`} className="group block">
                  {article.coverImageUrl && <img src={article.coverImageUrl} alt="" loading={article.slug === visibleArticles[0]?.slug ? "eager" : "lazy"} fetchPriority={article.slug === visibleArticles[0]?.slug ? "high" : "auto"} className="aspect-[16/9] w-full rounded object-cover" />}
                  <p className="mt-3 text-xs text-teal-300">{article.categoryLabel}{article.historicalArchive ? " · Archive" : ""}</p>
                  <h3 className="mt-2 break-words text-xl font-semibold leading-snug text-white group-hover:text-teal-300">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{article.verdict || article.excerpt}</p>
                  {article.publishedAt && <time dateTime={article.publishedAt} className="mt-3 block text-xs text-slate-500">{new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</time>}
                </Link>
              </li>)}
            </ul>
          </section>;
        })}
        <section className="border-b border-slate-800 py-10" aria-labelledby="method-heading">
          <h2 id="method-heading" className="text-2xl font-bold text-white">Beyond the star rating</h2>
          <p className="mt-3 max-w-3xl leading-7">Three-layer craft analysis, evidence-linked Craftmatics, the Morphokinetics waveform and revisions to test. These are editorial interpretations, not measured audience responses or box-office predictions.</p>
          <p className="mt-3 text-sm text-slate-400">Historical articles retain their original dates and archive labels. They have not been re-approved under the current editorial process.</p>
          <Link href="/archive" className="mt-4 inline-block text-teal-300 underline">Explore the historical archive</Link>
        </section>
        <div className="py-10"><StudioEnquiry /></div>
        <footer className="flex flex-wrap gap-5 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <Link href="/reviews">All reports</Link><Link href="/credits">Image credits & TMDB attribution</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link>
        </footer>
      </div>
    </main>
  );
}
