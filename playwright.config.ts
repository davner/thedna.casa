import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4380",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    // Under a coding agent, astro preview detaches into the background unless told this is a one-off server.
    // CI and `pnpm check` build dist/ before this runs, so only a bare local run builds it here.
    command: `${process.env.CI ? "" : "pnpm build && "}pnpm preview --port 4380 --ignore-lock`,
    url: "http://localhost:4380",
    reuseExistingServer: !process.env.CI,
  },
});
