import Link from "next/link";
import type { Metadata } from "next";
import { TrendingUp, Award, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import type { SiteArticle } from "@/lib/articleTypes";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Trend Intelligence & Craftsman Index | Greybrainer Movies",
  description:
    "Empirical industry trend barometers and auteur craftsman benchmarks for film producers, streaming executives, and directors.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Trend Intelligence & Craftsman Index | Greybrainer Movies",
    description:
      "Empirical industry trend barometers and auteur craftsman benchmarks for film producers, streaming executives, and directors.",
    url: absoluteUrl("/insights"),
    type: "website",
  },
};

export default async function InsightsPage() {
  const allArticles = await getAllArticles(220);
  const insights = allArticles.filter((article) => article.kind === "insight" || article.kind === "brief");

  const trendBarometers = [
    {
      title: "Q3 2026 Theatrical Barometer: Why High-Grit Action is Outperforming $200M CGI Epics",
      period: "Quarterly Analysis",
      readTime: "8 min read",
      summary:
        "Box office post-mortem examining audience fatigue with hyper-stylized digital sets. Audiences across India, North America, and Europe are paying premiums for tactile camera work and physical stunt staging.",
      metrics: ["74% audience preference for practical staging", "32% box office margin increase for grounded action"],
    },
    {
      title: "The Second-Act Breakdown: Isolating the 45-Minute Drop-off Epidemic on OTT Platforms",
      period: "Monthly Research",
      readTime: "6 min read",
      summary:
        "Telemetric investigation analyzing why 4 out of 10 streaming viewers abandon feature films between minute 40 and 65. Diagnosing narrative inflation and missing midpoint reversals.",
      metrics: ["41% viewer drop-off without midpoint stake raise", "Optimal pacing threshold: 14 min cadence"],
    },
    {
      title: "The Weaponization of Nostalgia: Why Legacy Sequels are Collapsing in Act III",
      period: "Industry Intelligence",
      readTime: "7 min read",
      summary:
        "Deconstructing legacy franchise performance. When nostalgia is substituted for organic character stakes, audiences feel emotionally defrauded, leading to steep 68% second-weekend ticket drops.",
      metrics: ["68% second-weekend collapse rate", "Critical vs Audience divergence score: 3.4x"],
    },
  ];

  const craftsmanProfiles = [
    {
      role: "Director / Action Choreographer",
      name: "Prashanth Neel & SS Rajamouli",
      focus: "Gravitas & High-Tension Setpiece Mechanics",
      traits: ["Spatial clarity in multi-opponent staging", "Slow-motion tension build-up", "Archetypal mythmaking"],
      score: "9.6 / 10 Craftmatics",
    },
    {
      role: "Auteur / Temporal Architect",
      name: "Christopher Nolan",
      focus: "Temporal Cross-Cutting & Information Architecture",
      traits: ["Triple-timeline convergence", "Auditory tension layering", "Zero exposition without visual motion"],
      score: "9.8 / 10 Craftmatics",
    },
    {
      role: "Screenplay / Structural Inversion",
      name: "Bong Joon-ho",
      focus: "Midpoint Genre Metamorphosis & Class Subtext",
      traits: ["Seamless tonal transition from comedy to thriller", "Spatial verticality metaphor", "Subtext economy"],
      score: "9.7 / 10 Craftmatics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-24 text-slate-100 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-20">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>Executive Cinematic Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trend Intelligence &amp; Craftsman Index
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-3xl leading-relaxed">
            Macroeconomic industry barometers, OTT retention telemetry, and director craft benchmarks for producers, commissioners, and creative executives.
          </p>
        </div>

        {/* SECTION 1: TREND INTELLIGENCE & QUARTERLY BAROMETERS */}
        <section id="trends" className="scroll-mt-28">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Pillar 02 • Macro Industry Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Quarterly &amp; Monthly Trend Barometers
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {trendBarometers.map((baro, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-3">
                    <span className="uppercase tracking-wider">{baro.period}</span>
                    <span className="text-slate-500">{baro.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {baro.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    {baro.summary}
                  </p>

                  <div className="mt-5 space-y-2 pt-4 border-t border-slate-800/80 text-xs">
                    {baro.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Greybrainer Macro Lens</span>
                  <span className="text-amber-400 font-semibold cursor-pointer">Read Full Briefing &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: THE CRAFTSMAN & AUTEUR INDEX */}
        <section id="craft" className="scroll-mt-28">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            <Award className="w-4 h-4" />
            <span>Pillar 03 • The Auteur &amp; Maker Profiles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Craftsman Index: Signature Styles &amp; Blind Spots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {craftsmanProfiles.map((craft, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-bold mb-2">
                    <span className="uppercase tracking-wider">{craft.role}</span>
                    <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-indigo-300 text-[11px]">
                      {craft.score}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {craft.name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-300 mt-1 mb-4">
                    Core Focus: {craft.focus}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Identified Signature Mechanisms:
                    </div>
                    {craft.traits.map((trait, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Craftmatics Assessment</span>
                  <span className="text-indigo-400 font-semibold cursor-pointer">View Dossier &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: PUBLISHED ARCHIVE OF RESEARCH PIECES */}
        {insights.length > 0 && (
          <section className="border-t border-slate-800/80 pt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Published Intelligence &amp; Thematic Analyses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((article) => (
                <Link
                  key={article.id}
                  href={`/reviews/${article.slug}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition"
                >
                  <div>
                    <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                      {article.categoryLabel || "Research"}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
                    <span>{formatDate(article)}</span>
                    <span className="text-teal-400 font-medium">Read &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function formatDate(article: SiteArticle) {
  if (!article.publishedAt) return "";
  return new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
