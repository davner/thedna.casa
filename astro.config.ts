import { defineConfig, sharpImageService } from "astro/config";
import favicons from "./integrations/favicons.ts";

export default defineConfig({
  site: "https://thedna.casa",
  devToolbar: { enabled: false },
  // The page's CSS is a few KB, so inlining it costs less than a render-blocking request.
  build: { inlineStylesheets: "always" },
  // Night party photos are noisy; quality 70 keeps a recap with four or five of them inside the image budget.
  image: { service: sharpImageService({ webp: { quality: 70 } }) },
  integrations: [favicons(new URL("./src/assets/favicon.svg", import.meta.url))],
});
