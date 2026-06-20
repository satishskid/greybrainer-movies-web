export type ArticleKind = "review" | "brief" | "insight" | "comparison";

export interface ArticleFaq {
  question: string;
  answer: string;
}

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
  youtubeScript?: string;
  seoTitle?: string;
  seoDescription?: string;
  searchHeadline?: string;
  verdict?: string;
  whoShouldWatch?: string;
  storyScore?: string;
  conceptScore?: string;
  executionScore?: string;
  overallScore?: string;
  morphokineticsTeaser?: string;
  producerInsight?: string;
  faqs: ArticleFaq[];
  relatedSlugs: string[];
  inlineImageUrls: string[];
}
