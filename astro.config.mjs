import { defineConfig } from "astro/config";
import favicons from "./integrations/favicons.mjs";

export default defineConfig({
  site: "https://thedna.casa",
  devToolbar: { enabled: false },
  integrations: [favicons(new URL("./src/assets/favicon.svg", import.meta.url))],
});
