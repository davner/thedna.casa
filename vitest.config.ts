import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Built-site tests read dist/, so the site is built once for the whole run.
    globalSetup: ["./test/build-site.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    // Vitest stubs CSS as empty text, even ?raw imports; the hero title model reads its scale from these two.
    css: { include: [/styles\/global\.css/, /tailwindcss\/theme\.css/] },
  },
});
