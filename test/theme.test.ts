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

describe("the Tailwind theme", () => {
  it("defines exactly the palette module's colors on every page", () => {
    expect(shippedPages().length).toBeGreaterThan(0);
    for (const page of shippedPages()) expect(themeColors(page), page).toEqual(palette);
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
