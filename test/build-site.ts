import { fileURLToPath } from "node:url";
import { build } from "astro";

export default async function setup() {
  await build({ root: fileURLToPath(new URL("..", import.meta.url)), logLevel: "warn" });
}
