import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist/", "**/.astro/", "test-results/", "playwright-report/", "blob-report/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
]);
