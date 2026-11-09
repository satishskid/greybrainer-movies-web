import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl, NOINDEX } from "@/lib/site";

// ponytail: render per request so new approvals appear at once; add a cache when traffic needs it.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (NOINDEX) return [];
  const articles = await getAllArticles(220);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/reviews"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/archive"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/insights"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/comparisons"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/reviews/${article.slug}`),
    lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: "monthly" as const,
    priority: article.kind === "review" ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
