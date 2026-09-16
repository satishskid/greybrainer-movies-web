import Link from "next/link";
import {
  Film,
  TrendingUp,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  Award,
  ChevronRight,
  BarChart3,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import type { SiteArticle } from "@/lib/articleTypes";
import { MorphokineticsDemo } from "@/components/MorphokineticsDemo";
import { StudioLeadMagnet } from "@/components/StudioLeadMagnet";

export const revalidate = 900;

export default async function Home() {
  const articles = await getAllArticles(100);

  const hero = articles[0] || null;
  const deepReviews = articles.filter((a) => a.kind === "review").slice(0, 8);
  const trendBriefings = articles.filter((a) => a.kind === "brief").slice(0, 6);
  const insights = articles.filter((a) => a.kind === "insight").slice(0, 6);
  const comparisons = articles.filter((a) => a.kind === "comparison").slice(0, 4);

  // Masterclass benchmarks
  const masterclassReviews = articles.filter(
    (a) =>
      a.tags?.some((t) => ["classic", "masterpiece", "benchmark", "historical"].includes(t.toLowerCase())) ||
      a.title.toLowerCase().includes("odyssey") ||
      a.title.toLowerCase().includes("godfather")
  ).slice(0, 4);

  return (
    <main className="flex-1 pb-24 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* 1. HERO SECTION: Cinematic Diagnostic Intelligence */}
      <div className="relative min-h-[90vh] w-full bg-slate-950 overflow-hidden flex flex-col justify-end">
        {/* Cinematic Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          {hero?.coverImageUrl ? (
            <img
              src={hero.coverImageUrl}
              alt={hero.title}
              className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105 transition-transform duration-10000 hover:scale-100"
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center opacity-30"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80")',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20 w-full">
          {/* Diagnostic Badge */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-red-400 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Cinematic Diagnostic Intelligence</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
              ★ The Second Room for Studio Executives
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
            Where Films Are Diagnosed Before Greenlight &amp; Evaluated for Impact.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            Predictive screenplay diagnostics, 7-layer craft rubrics, and minute-by-minute morphokinetic telemetry. Trusted by producers, acquisition teams, and directors to de-risk investments.
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
              href="#ongoing-dossiers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 transition-colors"
            >
              <span>Explore Live Film Dossiers</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Audience Validation Bar */}
          <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-slate-300">Target Readership &amp; Advisory:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-medium text-slate-400">
              <span>Amazon Prime Video</span>
              <span>•</span>
              <span>Netflix Global</span>
              <span>•</span>
              <span>Disney+ Hotstar</span>
              <span>•</span>
              <span>JioCinema Studios</span>
              <span>•</span>
              <span>Independent Producers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 space-y-24">
        {/* PILLAR 1: ONGOING DEEP FILM DOSSIERS */}
        <section id="ongoing-dossiers" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Pillar 01 • Ongoing Forensic Dossiers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Deep Film Reviews &amp; Diagnostic Dossiers
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Rigorous 7-layer post-mortems examining Story Intent, Conceptual Friction, Staging, Director Signature, and Commercial Viability.
              </p>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors self-start sm:self-auto"
            >
              <span>View All Dossiers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deepReviews.map((article) => (
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

                  {/* Grey Verdict Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                      ★ Grey Verdict
                    </span>
                  </div>
                </div>

                {/* Dossier Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                      {article.categoryLabel || "Deep Review"}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {getExcerpt(article, 110)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-400">{getDateString(article)}</span>
                    <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Open Dossier &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: THE INTERACTIVE MORPHOKINETICS TELEMETRY DEMO */}
        <section className="scroll-mt-24">
          <MorphokineticsDemo />
        </section>

        {/* PILLAR 2: TREND INTELLIGENCE & QUARTERLY BAROMETERS */}
        <section id="trend-intelligence" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Pillar 02 • Macro Industry Analysis</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Trend Intelligence &amp; Industry Barometers
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Monthly &amp; Quarterly analytical deep dives tracking OTT audience fatigue, second-act structural breakdowns, and genre shifts.
              </p>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors self-start sm:self-auto"
            >
              <span>All Trend Reports</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendBriefings.length > 0
              ? trendBriefings.slice(0, 3).map((article) => (
                  <Link
                    key={article.id}
                    href={`/reviews/${article.slug}`}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-500/50 transition duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-3">
                        <span className="uppercase tracking-wider">Macro Shift</span>
                        <span className="text-slate-500">{getDateString(article)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                        {getExcerpt(article, 140)}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1">
                      <span>Read Intelligence Briefing</span>
                      <span>&rarr;</span>
                    </div>
                  </Link>
                ))
              : [
                  {
                    title: "The Second-Act Breakdown: Why $50M Action Films Are Losing Gen-Z Attention",
                    summary:
                      "An empirical analysis of narrative friction across streaming releases in 2026, isolating the 45-minute drop-off threshold.",
                    tag: "Screenplay Architecture",
                  },
                  {
                    title: "OTT Streaming Fatigue and the Resurgence of High-Intensity Event Cinema",
                    summary:
                      "Why viewers are abandoning mid-budget streaming fare while turning spectacles with high morphokinetic amplitude into cultural events.",
                    tag: "Platform Positioning",
                  },
                  {
                    title: "The Weaponization of Nostalgia to Mask Creatively Bankrupt Franchises",
                    summary:
                      "Deconstructing legacy sequels: why IP recognition without structural freshness yields catastrophic box office decay in Act III.",
                    tag: "Acquisition Risk",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
                        {item.tag}
                      </div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.summary}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <span>Executive Research Brief</span>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* PILLAR 3: CRAFTSMAN & AUTEUR ANALYSIS */}
        <section id="craftsman-index" className="scroll-mt-24">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/30 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Pillar 03 • The Auteur &amp; Maker Index</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                  Craftsman Benchmarks &amp; Director Magic Factors
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                  We don't review films in isolation. We track individual makers—directors, screenwriters, lead actors, and cinematographers—isolating their signature rhythm, staging depth, and craft blind spots across their careers.
                </p>
                <div className="mt-6">
                  <Link
                    href="/insights#craft"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all"
                  >
                    <span>Explore Craftsman Profiles</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Craftsman Specimen Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Director Telemetry</div>
                  <h4 className="text-base font-bold text-white mt-1">Staging &amp; Visual Rhythm</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Evaluates spatial blocking, shot transition cadence, and visual clarity during high-kinetic action setpieces.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Screenwriting Craft</div>
                  <h4 className="text-base font-bold text-white mt-1">Dialogue Economy</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Measures subtext density and whether exposition is dramatized organically or delivered via artificial monologue.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Performance Audit</div>
                  <h4 className="text-base font-bold text-white mt-1">Actor Cadence &amp; Gravitas</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Diagnoses how emotional restraint, voice modulation, and presence anchor narrative stakes for audiences.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Craftmatics Rubric</div>
                  <h4 className="text-base font-bold text-white mt-1">Source-Linked Evidence</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Every assessment is grounded in timestamped scene analysis rather than subjective critic whims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PILLAR 4: COMPARATIVE CINEMATIC INTELLIGENCE */}
        <section id="comparisons" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Pillar 04 • Comparative Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Head-to-Head &amp; Sequel Diagnostics
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Side-by-side Dual Morphokinetics comparing sequels against originals, or genre showdowns between competing studio tentpoles.
              </p>
            </div>
            <Link
              href="/comparisons"
              className="inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors self-start sm:self-auto"
            >
              <span>Explore All Comparisons</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
                  Sequel vs. Original Head-to-Head
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  Did the Sequel Sacrifice Second-Act Nuance for Raw Scale?
                </h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  Dual Morphokinetics overlay plotting how sequel escalation frequently triggers audience fatigue before the third act begins.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Comparative Telemetry</span>
                <span className="text-purple-400 font-semibold">View Dual Graph &rarr;</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
                  Genre Showdown &amp; Pacing Duel
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  High-Concept Thriller vs. Character Procedural
                </h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  A structural confrontation comparing audience retention curves across streaming platforms vs theatrical engagement.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Comparative Telemetry</span>
                <span className="text-purple-400 font-semibold">View Dual Graph &rarr;</span>
              </div>
            </div>
          </div>
        </section>

        {/* PILLAR 5: BLAST FROM THE PAST (THE MASTERCLASS VAULT) */}
        <section id="masterclass-vault" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-teal-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pillar 05 • The Criterion Vault</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Blast from the Past: Perfect-Score Masterworks
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                How great cinema is constructed. Deconstructive breakdowns of 10/10 masterworks providing gold-standard structural baselines for today's writers and producers.
              </p>
            </div>
            <Link
              href="/reviews?tag=classic"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors self-start sm:self-auto"
            >
              <span>Explore Masterclass Vault</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "The Godfather (1972)",
                director: "Francis Ford Coppola",
                score: "10.0",
                highlight: "Flawless moral descent pacing & three-act structural economy.",
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Sholay (1975)",
                director: "Ramesh Sippy",
                score: "9.9",
                highlight: "Archetypal villain gravitas and perfect narrative setpiece distribution.",
                image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Mayabazar (1957)",
                director: "K. V. Reddy",
                score: "10.0",
                highlight: "Mythological staging, comedic balance, and timeless character dynamics.",
                image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Parasite (2019)",
                director: "Bong Joon-ho",
                score: "9.8",
                highlight: "The gold standard of the mid-point narrative genre inversion.",
                image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80",
              },
            ].map((classic, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-teal-500/50 transition duration-300"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                  <img
                    src={classic.image}
                    alt={classic.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-teal-500/90 text-slate-950 font-black text-xs px-2 py-0.5 rounded">
                    {classic.score} / 10
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{classic.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{classic.director}</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{classic.highlight}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-semibold text-teal-400">
                    Masterclass Blueprint &rarr;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: STUDIO LEAD MAGNET DESK */}
        <StudioLeadMagnet />

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
                The 5 Pillars
              </h4>
              <nav className="space-y-2.5 text-xs text-slate-400">
                <Link href="/reviews" className="block hover:text-white transition">Ongoing Deep Reviews</Link>
                <Link href="/insights#trends" className="block hover:text-white transition">Trend Intelligence</Link>
                <Link href="/insights#craft" className="block hover:text-white transition">Craftsman &amp; Auteur Index</Link>
                <Link href="/comparisons" className="block hover:text-white transition">Comparative Head-to-Heads</Link>
                <Link href="/reviews?tag=classic" className="block hover:text-white transition">Blast from Past (Vault)</Link>
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
                <a href="/sample-studio-dossier.pdf" download className="block hover:text-white transition">Download Specimen Dossier</a>
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
  return `${text.slice(0, maxLen).replace(/[#*_\n]/g, "").trim()}...`;
}
