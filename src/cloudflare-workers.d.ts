declare module "cloudflare:workers" {
  export const env: {
    BACKEND: { fetch(input: string, init?: RequestInit): Promise<Response> };
    ENQUIRIES?: { fetch(input: string, init?: RequestInit): Promise<Response> };
    STUDIO_ENQUIRY_TOKEN?: string;
  };
}
