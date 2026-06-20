export const SITE_NAME = "Greybrainer Movies";
export const SITE_BRAND = "Greybrainer";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://movies.greybrain.in"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Comprehensive cinematic research, deep reviews, and morphokinetic breakdowns powered by the Greybrainer methodology.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
