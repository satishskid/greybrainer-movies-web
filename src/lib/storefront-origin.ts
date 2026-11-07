const canonicalOrigin = 'https://movies.greybrain.in';
const relayOrigin = 'https://greybrainer-storefront.satish-9f4.workers.dev';

export function storefrontOriginAllowed(request: Request, token?: string) {
  const origin = new URL(request.url).origin;
  return origin === canonicalOrigin || (origin === relayOrigin && Boolean(token) && request.headers.get('x-greybrainer-public-relay') === token);
}

export function storefrontResponse(request: Request, response: Response) {
  const result = new Response(response.body, response);
  if (new URL(request.url).origin !== canonicalOrigin) result.headers.set('x-robots-tag', 'noindex, nofollow');
  return result;
}
