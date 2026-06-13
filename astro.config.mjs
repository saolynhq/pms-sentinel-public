import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Static site (D-5). Cards are content, rebuilt nightly off the R2 JSON manifest.
export default defineConfig({
  site: "https://pms-sentinel.com",
  integrations: [tailwind()],
});
