import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles(220);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/reviews"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/insights"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/comparisons"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/reviews/${article.slug}`),
    lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: "monthly" as const,
    priority: article.kind === "review" ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
