import namedColors from "color-name";
import type { Declaration } from "postcss";
import { describe, expect, it } from "vitest";
import { palette } from "../src/palette";
import { builtPage, pageCss, shippedPages } from "./site";

const themeColors = (page: string) => {
  const colors: Record<string, string> = {};
  for (const root of pageCss(builtPage(page)))
    root.walkDecls(/^--color-/, (decl) => {
      const rule = decl.parent;
      if (rule?.type === "rule" && /:root/.test((rule as { selector: string }).selector))
        colors[decl.prop.replace(/^--color-/, "")] = decl.value.toLowerCase();
    });
  return colors;
};

const paletteHexes = new Set(Object.values(palette).map((hex) => hex.slice(1).toLowerCase()));
const longHex = (hex: string) => (hex.length <= 4 ? [...hex].map((digit) => digit + digit).join("") : hex);

// Lightning writes `transparent` as #0000, and folds a theme color mixed with transparent (an opacity modifier, the
// divider) into the palette hex plus an alpha pair, keeping the color-mix for browsers that support it.
const offTheme = (value: string) => {
  const bare = value.replace(/url\([^)]*\)/g, "url()").toLowerCase();
  const hexes = [...bare.matchAll(/#([0-9a-f]{3,8})\b/g)]
    .map(([literal, digits]) => [literal, longHex(digits)])
    .filter(([, digits]) => !/^0{8}$/.test(digits) && !paletteHexes.has(digits.slice(0, 6)))
    .map(([literal]) => literal);
  const functions = [...bare.matchAll(/\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/g)].map(([fn]) => fn);
  const names = [...bare.matchAll(/(?<![\w-])[a-z]+(?![\w-])/g)]
    .map(([word]) => word)
    .filter((word) => Object.hasOwn(namedColors, word));
  return [...hexes, ...functions, ...names];
};

const isThemeColor = (decl: Declaration) =>
  decl.prop.startsWith("--color-") &&
  decl.parent?.type === "rule" &&
  /:root/.test((decl.parent as { selector: string }).selector);

describe("the Tailwind theme", () => {
  it("defines exactly the palette module's colors on every page", () => {
    expect(shippedPages().length).toBeGreaterThan(0);
    for (const page of shippedPages()) expect(themeColors(page), page).toEqual(palette);
  });

  it("is the only source of color on any page, scoped styles and style attributes included", () => {
    let checked = 0;
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const found: string[] = [];
      for (const root of pageCss($))
        root.walkDecls((decl) => {
          if (isThemeColor(decl)) return;
          checked++;
          for (const color of offTheme(decl.value)) found.push(`${decl.prop}: ${decl.value} (${color})`);
        });
      $("[style]").each((_, el) => {
        const style = $(el).attr("style") ?? "";
        checked++;
        for (const color of offTheme(style)) found.push(`style="${style}" (${color})`);
      });
      expect(found, page).toEqual([]);
    }
    expect(checked).toBeGreaterThan(0);
  });

  // Tailwind escapes the brackets of an arbitrary value in the selector, so any escaped bracket is a bypass of the scale.
  it("ship no arbitrary-value utility on any page", () => {
    for (const page of shippedPages()) {
      const arbitrary: string[] = [];
      for (const root of pageCss(builtPage(page)))
        root.walkRules((rule) => void (/\\[[\]]/.test(rule.selector) && arbitrary.push(rule.selector)));
      expect(arbitrary, page).toEqual([]);
    }
  });

  // Every page inlines the same global sheet, so a variable is unused only when no page reads it. Tailwind's own --tw-*
  // registers and the palette colors (kept whole for the check above) are left out.
  it("declare no custom property that nothing reads", () => {
    const declared = new Set<string>();
    const read = new Set<string>();
    const readsIn = (value: string) => {
      for (const [, name] of value.matchAll(/var\(\s*(--[\w-]+)/g)) read.add(name);
    };
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      for (const root of pageCss($))
        root.walkDecls((decl) => {
          if (decl.prop.startsWith("--")) declared.add(decl.prop);
          readsIn(decl.value);
        });
      $("[style]").each((_, el) => {
        const style = $(el).attr("style") ?? "";
        for (const [, name] of style.matchAll(/(--[\w-]+)\s*:/g)) declared.add(name);
        readsIn(style);
      });
    }
    const kept = (name: string) => name.startsWith("--tw-") || Object.hasOwn(palette, name.replace(/^--color-/, ""));
    expect(declared.size).toBeGreaterThan(0);
    expect([...declared].filter((name) => !read.has(name) && !kept(name)).sort()).toEqual([]);
  });
});
