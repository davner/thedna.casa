import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages, phone } from "./pages";

// Fade-ups hold off-screen sections at zero opacity, where axe cannot judge their contrast.
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const path of pages) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations).toEqual([]);
  });

  test.describe("on a phone", () => {
    test.use(phone);

    test(`${path} has no axe violations with the menu open`, async ({ page }) => {
      await page.goto(path);
      const nav = page.getByRole("navigation", { name: "Site" });
      await nav.getByRole("button", { name: "Menu" }).click();
      await expect(nav.getByRole("link", { name: "Halloween", exact: true })).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations).toEqual([]);
    });
  });
}
