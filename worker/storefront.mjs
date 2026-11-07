import app from 'vinext/server/fetch-handler';
import { storefrontOriginAllowed, storefrontResponse } from '../src/lib/storefront-origin';

export default {
  async fetch(request, env, context) {
    if (!storefrontOriginAllowed(request, env.PUBLIC_RELAY_TOKEN)) {
      return new Response('Not found', { status: 404, headers: { 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' } });
    }
    return storefrontResponse(request, await app.fetch(request, env, context));
  },
};
