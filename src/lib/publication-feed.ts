import { SITE_URL } from "@/lib/site";

/** The storefront's only data path: public, read-only backend routes over the BACKEND service binding. */
export async function publicApi(path: string): Promise<Response> {
  if (!/^\/api\/public\/lens\/(manifest|article|archive)\?/.test(path)) throw new Error(`Refusing non-public backend path: ${path}`);
  const { env } = await import("cloudflare:workers");
  return env.BACKEND.fetch(`https://backend${path}`, { headers: { accept: "application/json" } });
}

/** Only publications whose canonical URL is this site's /reviews/ page appear here. */
export function isPublicWebsiteEntry(entry: { canonicalUrl?: string | null }, siteUrl = SITE_URL): boolean {
  if (!entry.canonicalUrl) return false;
  try {
    const url = new URL(entry.canonicalUrl);
    return url.origin === new URL(siteUrl).origin && url.pathname.startsWith("/reviews/");
  } catch {
    return false;
  }
}
