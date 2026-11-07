const publicOrigin = 'https://movies.greybrain.in';
const upstreamOrigin = 'https://greybrainer-storefront.satish-9f4.workers.dev';

export async function publicProxy(request: Request, env: { PUBLIC_RELAY_TOKEN?: string }, fetchUpstream: typeof fetch = fetch) {
  const url = new URL(request.url);
  if (url.hostname === 'movies.greybrain.in' && url.protocol === 'http:') return new Response(null, { status: 308, headers: { location: `${publicOrigin}${url.pathname}${url.search}` } });
  if (url.origin !== publicOrigin) return new Response('Not found', { status: 404 });
  const enquiry = url.pathname === '/api/studio-diagnostic';
  const image = /^\/api\/assets\/[^/]+$/.test(url.pathname);
  if ((url.pathname.startsWith('/api/') && !enquiry && !image) || url.pathname.startsWith('/studio') || url.pathname.startsWith('/hub')) {
    return new Response('Not found', { status: 404 });
  }
  if (!['GET', 'HEAD'].includes(request.method) && !(request.method === 'POST' && enquiry)) return new Response('Method not allowed', { status: 405 });
  if (request.method === 'POST' && request.headers.get('origin') !== publicOrigin) return new Response('Origin not allowed', { status: 403 });
  if (!env.PUBLIC_RELAY_TOKEN) return new Response('Website temporarily unavailable', { status: 503 });
  const headers = new Headers(request.headers);
  for (const name of ['host', 'cookie', 'authorization', 'cf-access-jwt-assertion', 'cf-access-client-id', 'cf-access-client-secret']) headers.delete(name);
  headers.set('x-greybrainer-public-relay', env.PUBLIC_RELAY_TOKEN);
  let body: ArrayBuffer | undefined;
  if (request.method === 'POST') {
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (reader) {
      const item = await reader.read();
      if (item.done) break;
      size += item.value.byteLength;
      if (size > 32768) { await reader.cancel(); return new Response('Enquiry too large', { status: 413 }); }
      chunks.push(item.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    body = bytes.buffer;
  }
  try {
    const upstream = await fetchUpstream(`${upstreamOrigin}${url.pathname}${url.search}`, { method: request.method, headers, body, redirect: 'manual' });
    const response = new Response(upstream.body, upstream);
    response.headers.delete('set-cookie');
    response.headers.delete('x-robots-tag');
    response.headers.set('x-greybrainer-stack', 'cloudflare-production');
    const location = response.headers.get('location');
    if (location) {
      const destination = new URL(location, upstreamOrigin);
      if (destination.origin === upstreamOrigin) response.headers.set('location', `${publicOrigin}${destination.pathname}${destination.search}${destination.hash}`);
    }
    return response;
  } catch {
    return new Response('Website temporarily unavailable', { status: 503, headers: { 'cache-control': 'no-store' } });
  }
}

export default { fetch: (request: Request, env: { PUBLIC_RELAY_TOKEN?: string }) => publicProxy(request, env) };
