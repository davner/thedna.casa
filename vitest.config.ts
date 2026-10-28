import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Built-site tests read dist/, so the site is built once for the whole run.
    globalSetup: ["./test/build-site.ts"],
  },
});
