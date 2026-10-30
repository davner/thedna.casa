import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import { pages, phone } from "./pages";

const consoleErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
};

for (const path of pages) {
  test.describe(path, () => {
    test("loads without console errors", async ({ page }) => {
      const errors = consoleErrors(page);
      await page.goto(path, { waitUntil: "load" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(errors).toEqual([]);
    });

    test.describe("on a phone", () => {
      test.use(phone);

      test("never scrolls sideways", async ({ page }) => {
        await page.goto(path);
        const { scrollWidth, clientWidth } = await page.evaluate(() => {
          const { scrollWidth, clientWidth } = document.documentElement;
          return { scrollWidth, clientWidth };
        });
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
        await page.mouse.wheel(500, 0);
        expect(await page.evaluate(() => window.scrollX)).toBe(0);
      });

      test("menu opens from its button and Escape hands focus back", async ({ page, browserName }) => {
        await page.goto(path);
        const nav = page.getByRole("navigation", { name: "Site" });
        const button = nav.getByRole("button", { name: "Menu" });
        const halloween = nav.getByRole("link", { name: "Halloween", exact: true });
        await expect(halloween).toBeHidden();

        await button.focus();
        await page.keyboard.press("Enter");
        await expect(halloween).toBeVisible();
        // Safari's Tab skips links unless Option is held.
        await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
        await expect(nav.getByRole("link").first()).toBeFocused();

        await page.keyboard.press("Escape");
        await expect(halloween).toBeHidden();
        await expect(button).toBeFocused();
      });

      // A panel that ends after its links leaves a straight dark edge across the stamp below it.
      test("menu panel fills the screen from under the bar to its foot", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(path);
        const nav = page.getByRole("navigation", { name: "Site" });
        await nav.getByRole("button", { name: "Menu" }).click();
        const edges = await page.evaluate(() => {
          const panel = document.getElementById("site-menu")!.getBoundingClientRect();
          return {
            top: panel.top,
            bottom: panel.bottom,
            navBottom: document.querySelector("nav")!.getBoundingClientRect().bottom,
            screenBottom: window.innerHeight,
          };
        });
        expect(edges.top).toBe(edges.navBottom);
        expect(edges.bottom).toBe(edges.screenBottom);
      });

      test("menu opens on a tap", async ({ page }) => {
        await page.goto(path);
        const nav = page.getByRole("navigation", { name: "Site" });
        await nav.getByRole("button", { name: "Menu" }).click();
        await expect(nav.getByRole("link", { name: "Halloween", exact: true })).toBeVisible();
      });
    });

    test("reduced motion leaves nothing animating", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    });
  });
}

test("the home page animates when motion is allowed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
});

// A minifier once folded the timeline into the animation shorthand, which browsers drop, leaving fade-ups dead.
test.describe("scroll fade-ups", () => {
  test.use(phone);

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/halloween/");
    test.skip(
      !(await page.evaluate(() => CSS.supports("animation-timeline: view()"))),
      "this engine has no scroll-driven animation",
    );
  });

  for (const [path, heading] of [
    ["/halloween/", "The parties"],
    ["/halloween/2026/", "Our costumes"],
  ]) {
    test(`${path} ties "${heading}" to its scroll position`, async ({ page }) => {
      await page.goto(path);
      const applied = await page.getByRole("heading", { name: heading }).evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          name: s.animationName,
          timeline: s.animationTimeline,
          viewTimeline: el.getAnimations().some((a) => a.timeline?.constructor.name === "ViewTimeline"),
        };
      });
      expect(applied).toEqual({ name: "rise", timeline: expect.stringContaining("view("), viewTimeline: true });
    });
  }

  test("a section below the fold is hidden until it scrolls in", async ({ page }) => {
    await page.goto("/halloween/2026/");
    const target = page.getByRole("heading", { name: "Our costumes" });
    const opacity = () => target.evaluate((el) => Number(getComputedStyle(el).opacity));
    await expect.poll(opacity).toBeLessThan(1);
    await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect.poll(opacity).toBe(1);
  });
});

test.describe("the trophy", () => {
  test("draws in 3D and turns to the plate side with the arrow keys, or lists the winners without WebGL", async ({
    page,
  }) => {
    const errors = consoleErrors(page);
    await page.goto("/halloween/");
    const webgl = await page.evaluate(() => Boolean(document.createElement("canvas").getContext("webgl2")));
    const section = page.locator("section.trophy");
    if (!webgl) {
      await expect(section.locator(".winners li").first()).toBeVisible();
      return;
    }
    const trophy = page.getByRole("slider", { name: "The trophy" });
    await expect(trophy).toBeVisible();
    await expect(trophy).toHaveAttribute("aria-valuetext", /^Front/);
    // A blank stage shows one flat cream; a drawn trophy has many colors.
    await page.waitForTimeout(500);
    const { data } = await sharp(await trophy.screenshot())
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const seen = new Set<number>();
    for (let i = 0; i < data.length; i += 3 * 97) seen.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    const colors = seen.size;
    expect(colors).toBeGreaterThan(20);
    await trophy.focus();
    await page.keyboard.press("ArrowRight");
    await expect(trophy).toHaveAttribute("aria-valuetext", /^Right side: 2021, adriana/);
    expect(errors).toEqual([]);
  });

  test("stops turning on Pause and turns again on Spin", async ({ page }) => {
    await page.goto("/halloween/");
    test.skip(
      !(await page.evaluate(() => Boolean(document.createElement("canvas").getContext("webgl2")))),
      "no WebGL here, so the trophy shows as a list",
    );
    const trophy = page.getByRole("slider", { name: "The trophy" });
    const angle = async () => Number(await trophy.getAttribute("aria-valuenow"));
    await page.getByRole("button", { name: "Pause" }).click();
    // The turn coasts to a stop in about a second, then holds.
    await page.waitForTimeout(1500);
    const stopped = await angle();
    await page.waitForTimeout(800);
    expect(await angle()).toBe(stopped);
    await page.getByRole("button", { name: "Spin" }).click();
    await expect.poll(angle).not.toBe(stopped);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("holds still and offers Spin instead of Pause", async ({ page }) => {
      await page.goto("/halloween/");
      test.skip(
        !(await page.evaluate(() => Boolean(document.createElement("canvas").getContext("webgl2")))),
        "no WebGL here, so the trophy shows as a list",
      );
      const trophy = page.getByRole("slider", { name: "The trophy" });
      await expect(page.getByRole("button", { name: "Spin" })).toBeVisible();
      const start = await trophy.getAttribute("aria-valuenow");
      await page.waitForTimeout(800);
      expect(await trophy.getAttribute("aria-valuenow")).toBe(start);
    });
  });
});
