import { expect, test, type Page } from "@playwright/test";
import { phone, shippedPages } from "./pages";

// Fade-ups move boxes while they run, so geometry is read with motion off.
test.use({ reducedMotion: "reduce" });

// The title's line breaks were chosen for the real serif, so measuring in a fallback would prove nothing.
const gotoWithSerif = async (page: Page, path: string) => {
  await page.goto(path);
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('700 1em "Averia Serif Libre"');
  });
  expect(loaded, "the serif loaded").toBe(true);
};

// The drips hang over the cream main, so cream shows between them from their top; the wave's top is where it rises out of the hero.
const edgeBox = (page: Page) =>
  page.evaluate(() => {
    const box = document.querySelector(".welcome > .edge, main > .drips")?.getBoundingClientRect();
    return { screen: window.innerHeight, top: box?.top ?? NaN, height: box?.height ?? NaN };
  });

for (const path of shippedPages) {
  test.describe(path, () => {
    // A rewrap while the serif loads shifts everything under the title.
    test("never wraps a hero title line", async ({ page }) => {
      await page.goto(path);
      const h1 = page.locator("header h1");
      await expect(h1).toHaveCount(1);
      expect(await h1.evaluate((el) => getComputedStyle(el).whiteSpace)).toBe("nowrap");
    });

    for (const width of [360, 390]) {
      test(`fits every hero title line inside the hero at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: phone.viewport.height });
        await gotoWithSerif(page, path);
        const { box, lines } = await page.locator("header h1").evaluate((h1) => {
          const hero = h1.closest("header")!;
          const rect = hero.getBoundingClientRect();
          const pad = getComputedStyle(hero);
          const range = document.createRange();
          return {
            box: {
              left: rect.left + parseFloat(pad.paddingLeft),
              right: rect.right - parseFloat(pad.paddingRight),
            },
            lines: [...h1.childNodes]
              .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim())
              .map((node) => {
                range.selectNodeContents(node);
                const { left, right } = range.getBoundingClientRect();
                return { text: node.textContent!.trim(), left, right };
              }),
          };
        });
        expect(lines.length).toBeGreaterThan(0);
        for (const line of lines) {
          expect(line.left, `"${line.text}" left edge`).toBeGreaterThanOrEqual(box.left - 0.5);
          expect(line.right, `"${line.text}" right edge`).toBeLessThanOrEqual(box.right + 0.5);
        }
      });
    }

    // The build picks each breakpoint's size from a model of the hero grid, so this catches the model drifting from the CSS.
    for (const width of [768, 1024, 1280, 1536]) {
      test(`fits every hero title line inside its column at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithSerif(page, path);
        const { column, lines } = await page.locator("header h1").evaluate((h1) => {
          const range = document.createRange();
          return {
            column: h1.parentElement!.getBoundingClientRect().right,
            lines: [...h1.childNodes]
              .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim())
              .map((node) => {
                range.selectNodeContents(node);
                return { text: node.textContent!.trim(), right: range.getBoundingClientRect().right };
              }),
          };
        });
        expect(lines.length).toBeGreaterThan(0);
        for (const line of lines) expect(line.right, `"${line.text}" right edge`).toBeLessThanOrEqual(column + 0.5);
      });
    }

    // The nav sits over the hero, so a hero that starts its words above the nav's foot hides them under it.
    for (const viewport of [phone.viewport, { width: 1440, height: 900 }]) {
      test(`pads the hero's top past the nav at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        const { nav, top } = await page.evaluate(() => {
          const hero = document.querySelector("header")!;
          return {
            nav: document.querySelector("nav")!.getBoundingClientRect().bottom,
            top: hero.getBoundingClientRect().top + parseFloat(getComputedStyle(hero).paddingTop),
          };
        });
        expect(nav, "nav bottom").toBeGreaterThan(0);
        expect(top, "hero content top").toBeGreaterThanOrEqual(nav);
      });
    }

    // The drips hang over the top of the main, so its first section must start its words below their longest drip.
    if (path !== "/")
      for (const viewport of [phone.viewport, { width: 1440, height: 900 }]) {
        test(`starts the first section below the drips at ${viewport.width}px`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto(path);
          const { drips, top } = await page.evaluate(() => {
            const section = document.querySelector("main > section")!;
            return {
              drips: document.querySelector("main > .drips")!.getBoundingClientRect().bottom,
              top: section.getBoundingClientRect().top + parseFloat(getComputedStyle(section).paddingTop),
            };
          });
          expect(top - drips, "clearance under the drips").toBeGreaterThanOrEqual(24);
        });
      }

    test.describe("on a phone", () => {
      test.use(phone);

      // A sliver of edge at the screen's foot reads as a rendering seam, not as the start of the page.
      test("shows at least half the edge, and the cream middle, on the first screen", async ({ page }) => {
        await gotoWithSerif(page, path);
        const { screen, top, height } = await edgeBox(page);
        expect(height, "edge height").toBeGreaterThan(0);
        expect(top + height / 2, "edge middle").toBeLessThanOrEqual(screen);
      });
    });
  });
}

test.describe("on a 1440x900 screen", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("/ shows the whole wave between hero and welcome without scrolling", async ({ page }) => {
    await gotoWithSerif(page, "/");
    const wave = await page.locator(".welcome > .edge").boundingBox();
    expect(wave, "the wave is drawn").not.toBeNull();
    expect(wave!.height).toBeGreaterThan(0);
    expect(wave!.y + wave!.height, "wave bottom").toBeLessThanOrEqual(900);
  });
});
