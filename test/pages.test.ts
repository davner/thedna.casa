import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { builtPage, pageCss, shippedPages } from "./site";

const squash = (value: string) => value.replace(/\s+/g, "");

const designFontSizes = () => {
  const design = readFileSync(new URL("../DESIGN.md", import.meta.url), "utf8");
  const frontMatter = design.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const typography: Record<string, { fontSize?: string }> = parse(frontMatter)?.typography ?? {};
  return new Set(Object.values(typography).map((role) => squash(role.fontSize ?? "")).filter(Boolean));
};

describe("shipped pages", () => {
  it("include no prototype route", () => {
    expect(shippedPages().filter((page) => /prototype/i.test(page))).toEqual([]);
  });

  it("carry no prototype variant switcher", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      expect($(".proto-switcher, [aria-label*='variant switcher' i]"), page).toHaveLength(0);
    }
  });

  it("set every text size from DESIGN.md's type scale", () => {
    const scale = designFontSizes();
    expect(scale.size).toBeGreaterThan(0);
    const offScale: string[] = [];
    let declarations = 0;
    for (const page of shippedPages()) {
      for (const root of pageCss(builtPage(page))) {
        root.walkDecls("font-size", (decl) => {
          declarations++;
          if (!scale.has(squash(decl.value))) offScale.push(`${page} ${decl.parent?.toString().split("{")[0].trim()} { font-size: ${decl.value} }`);
        });
      }
    }
    // A floor, so the check cannot pass on zero declarations if the CSS moves somewhere this test does not read.
    expect(declarations).toBeGreaterThanOrEqual(8);
    expect(offScale).toEqual([]);
  });
});
