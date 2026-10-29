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
});
