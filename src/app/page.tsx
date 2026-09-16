import Link from "next/link";
import {
  Film,
  TrendingUp,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  ChevronRight,
  BarChart3,
  Flame,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { getModernArticles } from "@/lib/articles";
import type { SiteArticle } from "@/lib/articleTypes";
import { MorphokineticsDemo } from "@/components/MorphokineticsDemo";
import { StudioLeadMagnet } from "@/components/StudioLeadMagnet";

export const revalidate = 900;

export default async function Home() {
  const articles = await getModernArticles(60);

  const hero = articles[0] || null;
  const topDossiers = articles.slice(0, 6);
  const trendBriefings = articles.filter((a) => a.kind === "brief" || a.kind === "insight").slice(0, 4);

  return (
    <main className="flex-1 pb-24 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* 1. HERO SECTION: Cinematic Diagnostic Intelligence */}
      <div className="relative min-h-[85vh] w-full bg-slate-950 overflow-hidden flex flex-col justify-end">
        {/* Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          {hero?.coverImageUrl ? (
            <img
              src={hero.coverImageUrl}
              alt={hero.title}
              className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105 transition-transform duration-10000 hover:scale-100"
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center opacity-25"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80")',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20 w-full">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-red-400 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Cinematic Diagnostic Intelligence</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
              ★ Studio Advisory Desk
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
            Where Films Are Diagnosed Before Greenlight &amp; Evaluated for Impact.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            Predictive screenplay diagnostics, structural pacing telemetry, and auteur craft benchmarks for studio executives, producers, and creative heads.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#studio-diagnostic"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-red-950/50 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Request Studio Diagnostic (NDA)</span>
            </a>

            <a
              href="#dossiers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 transition-colors"
            >
              <span>Explore Intelligence Dossiers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 space-y-24">
        {/* SECTION 1: ACTIVE INTELLIGENCE DOSSIERS & ESSAYS */}
        <section id="dossiers" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Executive Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Active Diagnostic Dossiers &amp; Industry Briefings
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Empirical critiques, box office behavioral analyses, and narrative tension post-mortems.
              </p>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors self-start sm:self-auto"
            >
              <span>View Full Intelligence Feed</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDossiers.map((article) => (
              <Link
                key={article.id}
                href={`/reviews/${article.slug}`}
                className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-red-500/50 hover:bg-slate-900 transition-all duration-300 shadow-lg"
              >
                {/* Poster Cover */}
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md uppercase tracking-wider">
                      {article.categoryLabel || "Briefing"}
                    </span>
                  </div>
                </div>

                {/* Dossier Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white mt-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {getExcerpt(article, 140)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-400">{getDateString(article)}</span>
                    <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Open Analysis &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: PROPRIETARY MORPHOKINETICS TELEMETRY DEMO */}
        <section id="telemetry" className="scroll-mt-24">
          <MorphokineticsDemo />
        </section>

        {/* SECTION 3: TREND INTELLIGENCE & MACRO INDUSTRY BAROMETERS */}
        <section id="trends" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Macro Shifts &amp; Industry Dynamics</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Trend Intelligence Barometers
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Analytical studies evaluating streaming platform retention, theatrical ROI thresholds, and audience appetite changes.
              </p>
            </div>
            <Link
              href="/insights#trends"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors self-start sm:self-auto"
            >
              <span>Explore All Trend Reports</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendBriefings.map((article) => (
              <Link
                key={article.id}
                href={`/reviews/${article.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-500/50 transition duration-300 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-3">
                    <span className="uppercase tracking-wider">Intelligence Briefing</span>
                    <span className="text-slate-500">{getDateString(article)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {getExcerpt(article, 180)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <span>Read Full Briefing</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 4: STUDIO LEAD MAGNET DESK */}
        <StudioLeadMagnet />

        {/* SECTION 5: HISTORICAL LENS ARCHIVE CALLOUT */}
        <section className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/60 to-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <Archive className="w-4 h-4 text-slate-400" />
              <span>Historical Repository</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              GreyBrain Lens Archive (2025–2026)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Preserved pilot reviews and early exploratory analyses conducted prior to the deployment of our 7-layer radar and Morphokinetics™ diagnostic system.
            </p>
          </div>
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-6 py-3 text-xs font-semibold text-slate-200 transition-colors shrink-0"
          >
            <span>Explore Archive</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800/80 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter">
                GREYBRAINER
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empirical cinematic intelligence and predictive screenplay diagnostics for film studios, OTT commissioners, and directors.
              </p>
              <div className="text-xs text-slate-500">
                Operating between Mumbai, Hyderabad, Los Angeles &amp; London.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Intelligence Desk
              </h4>
              <nav className="space-y-2.5 text-xs text-slate-400">
                <Link href="/reviews" className="block hover:text-white transition">Active Film Dossiers</Link>
                <Link href="/insights#trends" className="block hover:text-white transition">Trend Intelligence</Link>
                <Link href="/insights#craft" className="block hover:text-white transition">Craftsman Benchmarks</Link>
                <Link href="/comparisons" className="block hover:text-white transition">Comparative Head-to-Heads</Link>
                <Link href="/archive" className="block hover:text-amber-400 transition">Historical Archive (2025–2026)</Link>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Studio Advisory
              </h4>
              <nav className="space-y-2.5 text-xs text-slate-400">
                <a href="#studio-diagnostic" className="block hover:text-white transition">Request Script Diagnostic (NDA)</a>
                <a href="#studio-diagnostic" className="block hover:text-white transition">Rough Cut Screening Audit</a>
                <a href="#studio-diagnostic" className="block hover:text-white transition">OTT Acquisition Assessment</a>
                <a href="#studio-diagnostic" className="block hover:text-white transition">Commission Custom Analysis</a>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Verified Social Handles
              </h4>
              <nav className="space-y-2.5 text-xs text-slate-400">
                <a href="https://x.com/Greybrainlens" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">X (Twitter): @Greybrainlens</a>
                <a href="https://www.linkedin.com/company/greybrainer/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">LinkedIn: @greybrainer</a>
                <a href="https://medium.com/@GreyBrainer" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Medium: @GreyBrainer</a>
                <a href="https://www.instagram.com/greybrainlens" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Instagram: @greybrainlens</a>
                <a href="https://www.facebook.com/share/1DmapQ7Hw3/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Facebook: GreyBrainer</a>
              </nav>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© {new Date().getFullYear()} Greybrainer. All rights reserved. Strictly proprietary methodology.</div>
            <div className="flex items-center space-x-6">
              <a href="https://engine.greybrain.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">Reviewer Engine (engine.greybrain.in)</a>
              <Link href="/hub" className="hover:text-slate-300 transition">Writer Hub</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function getDateString(article: SiteArticle) {
  if (!article.publishedAt) return "";
  return new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getExcerpt(article: SiteArticle, maxLen = 160) {
  const text = article.excerpt || article.editorial || article.content || "";
  if (text.length <= maxLen) return text;
  return ;
}
