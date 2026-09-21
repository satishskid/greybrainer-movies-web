import lensArchiveData from "@/data/lensArchive.json";
import type { ArticleDiagnosticImage, ArticleFaq, ArticleKind, SiteArticle } from "@/lib/articleTypes";
import { publicAuthorName } from "@/lib/site";

const LENS_FEED_URL = process.env.LENS_ARCHIVE_FEED_URL || "https://medium.com/feed/@GreyBrainer";
const DEFAULT_ARCHIVE_LIMIT = 220;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "greybrainer";
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY";
const FIRESTORE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

interface LensArchiveEntry {
  id: string;
  title: string;
  slug: string;
  kind: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  createdBy?: string;
  publishedAt: string | null;
  publishedAtMs: number;
  sourceUrl?: string;
  tags?: string[];
}

interface FirestoreRestDocument {
  name: string;
  fields?: Record<string, FirestoreRestValue>;
}

interface FirestoreRunQueryRow {
  document?: FirestoreRestDocument;
}

type FirestoreRestValue =
  | { nullValue: null }
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreRestValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreRestValue> } };

const FALLBACK_IMAGES: Record<ArticleKind, string> = {
  review:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
  brief:
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80",
  insight:
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
  comparison:
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80",
};

async function withTimeout<T>(promise: Promise<T>, fallback: T, label: string, ms = 7000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`${label} timed out after ${ms}ms.`);
      resolve(fallback);
    }, ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function decodeXmlEntities(input: string) {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTagValue(source: string, tagName: string) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const match = source.match(pattern);
  if (!match) return null;
  const value = match[1].trim();
  const cdataMatch = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return decodeXmlEntities((cdataMatch ? cdataMatch[1] : value).trim());
}

function extractTagValues(source: string, tagName: string) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "gi");
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    const value = match[1].trim();
    const cdataMatch = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    values.push(decodeXmlEntities((cdataMatch ? cdataMatch[1] : value).trim()));
  }
  return values;
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

function htmlToMarkdown(html: string) {
  return decodeXmlEntities(
    html
      .replace(/<figure[\s\S]*?<\/figure>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
        const heading = stripHtmlToText(content).trim();
        return heading ? `\n\n${"#".repeat(Number(level))} ${heading}\n\n` : "\n\n";
      })
      .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
        const label = stripHtmlToText(text).trim();
        return label ? `[${label}](${href})` : "";
      })
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => `- ${stripHtmlToText(content).trim()}\n`)
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => `${stripHtmlToText(content).trim()}\n\n`)
      .replace(/<ol[^>]*>|<\/ol>|<ul[^>]*>|<\/ul>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function extractFirstImageUrl(html: string) {
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    const srcMatch = tag.match(/\s(?:src|data-src)=["']([^"']+)["']/i);
    if (srcMatch?.[1]) {
      return decodeXmlEntities(srcMatch[1]);
    }
    const srcsetMatch = tag.match(/\ssrcset=["']([^"']+)["']/i);
    if (srcsetMatch?.[1]) {
      const first = srcsetMatch[1].split(",")[0]?.trim().split(/\s+/)[0];
      if (first) return decodeXmlEntities(first);
    }
  }
  return null;
}

function cleanMediumUrl(url: string | null) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

function inferKind(title: string, tags: string[], rawType?: string | null): ArticleKind {
  const lower = title.toLowerCase();
  const tagText = tags.join(" ").toLowerCase();

  if (/(comparison|head-to-head|side-by-side|versus)/i.test(title)) {
    return "comparison";
  }

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

function timestampToDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date;
  }
  if (typeof value === "object") {
    const candidate = value as { seconds?: number; toDate?: () => Date };
    if (typeof candidate.toDate === "function") {
      return candidate.toDate();
    }
    if (typeof candidate.seconds === "number") {
      return new Date(candidate.seconds * 1000);
    }
  }
  return null;
}

function makeExcerpt(markdownOrText: string, maxLength = 190) {
  const text = stripHtmlToText(markdownOrText)
    .replace(/[#*_`>\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function firestoreValueToJson(value: FirestoreRestValue | undefined): unknown {
  if (!value || "nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(firestoreValueToJson);
  }
  if ("mapValue" in value) {
    return firestoreFieldsToJson(value.mapValue.fields || {});
  }
  return null;
}

function firestoreFieldsToJson(fields: Record<string, FirestoreRestValue>) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, firestoreValueToJson(value)]),
  );
}

function normalizeFirestoreRestDocument(document: FirestoreRestDocument) {
  const id = document.name.split("/").at(-1) || document.name;
  return normalizeFirebaseDoc(id, firestoreFieldsToJson(document.fields || {}));
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

function normalizeFaqs(value: unknown): ArticleFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const entry = item as { question?: unknown; answer?: unknown };
      const question = optionalString(entry.question);
      const answer = optionalString(entry.answer);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is ArticleFaq => Boolean(item));
}

function normalizeDiagnosticImages(value: unknown): ArticleDiagnosticImage[] {
  if (!value || typeof value !== "object") return [];

  const images = value as { rings?: unknown; morpho?: unknown };
  const normalized: ArticleDiagnosticImage[] = [];
  const rings = optionalString(images.rings);
  const morpho = optionalString(images.morpho);

  if (rings) {
    normalized.push({ label: "Three-Layer Concentric Rings", url: rings });
  }

  if (morpho) {
    normalized.push({ label: "Morphokinetics Flow", url: morpho });
  }

  return normalized;
}

function normalizeFirebaseDoc(id: string, data: Record<string, unknown>): SiteArticle {
  const title = String(data.title ?? "Untitled");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const type = String(data.type ?? "research_export");
  const kind = inferKind(title, tags, type);
  const publishedDate = timestampToDate(data.publishedAt) ?? timestampToDate(data.createdAt) ?? new Date(0);
  const content = String(data.content ?? "");
  const editorial = typeof data.editorial === "string" ? data.editorial : null;
  const diagnosticImages = normalizeDiagnosticImages(data.images);
  const diagnosticUrls = new Set(diagnosticImages.map((image) => image.url));

  return {
    id,
    title,
    slug: String(data.slug ?? slugify(title)),
    kind,
    categoryLabel: categoryLabel(kind),
    content,
    editorial,
    excerpt: makeExcerpt(editorial || content),
    coverImageUrl: typeof data.coverImageUrl === "string" && data.coverImageUrl ? data.coverImageUrl : FALLBACK_IMAGES[kind],
    createdBy: publicAuthorName(String(data.createdBy ?? "Greybrainer AI")),
    publishedAt: publishedDate.valueOf() > 0 ? publishedDate.toISOString() : null,
    publishedAtMs: publishedDate.valueOf(),
    source: "firebase",
    sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
    status: String(data.status ?? "published"),
    tags,
    type,
    seoTitle: optionalString(data.seoTitle),
    seoDescription: optionalString(data.seoDescription),
    searchHeadline: optionalString(data.searchHeadline),
    verdict: optionalString(data.verdict),
    whoShouldWatch: optionalString(data.whoShouldWatch),
    storyScore: optionalString(data.storyScore),
    conceptScore: optionalString(data.conceptScore),
    executionScore: optionalString(data.executionScore),
    overallScore: optionalString(data.overallScore),
    morphokineticsTeaser: optionalString(data.morphokineticsTeaser),
    producerInsight: optionalString(data.producerInsight),
    faqs: normalizeFaqs(data.faqs),
    relatedSlugs: stringArray(data.relatedSlugs),
    inlineImageUrls: stringArray(data.inlineImageUrls).filter((url) => !diagnosticUrls.has(url)),
    diagnosticImages,
  };
}

function normalizeFeedItem(itemXml: string, index: number): SiteArticle | null {
  const title = extractTagValue(itemXml, "title") ?? "Untitled";
  const link = cleanMediumUrl(extractTagValue(itemXml, "link"));
  const htmlContent = extractTagValue(itemXml, "content:encoded") ?? extractTagValue(itemXml, "description") ?? "";
  const pubDate = extractTagValue(itemXml, "pubDate");
  const tags = extractTagValues(itemXml, "category");
  const kind = inferKind(title, tags);
  const markdown = `# ${title}\n\n${htmlToMarkdown(htmlContent)}`.trim();
  const publishedDate = pubDate ? new Date(pubDate) : new Date(0);

  if (!title || markdown.length < 80) {
    return null;
  }

  return {
    id: `lens-${slugify(title)}-${index}`,
    title,
    slug: slugify(title),
    kind,
    categoryLabel: categoryLabel(kind),
    content: markdown,
    editorial: markdown,
    excerpt: makeExcerpt(htmlContent),
    coverImageUrl: extractFirstImageUrl(htmlContent) ?? FALLBACK_IMAGES[kind],
    createdBy: "GreyBrain Lens",
    publishedAt: Number.isNaN(publishedDate.valueOf()) ? null : publishedDate.toISOString(),
    publishedAtMs: Number.isNaN(publishedDate.valueOf()) ? 0 : publishedDate.valueOf(),
    source: "lens-archive",
    sourceUrl: link,
    status: "published",
    tags,
    type: kind === "review" ? "archive_review" : `archive_${kind}`,
    faqs: [],
    relatedSlugs: [],
    inlineImageUrls: [],
    diagnosticImages: [],
  };
}

function normalizeStaticArchiveEntry(entry: LensArchiveEntry): SiteArticle {
  const tags = Array.isArray(entry.tags) ? entry.tags.map(String) : [];
  const kind = isArticleKind(entry.kind) ? entry.kind : inferKind(entry.title, tags);
  const content = entry.content || `# ${entry.title}`;

  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug || slugify(entry.title),
    kind,
    categoryLabel: categoryLabel(kind),
    content,
    editorial: content,
    excerpt: entry.excerpt || makeExcerpt(content),
    coverImageUrl: entry.coverImageUrl || FALLBACK_IMAGES[kind],
    createdBy: entry.createdBy || "GreyBrain Lens",
    publishedAt: entry.publishedAt,
    publishedAtMs: Number(entry.publishedAtMs) || 0,
    source: "lens-archive",
    sourceUrl: entry.sourceUrl,
    status: "published",
    tags,
    type: kind === "review" ? "archive_review" : `archive_${kind}`,
    faqs: [],
    relatedSlugs: [],
    inlineImageUrls: [],
    diagnosticImages: [],
  };
}

async function getPublishedFirebaseArticles(maxCount: number) {
  try {
    const response = await fetch(`${FIRESTORE_REST_BASE}:runQuery?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "published_research" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "status" },
              op: "EQUAL",
              value: { stringValue: "published" },
            },
          },
        },
      }),
      next: { revalidate: 60 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) {
      throw new Error(`Firestore REST returned ${response.status}`);
    }

    const rows = (await response.json()) as FirestoreRunQueryRow[];
    return rows
      .map((row) => row.document)
      .filter((document): document is FirestoreRestDocument => Boolean(document))
      .map(normalizeFirestoreRestDocument)
      .sort((a, b) => b.publishedAtMs - a.publishedAtMs)
      .slice(0, maxCount);
  } catch (error) {
    console.error("Failed to load Firebase published articles:", error);
    return [];
  }
}

async function getPublishedFirebaseArticleBySlug(slug: string) {
  try {
    const response = await fetch(`${FIRESTORE_REST_BASE}:runQuery?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "published_research" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                {
                  fieldFilter: {
                    field: { fieldPath: "status" },
                    op: "EQUAL",
                    value: { stringValue: "published" },
                  },
                },
                {
                  fieldFilter: {
                    field: { fieldPath: "slug" },
                    op: "EQUAL",
                    value: { stringValue: slug },
                  },
                },
              ],
            },
          },
          limit: 1,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Firestore REST returned ${response.status}`);
    }

    const rows = (await response.json()) as FirestoreRunQueryRow[];
    const match = rows.find((row) => row.document)?.document;
    return match ? normalizeFirestoreRestDocument(match) : null;
  } catch (error) {
    console.error(`Failed to load Firebase article for slug "${slug}":`, error);
    return null;
  }
}

async function getLensArchiveArticles() {
  try {
    const response = await fetch(LENS_FEED_URL, {
      headers: { accept: "application/rss+xml, application/xml, text/xml" },
      next: { revalidate: 900 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) {
      throw new Error(`Lens feed returned ${response.status}`);
    }

    const xml = await response.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    return items.map(normalizeFeedItem).filter((item): item is SiteArticle => Boolean(item));
  } catch (error) {
    console.error("Failed to load Lens archive feed:", error);
    return [];
  }
}

function getStaticLensArchiveArticles() {
  return (lensArchiveData.articles as LensArchiveEntry[]).map(normalizeStaticArchiveEntry);
}

const ENGINE_API_BASE = process.env.NEXT_PUBLIC_ENGINE_API_BASE || "https://engine.greybrain.in";

interface CloudflareManifestRing {
  label: string;
  score: number | string;
  description?: string;
  highlights?: string[];
}

interface CloudflareManifestEntry {
  slug: string;
  title: string;
  blogMarkdown: string;
  canonicalUrl?: string | null;
  category?: string | null;
  contentType?: string | null;
  dek?: string | null;
  heroImageUrl?: string | null;
  posterImageUrl?: string | null;
  thumbnailImageUrl?: string | null;
  thumbnailEyebrow?: string | null;
  overallScore?: number | string | null;
  publishedAt?: string | null;
  reviewStage?: string | null;
  scoreRings?: CloudflareManifestRing[];
  morphokinetics?: {
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
}

function normalizeCloudflareEntry(entry: CloudflareManifestEntry): SiteArticle {
  const title = entry.title || "Untitled Review";
  const tags = Array.isArray(entry.tags)
    ? entry.tags.map(String)
    : Array.isArray(entry.keywords)
      ? entry.keywords.map(String)
      : [];
  const kind = inferKind(title, tags, entry.contentType || "review");
  const publishedDate = entry.publishedAt ? new Date(entry.publishedAt) : new Date(0);
  const content = entry.blogMarkdown || `# ${title}`;

  let storyScore: string | undefined;
  let conceptScore: string | undefined;
  let executionScore: string | undefined;
  if (Array.isArray(entry.scoreRings)) {
    for (const ring of entry.scoreRings) {
      const label = (ring.label || "").toLowerCase();
      const scoreStr = String(ring.score ?? "");
      if (label.includes("story") || label.includes("script")) storyScore = scoreStr;
      else if (label.includes("concept")) conceptScore = scoreStr;
      else if (label.includes("execution") || label.includes("craft") || label.includes("performance"))
        executionScore = scoreStr;
    }
  }

  const overallScore =
    entry.overallScore !== null && entry.overallScore !== undefined
      ? String(entry.overallScore)
      : undefined;
  const excerpt = entry.dek || entry.summary || makeExcerpt(content);
  const coverImageUrl =
    entry.heroImageUrl || entry.posterImageUrl || entry.thumbnailImageUrl || FALLBACK_IMAGES[kind];

  let morphokineticsTeaser: string | undefined;
  if (entry.morphokinetics?.flowSummary) {
    morphokineticsTeaser = entry.morphokinetics.flowSummary;
  } else if (entry.morphokinetics?.tempoShiftLabel) {
    morphokineticsTeaser = `Tempo Shift: ${entry.morphokinetics.tempoShiftLabel}`;
  }

  return {
    id: `cf-${entry.slug}`,
    title,
    slug: entry.slug,
    kind,
    categoryLabel: entry.category || categoryLabel(kind),
    content,
    editorial: content,
    excerpt,
    coverImageUrl,
    createdBy: "Greybrainer AI",
    publishedAt:
      Number.isNaN(publishedDate.valueOf()) || publishedDate.valueOf() === 0
        ? null
        : publishedDate.toISOString(),
    publishedAtMs: Number.isNaN(publishedDate.valueOf()) ? 0 : publishedDate.valueOf(),
    source: "cloudflare",
    sourceUrl: entry.canonicalUrl || entry.websiteUrl || undefined,
    status: "published",
    tags,
    type: "sovereign_review",
    seoTitle: entry.title,
    seoDescription: entry.summary || entry.dek || undefined,
    searchHeadline: entry.summaryHook || undefined,
    verdict: entry.verdict || undefined,
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

async function getCloudflarePublishedArticles(maxCount = 50): Promise<SiteArticle[]> {
  try {
    const url = `${ENGINE_API_BASE}/api/public/lens/manifest?limit=${maxCount}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) {
      console.warn(`Engine public manifest returned ${response.status}`);
      return [];
    }

    const data = (await response.json()) as { entries?: CloudflareManifestEntry[] };
    const entries = Array.isArray(data.entries) ? data.entries : [];
    return entries.map(normalizeCloudflareEntry);
  } catch (error) {
    console.error("Failed to load Cloudflare published articles:", error);
    return [];
  }
}

async function getCloudflareArticleBySlug(slug: string): Promise<SiteArticle | null> {
  try {
    const url = `${ENGINE_API_BASE}/api/public/lens/manifest?slug=${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { entries?: CloudflareManifestEntry[] };
    const entry = data.entries?.[0];
    return entry ? normalizeCloudflareEntry(entry) : null;
  } catch (error) {
    console.error(`Failed to load Cloudflare article for slug "${slug}":`, error);
    return null;
  }
}

const GENERIC_SEATS_IMAGE = "photo-1489599849927-2ee91cede3ba";

function isDummyTestArticle(article: SiteArticle): boolean {
  const title = (article.title || "").toLowerCase();
  const slug = (article.slug || "").toLowerCase();
  const content = (article.content || "").trim();

  // Explicit test artifacts
  if (
    title.includes("direct browser client test") ||
    title === "direct test" ||
    title.includes("dummy test") ||
    slug.includes("direct-browser-client-test")
  ) {
    return true;
  }

  // Thin mock review stubs (< 2000 chars for reviews, or mock stubs)
  if (
    article.kind === "review" &&
    content.length < 2000 &&
    (slug === "war-2-2026" ||
      slug === "toxic-a-fairy-tale-for-grown-ups-2026" ||
      slug === "toxic-2026" ||
      content.includes("Craft-to-Fee Ratio (3.1x)") ||
      content.includes("Craft-to-Fee Ratio (3.4x)"))
  ) {
    return true;
  }

  return false;
}

function enhanceContextualCover(article: SiteArticle): SiteArticle {
  const titleLower = (article.title || "").toLowerCase();
  let cover = article.coverImageUrl;

  if (!cover || cover.includes(GENERIC_SEATS_IMAGE)) {
    if (titleLower.includes("war 2")) {
      cover = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("toxic")) {
      cover = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("kantara")) {
      cover = "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("dune")) {
      cover = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("kgf")) {
      cover = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("rrr")) {
      cover = "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("stree")) {
      cover = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("pushpa")) {
      cover = "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80";
    } else if (titleLower.includes("wire") || titleLower.includes("brief")) {
      cover = "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80";
    } else {
      // Default to high-contrast cinematic atmosphere rather than empty red chairs
      cover = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80";
    }
  }

  return {
    ...article,
    coverImageUrl: cover,
  };
}

export async function getAllArticles(maxCount = DEFAULT_ARCHIVE_LIMIT): Promise<SiteArticle[]> {
  const staticLensArticles = getStaticLensArchiveArticles();
  const [cloudflareArticles, firebaseArticles, lensArticles] = await Promise.all([
    withTimeout(getCloudflarePublishedArticles(maxCount), [], "Cloudflare published articles"),
    withTimeout(getPublishedFirebaseArticles(maxCount), [], "Firebase published articles"),
    withTimeout(getLensArchiveArticles(), [], "Lens archive feed"),
  ]);

  const bySlug = new Map<string, SiteArticle>();
  for (const article of [...cloudflareArticles, ...firebaseArticles, ...staticLensArticles, ...lensArticles]) {
    if (!article.slug) continue;
    if (!bySlug.has(article.slug)) {
      bySlug.set(article.slug, article);
    }
  }

  return [...bySlug.values()]
    .filter((a) => !isDummyTestArticle(a))
    .map(enhanceContextualCover)
    .sort((a, b) => b.publishedAtMs - a.publishedAtMs)
    .slice(0, maxCount);
}

export async function getArticleBySlug(slug: string): Promise<SiteArticle | null> {
  const cloudflareArticle = await getCloudflareArticleBySlug(slug);
  if (cloudflareArticle) return enhanceContextualCover(cloudflareArticle);

  const firebaseArticle = await getPublishedFirebaseArticleBySlug(slug);
  if (firebaseArticle) return enhanceContextualCover(firebaseArticle);

  const articles = await getAllArticles(DEFAULT_ARCHIVE_LIMIT);
  return articles.find((article) => article.slug === slug) ?? null;
}

export function isArticleKind(value: string | null): value is ArticleKind {
  return value === "review" || value === "brief" || value === "insight" || value === "comparison";
}

export function isLegacyReview(article: SiteArticle): boolean {
  if (article.source === "cloudflare") {
    return false;
  }
  // Only consider static un-scored legacy entries from the old Medium lens archive as legacy
  if (article.source === "lens-archive" && !article.storyScore && !article.morphokineticsTeaser) {
    return true;
  }
  return false;
}

export async function getModernArticles(maxCount = DEFAULT_ARCHIVE_LIMIT): Promise<SiteArticle[]> {
  const all = await getAllArticles(maxCount);
  return all.filter((a) => !isLegacyReview(a));
}

export async function getLegacyArchiveArticles(maxCount = DEFAULT_ARCHIVE_LIMIT): Promise<SiteArticle[]> {
  const all = await getAllArticles(maxCount);
  return all.filter((a) => isLegacyReview(a));
}
