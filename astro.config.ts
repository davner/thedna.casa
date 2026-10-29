import { defineConfig } from "astro/config";
import favicons from "./integrations/favicons.ts";

export default defineConfig({
  site: "https://thedna.casa",
  devToolbar: { enabled: false },
  // The page's CSS is a few KB, so inlining it costs less than a render-blocking request.
  build: { inlineStylesheets: "always" },
  integrations: [favicons(new URL("./src/assets/favicon.svg", import.meta.url))],
});
