import { fileURLToPath } from "node:url";
import { build } from "astro";

// The photo fixture proves the image pipeline strips metadata, since the real site has no photos yet.
const sites = ["..", "./fixtures/photo-site"];

export default async function setup() {
  // In turn, because concurrent Astro builds in one process share Vite and module state.
  for (const site of sites) await build({ root: fileURLToPath(new URL(site, import.meta.url)), logLevel: "warn" });
}
