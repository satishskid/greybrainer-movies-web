import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const MEDIUM_USER_ID = "feb55321d5bf";
const MEDIUM_USERNAME = "GreyBrainer";
const READER_PREFIX = "https://r.jina.ai/http://r.jina.ai/http://";
const PROFILE_STREAM_URL = `https://medium.com/_/api/users/${MEDIUM_USER_ID}/profile/stream`;
const OUTPUT_PATH = path.join(process.cwd(), "src/data/lensArchive.json");
const CACHE_DIR = process.env.MEDIUM_ARCHIVE_CACHE_DIR || path.join(process.cwd(), ".medium-archive-cache");
const PROFILE_LIMIT = 100;
const REQUEST_DELAY_MS = 3000;
const MAX_RETRIES = 6;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readerUrl(targetUrl) {
  return `${READER_PREFIX}${targetUrl}`;
}

function cachePathFor(targetUrl) {
  const cacheKey = Buffer.from(targetUrl).toString("base64url");
  return path.join(CACHE_DIR, `${cacheKey}.json`);
}

function parseMediumJson(rawText, url) {
  const markerIndex = rawText.indexOf("])}while");
  const jsonStart = rawText.indexOf("{", markerIndex >= 0 ? markerIndex : 0);
  if (jsonStart < 0) {
    throw new Error(`No Medium JSON payload found for ${url}`);
  }

  return JSON.parse(rawText.slice(jsonStart));
}

async function fetchMediumJson(targetUrl) {
  const cachePath = cachePathFor(targetUrl);
  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    // Cache miss; fetch below.
  }

  const url = readerUrl(targetUrl);
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "text/plain, application/json",
          "user-agent": "GreybrainerArchiveImporter/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      const data = parseMediumJson(text, targetUrl);
      await mkdir(CACHE_DIR, { recursive: true });
      await writeFile(cachePath, `${JSON.stringify(data)}\n`);
      return data;
    } catch (error) {
      lastError = error;
      const wait = error.message.includes("429") ? 15000 * attempt : REQUEST_DELAY_MS * attempt * 2;
      console.warn(`Retry ${attempt}/${MAX_RETRIES} for ${targetUrl}: ${error.message}`);
      await sleep(wait);
    }
  }

  throw lastError;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 96);
}

function cleanText(input = "") {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeMarkdownText(input = "") {
  return cleanText(input).replace(/([\\`*_{}[\]()#+.!|-])/g, "\\$1");
}

function applyMarkups(text = "", markups = []) {
  if (!text || markups.length === 0) return cleanText(text);

  const sorted = [...markups]
    .filter((markup) => Number.isInteger(markup.start) && Number.isInteger(markup.end))
    .sort((a, b) => b.start - a.start);

  let output = text;
  for (const markup of sorted) {
    const before = output.slice(0, markup.start);
    const selected = output.slice(markup.start, markup.end);
    const after = output.slice(markup.end);

    if (!selected) continue;

    if (markup.type === 3 && markup.href) {
      output = `${before}[${selected}](${markup.href})${after}`;
      continue;
    }

    if (markup.type === 1) {
      output = `${before}**${selected}**${after}`;
      continue;
    }

    if (markup.type === 2) {
      output = `${before}*${selected}*${after}`;
    }
  }

  return cleanText(output);
}

function imageUrlFromId(imageId) {
  if (!imageId) return "";
  return `https://miro.medium.com/v2/resize:fit:1400/${imageId}`;
}

function paragraphToMarkdown(paragraph, index) {
  const text = applyMarkups(paragraph.text ?? "", paragraph.markups ?? []);

  switch (paragraph.type) {
    case 3:
      return index === 0 ? `# ${text}` : `## ${text}`;
    case 4: {
      const imageUrl = imageUrlFromId(paragraph.metadata?.id);
      if (!imageUrl) return "";
      const alt = escapeMarkdownText(paragraph.metadata?.alt ?? "");
      return `![${alt}](${imageUrl})`;
    }
    case 6:
      return text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    case 8:
      return text ? `- ${text}` : "";
    case 9:
      return text ? `1. ${text}` : "";
    case 10:
      return text ? `\`\`\`\n${paragraph.text}\n\`\`\`` : "";
    case 11:
      return text ? `### ${text}` : "";
    case 13:
      return text ? `## ${text}` : "";
    default:
      return text;
  }
}

function paragraphsToMarkdown(paragraphs = []) {
  return paragraphs
    .map(paragraphToMarkdown)
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function plainTextFromMarkdown(markdown) {
  return markdown
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(markdown, fallback) {
  const text = plainTextFromMarkdown(markdown) || cleanText(fallback);
  return text.length > 190 ? `${text.slice(0, 190).trim()}...` : text;
}

function inferKind(title, tags = []) {
  const tagText = tags.join(" ").toLowerCase();

  if (
    /\b(vs\.?|versus|tug-of-war|collision|clash|showdown|divide|paradox|trading|trade)\b/i.test(title)
  ) {
    return "comparison";
  }

  if (
    /^greybrainer\s+(analysis|report|summary report)/i.test(title) ||
    tagText.includes("review") ||
    tagText.includes("movie review")
  ) {
    return "review";
  }

  if (
    /\b(brief|scoop|pulse|weekend|mid-week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|box office|watchlist|what .*watching|reality check)\b/i.test(
      title,
    )
  ) {
    return "brief";
  }

  return "insight";
}

async function getProfilePosts() {
  let next = { limit: PROFILE_LIMIT };
  const posts = new Map();

  while (next) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    const data = await fetchMediumJson(`${PROFILE_STREAM_URL}?${params.toString()}`);
    const refs = data.payload?.references?.Post ?? {};
    for (const [id, post] of Object.entries(refs)) {
      posts.set(id, post);
    }

    console.log(`Profile page ${next.page ?? 1}: ${Object.keys(refs).length} posts`);
    next = data.payload?.paging?.next ?? null;
    await sleep(REQUEST_DELAY_MS);
  }

  return [...posts.values()].sort((a, b) => (b.firstPublishedAt ?? 0) - (a.firstPublishedAt ?? 0));
}

async function getPostContent(post) {
  const data = await fetchMediumJson(`https://medium.com/_/api/posts/${post.id}`);
  const fullPost = data.payload?.value ?? post;
  const paragraphs = fullPost.content?.bodyModel?.paragraphs ?? [];
  const markdown = paragraphsToMarkdown(paragraphs);
  return { fullPost, markdown };
}

async function main() {
  console.log(`Importing Medium archive for @${MEDIUM_USERNAME}...`);
  const posts = await getProfilePosts();
  const archive = [];

  for (const [index, post] of posts.entries()) {
    const { fullPost, markdown } = await getPostContent(post);
    const title = fullPost.title || post.title || "Untitled";
    const uniqueSlug = fullPost.uniqueSlug || `${fullPost.slug || slugify(title)}-${fullPost.id}`;
    const tags = (fullPost.virtuals?.tags ?? post.virtuals?.tags ?? []).map((tag) => tag.name || tag.slug).filter(Boolean);
    const kind = inferKind(title, tags);
    const publishedAtMs = fullPost.firstPublishedAt || post.firstPublishedAt || fullPost.createdAt || post.createdAt || 0;
    const coverImageId = fullPost.virtuals?.previewImage?.imageId || post.virtuals?.previewImage?.imageId || "";
    const content = markdown || `# ${title}\n\n${cleanText(fullPost.content?.subtitle || post.content?.subtitle || "")}`;

    archive.push({
      id: `medium-${fullPost.id}`,
      mediumId: fullPost.id,
      title,
      slug: slugify(title),
      uniqueSlug,
      kind,
      content,
      excerpt: makeExcerpt(content, fullPost.content?.subtitle || post.content?.subtitle),
      coverImageUrl: imageUrlFromId(coverImageId),
      createdBy: "GreyBrain Lens",
      publishedAt: publishedAtMs ? new Date(publishedAtMs).toISOString() : null,
      publishedAtMs,
      sourceUrl: `https://medium.com/@${MEDIUM_USERNAME}/${uniqueSlug}`,
      tags,
      readingTime: fullPost.virtuals?.readingTime ?? post.virtuals?.readingTime ?? null,
      wordCount: fullPost.virtuals?.wordCount ?? post.virtuals?.wordCount ?? null,
    });

    console.log(`${index + 1}/${posts.length}: ${title}`);
    await sleep(REQUEST_DELAY_MS);
  }

  const counts = archive.reduce(
    (acc, article) => {
      acc[article.kind] += 1;
      return acc;
    },
    { review: 0, brief: 0, insight: 0, comparison: 0 },
  );

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(
      {
        importedAt: new Date().toISOString(),
        source: `https://medium.com/@${MEDIUM_USERNAME}`,
        total: archive.length,
        counts,
        articles: archive,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Imported ${archive.length} Medium posts to ${OUTPUT_PATH}`);
  console.log(counts);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
