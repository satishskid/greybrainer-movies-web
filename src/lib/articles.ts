import { collection, getDocs, limit as firestoreLimit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ArticleKind, SiteArticle } from "@/lib/articleTypes";

const LENS_FEED_URL = process.env.LENS_ARCHIVE_FEED_URL || "https://medium.com/feed/@GreyBrainer";
const DEFAULT_ARCHIVE_LIMIT = 80;

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

function normalizeFirebaseDoc(id: string, data: Record<string, unknown>): SiteArticle {
  const title = String(data.title ?? "Untitled");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const type = String(data.type ?? "research_export");
  const kind = inferKind(title, tags, type);
  const publishedDate = timestampToDate(data.publishedAt) ?? timestampToDate(data.createdAt) ?? new Date(0);
  const content = String(data.content ?? "");
  const editorial = typeof data.editorial === "string" ? data.editorial : null;

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
    createdBy: String(data.createdBy ?? "Greybrainer AI"),
    publishedAt: publishedDate.valueOf() > 0 ? publishedDate.toISOString() : null,
    publishedAtMs: publishedDate.valueOf(),
    source: "firebase",
    sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
    status: String(data.status ?? "published"),
    tags,
    type,
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
  };
}

async function getPublishedFirebaseArticles(maxCount: number) {
  try {
    const publishedQuery = query(
      collection(db, "published_research"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      firestoreLimit(maxCount),
    );
    const snapshot = await getDocs(publishedQuery);
    return snapshot.docs.map((doc) => normalizeFirebaseDoc(doc.id, doc.data()));
  } catch (error) {
    console.error("Failed to load Firebase published articles:", error);
    return [];
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

export async function getAllArticles(maxCount = DEFAULT_ARCHIVE_LIMIT): Promise<SiteArticle[]> {
  const [firebaseArticles, lensArticles] = await Promise.all([
    withTimeout(getPublishedFirebaseArticles(maxCount), [], "Firebase published articles"),
    withTimeout(getLensArchiveArticles(), [], "Lens archive feed"),
  ]);

  const bySlug = new Map<string, SiteArticle>();
  for (const article of [...firebaseArticles, ...lensArticles]) {
    if (!article.slug) continue;
    if (!bySlug.has(article.slug)) {
      bySlug.set(article.slug, article);
    }
  }

  return [...bySlug.values()]
    .sort((a, b) => b.publishedAtMs - a.publishedAtMs)
    .slice(0, maxCount);
}

export async function getArticleBySlug(slug: string): Promise<SiteArticle | null> {
  const articles = await getAllArticles(DEFAULT_ARCHIVE_LIMIT);
  return articles.find((article) => article.slug === slug) ?? null;
}

export function isArticleKind(value: string | null): value is ArticleKind {
  return value === "review" || value === "brief" || value === "insight" || value === "comparison";
}
