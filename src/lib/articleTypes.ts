export type ArticleKind = "review" | "brief" | "insight" | "comparison";

export interface SiteArticle {
  id: string;
  title: string;
  slug: string;
  kind: ArticleKind;
  categoryLabel: string;
  content: string;
  editorial: string | null;
  excerpt: string;
  coverImageUrl?: string;
  createdBy: string;
  publishedAt: string | null;
  publishedAtMs: number;
  source: "firebase" | "lens-archive";
  sourceUrl?: string;
  status: string;
  tags: string[];
  type: string;
}
