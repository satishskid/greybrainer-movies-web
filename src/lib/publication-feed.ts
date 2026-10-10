export const PRODUCTION_ENGINE_API = "https://greybrainer-omnichannel-api.satish-9f4.workers.dev";

export function isPublicWebsiteEntry(entry: { canonicalUrl?: string | null }): boolean {
  if (!entry.canonicalUrl) return false;
  try {
    const url = new URL(entry.canonicalUrl);
    return url.origin === "https://movies.greybrain.in" && url.pathname.startsWith("/reviews/");
  } catch {
    return false;
  }
}
