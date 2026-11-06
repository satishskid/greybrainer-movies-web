declare module "cloudflare:workers" {
  export const env: { BACKEND: { fetch(input: string, init?: RequestInit): Promise<Response> } };
}
