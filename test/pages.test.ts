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

  it("link Casa, in Spanish, home and Halloween to the party list from every nav list", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      $("nav ul").each((_, list) => {
        const links = $(list).find("a").map((_, a) => ({ text: $(a).text().trim(), href: $(a).attr("href"), lang: $(a).attr("lang") })).get();
        expect(links, page).toEqual([
          { text: "Casa", href: "/", lang: "es" },
          { text: "Halloween", href: "/halloween/", lang: undefined },
        ]);
      });
    }
  });

  it("open the phone menu with a named button whose popovertarget is the panel right after it", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const button = $("nav button[popovertarget]");
      expect(button, page).toHaveLength(1);
      expect(button.attr("aria-label"), page).toBe("Menu");
      expect(button.find("svg").attr("aria-hidden"), page).toBe("true");
      expect(button.find("svg path"), page).toHaveLength(3);
      const panel = button.next();
      expect(panel.attr("id"), page).toBe(button.attr("popovertarget"));
      expect(panel.is("[popover]"), page).toBe(true);
      expect(panel.find("ul a"), page).toHaveLength(2);
    }
  });

  it("mark the link to the page's own section, and only that one, as the current page", () => {
    const section: Record<string, string> = {
      "index.html": "/",
      "halloween/index.html": "/halloween/",
      "halloween/2026/index.html": "/halloween/",
    };
    expect(shippedPages().sort()).toEqual(Object.keys(section).sort());
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const lists = $("nav ul");
      expect(lists.length, page).toBeGreaterThanOrEqual(1);
      // The inline links and the phone menu are two lists, and only one of them is ever displayed.
      lists.each((_, list) => {
        const current = $(list).find("a[aria-current='page']");
        expect(current, page).toHaveLength(1);
        expect(current.attr("href"), page).toBe(section[page]);
      });
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
