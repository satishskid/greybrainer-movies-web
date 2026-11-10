import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl, NOINDEX } from "@/lib/site";
import { publicationDate } from "@/lib/article-schema";

// ponytail: render per request so new approvals appear at once; add a cache when traffic needs it.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (NOINDEX) return [];
  const articles = await getAllArticles(220);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/reviews"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/archive"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/insights"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/comparisons"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/reviews/${article.slug}`),
    ...(publicationDate(article.publishedAt) ? { lastModified: publicationDate(article.publishedAt) } : {}),
    changeFrequency: "monthly" as const,
    priority: article.kind === "review" ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
