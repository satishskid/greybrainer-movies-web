import type { ArticleKind, SiteArticle, CraftCriterionResult, ResearchLayer } from "@/lib/articleTypes";
import { isPublicWebsiteEntry, publicApi } from "@/lib/publication-feed";
import { SITE_URL } from "@/lib/site";

const DEFAULT_ARCHIVE_LIMIT = 200;

function decodeXmlEntities(input: string) {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 96);
}

function stripHtmlToText(html: string) {
  return decodeXmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

function inferKind(title: string, tags: string[], rawType?: string | null): ArticleKind {
  const lower = title.toLowerCase();
  const tagText = tags.join(" ").toLowerCase();

  if (/(comparison|head-to-head|side-by-side|versus)/i.test(title)) {
    return "comparison";
  }

  if (rawType === "review") return "review";
  if (rawType === "brief") return "brief";
  if (rawType === "study") return "insight";

  if (rawType === "research_export" || lower.startsWith("greybrainer analysis:")) {
    return "review";
  }

  if (
    /(brief|morning|weekend|must[-\s]?watch|what to watch|watchlist|pre-weekend|mid-week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}\b)/i.test(
      title,
    )
  ) {
    return "brief";
  }

  if (tagText.includes("daily") || tagText.includes("brief")) {
    return "brief";
  }

  return "insight";
}

function categoryLabel(kind: ArticleKind) {
  switch (kind) {
    case "review":
      return "Deep Review";
    case "brief":
      return "Daily Briefing";
    case "comparison":
      return "Comparison";
    case "insight":
    default:
      return "Insight";
  }
}


function makeExcerpt(markdownOrText: string, maxLength = 190) {
  const text = stripHtmlToText(markdownOrText)
    .replace(/[#*_`>\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
interface CloudflareManifestRing {
  label: string;
  score: number | string;
  description?: string;
  highlights?: string[];
}

interface CloudflareManifestEntry {
  craftmatics?: CraftCriterionResult[];
  slug: string;
  title: string;
  blogMarkdown: string;
  canonicalUrl?: string | null;
  category?: string | null;
  contentType?: string | null;
  dek?: string | null;
  heroImageUrl?: string | null;
  imageAttribution?: string | null;
  posterImageUrl?: string | null;
  thumbnailImageUrl?: string | null;
  thumbnailEyebrow?: string | null;
  overallScore?: number | string | null;
  publishedAt?: string | null;
  reviewStage?: string | null;
  scoreRings?: CloudflareManifestRing[];
  morphokinetics?: {
    summary?: string | null;
    timelineNotes?: string | null;
    keyMoments?: Array<{ position?: number; timeLabel?: string; intensity: number; event: string; emotion?: string }>;
    cinematography?: number;
    pacing?: number;
    scoreDesign?: number;
    visualAmbience?: number;
    tempoShiftLabel?: string;
    dominantBeat?: string;
    flowSummary?: string;
  } | null;
  readingMetadata?: {
    estimatedReadTime?: string;
    sectionAnchors?: Array<{ id: string; label: string; wordCount: number }>;
    relatedSlugs?: string[];
  } | null;
  keywords?: string[];
  tags?: string[];
  verdict?: string | null;
  summary?: string | null;
  summaryHook?: string | null;
  websiteUrl?: string | null;
  year?: string | number | null;
  blogHtml?: string | null;
  cast?: string | null;
}

/** "Pyre (2026) Review - Greybrainer Craft Analysis" -> "Pyre (2026)": the film, not the SEO headline. */
export function filmTitle(title: string) {
  return title.replace(/\s*(?:review)?\s*[-\u2013\u2014:|]\s*greybrainer\b.*$/i, "").replace(/^greybrainer analysis:\s*/i, "").trim() || title;
}

function normalizeCloudflareEntry(entry: CloudflareManifestEntry): SiteArticle {
  const title = filmTitle(entry.title || "Untitled Review");
  const tags = Array.isArray(entry.tags)
    ? entry.tags.map(String)
    : Array.isArray(entry.keywords)
      ? entry.keywords.map(String)
      : [];
  const kind = inferKind(title, tags, entry.contentType || "review");
  const publishedDate = entry.publishedAt ? new Date(entry.publishedAt) : new Date(0);
  const content = entry.blogMarkdown || `# ${title}`;
  const cast = entry.cast?.trim() || undefined;
  const layerName = (label: string): ResearchLayer["label"] | null =>
    /story|script/i.test(label) ? "Story / Script"
    : /concept|direction|orchestration/i.test(label) ? "Direction / Orchestration"
    : /performance|execution/i.test(label) ? "Performance / Execution" : null;
  const layers = (entry.scoreRings ?? []).flatMap(ring => {
    const label = layerName(ring.label || "");
    const score = Number(ring.score);
    return label && Number.isFinite(score) && score >= 0 && score <= 10 ? [{ label, score, description: ring.description }] : [];
  });

  let storyScore: string | undefined;
  let conceptScore: string | undefined;
  let executionScore: string | undefined;
  if (Array.isArray(entry.scoreRings)) {
    for (const ring of entry.scoreRings) {
      const label = (ring.label || "").toLowerCase();
      const scoreStr = String(ring.score ?? "");
      if (label.includes("story") || label.includes("script")) storyScore = scoreStr;
      else if (label.includes("concept") || label.includes("direction") || label.includes("orchestration")) conceptScore = scoreStr;
      else if (label.includes("execution") || label.includes("craft") || label.includes("performance"))
        executionScore = scoreStr;
    }
  }

  const overallScore =
    entry.overallScore !== null && entry.overallScore !== undefined
      ? String(entry.overallScore)
      : undefined;
  // The engine's template dek ("Explore X through story, direction and performance...") says nothing; use the report's own opening.
  const templateDek = (text?: string | null) => !text || /^explore\b.*\bthrough story, direction/i.test(text.trim());
  const opening = content.split(/\n{2,}/).map(block => block.trim()).find(block => block.length > 120 && !/^(#|\*\*[^*]+:\*\*$|[-*] )/.test(block));
  const excerpt = (!templateDek(entry.dek) && entry.dek) || (!templateDek(entry.summary) && entry.summary) || makeExcerpt(opening ?? content, 320);
  const coverImageUrl = [entry.heroImageUrl, entry.posterImageUrl, entry.thumbnailImageUrl].find(url => url?.startsWith("https://")) || undefined;

  let morphokineticsTeaser: string | undefined;
  if (entry.morphokinetics?.summary) {
    morphokineticsTeaser = entry.morphokinetics.summary;
  } else if (entry.morphokinetics?.flowSummary) {
    morphokineticsTeaser = entry.morphokinetics.flowSummary;
  } else if (entry.morphokinetics?.tempoShiftLabel) {
    morphokineticsTeaser = `Tempo Shift: ${entry.morphokinetics.tempoShiftLabel}`;
  }

  return {
    id: `cf-${entry.slug}`,
    // Rendered by the backend: exactly what the publication receipt verifies on this page.
    contentHtml: entry.blogHtml ?? undefined,
    layers,
    cast,
    year: entry.year ? String(entry.year) : undefined,
    // Only real images; the backend's generated SVG placeholder is not a poster.
    posterImageUrl: entry.posterImageUrl?.startsWith("https://") ? entry.posterImageUrl : undefined,
    craftmatics: Array.isArray(entry.craftmatics) ? entry.craftmatics : [],
    engagementMoments: (entry.morphokinetics?.keyMoments || []).map(moment => ({
      position: moment.position ?? (/^~?\d+(?:\.\d+)?%$/.test(moment.timeLabel || '') ? Number(moment.timeLabel!.replace(/[~%]/g, '')) / 100 : NaN),
      intensity: moment.intensity, event: moment.event, emotion: moment.emotion,
    })).filter((moment) => Number.isFinite(moment.position) && moment.position >= 0 && moment.position <= 1 && Number.isFinite(moment.intensity) && moment.intensity >= 0 && moment.intensity <= 10 && typeof moment.event === 'string' && !!moment.event.trim()).sort((a, b) => a.position - b.position),
    title,
    slug: entry.slug,
    kind,
    categoryLabel: entry.category || categoryLabel(kind),
    content,
    editorial: content,
    excerpt,
    coverImageUrl,
    imageAttribution: typeof entry.imageAttribution === 'string' ? entry.imageAttribution.trim() || undefined : undefined,
    createdBy: "Greybrainer AI",
    publishedAt:
      Number.isNaN(publishedDate.valueOf()) || publishedDate.valueOf() === 0
        ? null
        : publishedDate.toISOString(),
    publishedAtMs: Number.isNaN(publishedDate.valueOf()) ? 0 : publishedDate.valueOf(),
    source: "cloudflare",
    sourceUrl: entry.canonicalUrl || entry.websiteUrl || undefined,
    // The manifest also serves saved articles awaiting live verification; never call those live.
    status: tags.includes("pending_verification") ? "pending_verification" : "published",
    tags,
    type: "sovereign_review",
    seoTitle: entry.title,
    seoDescription: entry.summary || entry.dek || undefined,
    searchHeadline: (!templateDek(entry.summaryHook) && entry.summaryHook) || undefined,
    verdict: (!templateDek(entry.verdict) && entry.verdict) || undefined,
    whoShouldWatch: undefined,
    storyScore,
    conceptScore,
    executionScore,
    overallScore,
    morphokineticsTeaser,
    producerInsight: undefined,
    faqs: [],
    relatedSlugs: entry.readingMetadata?.relatedSlugs ?? [],
    inlineImageUrls: [],
    diagnosticImages: [],
  };
}

type Fetcher = (path: string) => Promise<Response>;

async function manifest(query: string, fetcher: Fetcher): Promise<SiteArticle[]> {
  try {
    const response = await fetcher(`/api/public/lens/manifest?${query}&origin=${encodeURIComponent(SITE_URL)}`);
    if (!response.ok) {
      console.warn(`Public manifest returned ${response.status}`);
      return [];
    }
    const data = (await response.json()) as { entries?: CloudflareManifestEntry[] };
    return (Array.isArray(data.entries) ? data.entries : []).filter(entry => isPublicWebsiteEntry(entry)).map(normalizeCloudflareEntry);
  } catch (error) {
    console.error("Failed to load the public manifest:", error);
    return [];
  }
}

/** Listings, archive and sitemap: verified-live articles only. */
export async function getAllArticles(maxCount = DEFAULT_ARCHIVE_LIMIT, fetcher: Fetcher = publicApi): Promise<SiteArticle[]> {
  return (await manifest(`limit=${Math.min(maxCount, 200)}`, fetcher))
    .filter(article => article.status === "published")
    .sort((a, b) => b.publishedAtMs - a.publishedAtMs);
}

/** One article, including one saved and awaiting live verification (so the receipt check can find it). */
export async function getArticleBySlug(slug: string, fetcher: Fetcher = publicApi): Promise<SiteArticle | null> {
  return (await manifest(`slug=${encodeURIComponent(slug)}`, fetcher)).find(article => article.slug === slug) ?? null;
}

export function isArticleKind(value: string | null): value is ArticleKind {
  return value === "review" || value === "brief" || value === "insight" || value === "comparison";
}
