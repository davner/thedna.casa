import { defineConfig } from "astro/config";
import favicons from "astro-favicons";

export default defineConfig({
  site: "https://thedna.casa",
  devToolbar: { enabled: false },
  integrations: [
    favicons({
      input: "src/assets/favicon.svg",
      // Base.astro writes the links; the integration's own tags would add web-app meta the site does not want.
      output: { html: false },
      withCapo: false,
      background: "#F6E7DA",
      icons: {
        favicons: ["favicon.svg", "favicon-32x32.png"],
        appleIcon: [{ name: "apple-touch-icon.png", offset: 8 }],
        android: false,
        appleStartup: false,
        windows: false,
        yandex: false,
      },
    }),
  ],
});
