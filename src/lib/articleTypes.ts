export type ArticleKind = "review" | "brief" | "insight" | "comparison";

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleDiagnosticImage {
  label: string;
  url: string;
}

export interface SiteArticle {
  craftmatics?: CraftCriterionResult[];
  engagementMoments?: EngagementMoment[];
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
  source: "cloudflare" | "firebase" | "lens-archive";
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
  diagnosticImages: ArticleDiagnosticImage[];
}

export interface EngagementMoment {
  position: number;
  intensity: number;
  event: string;
  emotion?: string;
}

export interface CraftCriterionResult {
  id: string;
  label: string;
  department: string;
  score: number | null;
  status: string;
  evidence?: string | null;
  locator?: string | null;
  mechanism?: string | null;
  improvement?: string | null;
  preserve?: string | null;
  tradeOff?: string | null;
  test?: string | null;
  uncertainty?: string | null;
  rationale?: string | null;
  contributors: { name: string; role: string; portraitUrl?: string | null; sourceUrl?: string | null }[];
}
