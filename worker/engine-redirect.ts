export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    if (url.hostname !== 'engine.greybrain.in') return new Response('Not found', { status: 404 });
    const trimmed = url.pathname.replace(/^\/engine(?=\/|$)/, '');
    const path = !trimmed || trimmed === '/' ? '/studio/inbox' : trimmed;
    return new Response(null, { status: 302, headers: {
      location: `https://greybrainer-production.satish-9f4.workers.dev${path}${url.search}${url.hash}`,
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    } });
  },
};
