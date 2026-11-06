export const SITE_NAME = "Greybrainer Movies";
export const SITE_BRAND = "Greybrainer";
export const SITE_AUTHOR = "GreyBrain Lens";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://movies.greybrain.in"
).replace(/\/$/, "");

/** Fail closed: anything other than the production domain (previews, misconfiguration) is never indexed. */
export const NOINDEX = SITE_URL !== "https://movies.greybrain.in";

export const SITE_DESCRIPTION =
  "Film analysis for the people who make films: what works, what does not, why, and what could change. AI-assisted research, checked against sources and approved by an editor.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function publicAuthorName(value?: string | null) {
  const author = (value || "").trim();
  if (!author || author.includes("@")) return SITE_AUTHOR;
  return author;
}

export function toPlainText(value: string, maxLength?: number) {
  const text = value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "").trim()}...`;
}
