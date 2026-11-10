export async function publicImage(key: string, fetchAsset?: (path: string) => Promise<Response>): Promise<Response> {
  const uploaded = /^draft-assets\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp|gif|avif)$/i.test(key);
  const overnight = /^assets\/overnight\/[a-zA-Z0-9_-]+\/cover\.jpg$/.test(key);
  if (!uploaded && !overnight) {
    return new Response('Image not found', { status: 404 });
  }
  const path = `/api/assets/${encodeURIComponent(key)}`;
  const response = fetchAsset ? await fetchAsset(path) : await (async () => {
    const { env } = await import('cloudflare:workers');
    return env.BACKEND.fetch(`https://backend${path}`, { headers: { accept: 'image/*' } });
  })();
  if (!response.ok) return new Response('Image not found', { status: 404 });
  const mime = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (!mime || !/^image\/(png|jpeg|webp|gif|avif)$/.test(mime)) return new Response('Image unavailable', { status: 415 });
  return new Response(response.body, { headers: {
    'content-type': mime,
    'cache-control': 'public, max-age=86400',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; sandbox",
  } });
}
