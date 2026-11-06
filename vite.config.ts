import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      configPath: process.env.STOREFRONT_PRODUCTION === "true" ? "wrangler.production.json" : undefined,
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
      // Local design review only: STOREFRONT_FIXTURE=<wrangler config of a stand-in "greybrainer-author-preview">.
      auxiliaryWorkers: process.env.STOREFRONT_FIXTURE ? [{ configPath: process.env.STOREFRONT_FIXTURE }] : undefined,
    }),
  ],
});
