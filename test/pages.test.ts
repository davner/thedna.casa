import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { AtRule, Declaration } from "postcss";
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

  it("ship no JavaScript, so they render fully with JavaScript off", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      expect($("script").map((_, s) => $.html(s)).get(), page).toEqual([]);
    }
  });

  it("animate only under prefers-reduced-motion: no-preference", () => {
    for (const page of shippedPages()) {
      const animations: Declaration[] = [];
      for (const root of pageCss(builtPage(page))) root.walkDecls(/^(animation(-name)?|transition(-property)?)$/, (decl) => void animations.push(decl));
      // A floor, so the guard check below cannot pass on an empty list if the CSS moves somewhere this test does not read.
      expect(animations.length, page).toBeGreaterThanOrEqual(2);
      for (const decl of animations) {
        const guards: string[] = [];
        for (let node = decl.parent; node; node = node.parent as typeof node) {
          if (node.type === "atrule" && (node as AtRule).name === "media") guards.push(squash((node as AtRule).params));
        }
        expect(guards, `${page} ${decl.toString()}`).toContainEqual(expect.stringContaining("(prefers-reduced-motion:no-preference)"));
      }
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
