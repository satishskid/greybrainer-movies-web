import type { SiteArticle } from "./articleTypes";

export function publicationDate(value: string | null): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  const normalized = date.toISOString();
  return normalized.slice(0, 19) === value.slice(0, 19) ? normalized : undefined;
}

export function articleSchemaFacts(article: SiteArticle) {
  const date = publicationDate(article.publishedAt);
  // SiteArticle has no confirmed Movie identity; maker analysis must not imply review-star eligibility.
  return {
    "@type": "Article" as const,
    ...(date ? { datePublished: date } : {}),
  };
}
