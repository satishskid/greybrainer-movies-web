import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import { ReviewsCatalog } from "@/components/ReviewsCatalog";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Cinematic Intelligence & Deep Reviews | Greybrainer Movies",
  description:
    "Greybrainer deep movie reviews and cinematic intelligence with three-layer analysis across story, conceptualization, execution, and Morphokinetics.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Cinematic Intelligence & Deep Reviews | Greybrainer Movies",
    description:
      "Read Greybrainer deep movie reviews and cinematic intelligence with three-layer analysis and Morphokinetics.",
    url: absoluteUrl("/reviews"),
    type: "website",
  },
};

export default async function ReviewsPage() {
  const articles = await getAllArticles(220);

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 text-slate-100 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        <div className="border-b border-slate-800 pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white flex items-center mb-3">
            <BookOpen className="w-9 h-9 mr-4 text-red-500" />
            Cinematic Intelligence &amp; Deep Reviews
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            Forensic film critiques, narrative failure-mode telemetry, and auteur craft barometers powered by the Greybrainer Methodology.
          </p>
        </div>

        <ReviewsCatalog initialArticles={articles} />
      </div>
    </div>
  );
}

