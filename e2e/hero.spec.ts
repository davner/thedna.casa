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
const edgeTop = (page: Page) =>
  page.evaluate(() => {
    const edge = document.querySelector(".welcome > .edge, main > .drips");
    return { screen: window.innerHeight, top: edge?.getBoundingClientRect().top ?? NaN };
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

    test.describe("on a phone", () => {
      test.use(phone);

      test("shows the edge and the start of the cream middle on the first screen", async ({ page }) => {
        await gotoWithSerif(page, path);
        const { screen, top } = await edgeTop(page);
        expect(top, "edge top").toBeLessThan(screen);
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
