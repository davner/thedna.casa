import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { AtRule, Declaration, Rule } from "postcss";
import { load } from "cheerio";
import { parse } from "yaml";
import { createRequire } from "node:module";
import { openSync, type Font } from "fontkit";
import { builtPage, pageCss, readText, shippedPages } from "./site";

const squash = (value: string) => value.replace(/\s+/g, "");

const designFontSizes = () => {
  const design = readFileSync(new URL("../DESIGN.md", import.meta.url), "utf8");
  const frontMatter = design.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const typography: Record<string, { fontSize?: string }> = parse(frontMatter)?.typography ?? {};
  return new Set(
    Object.values(typography)
      .map((role) => squash(role.fontSize ?? ""))
      .filter(Boolean),
  );
};

// The self-hosted face the hero title is set in, so a line's width can be measured without a browser.
const serif = openSync(
  createRequire(import.meta.url).resolve(
    "@fontsource/averia-serif-libre/files/averia-serif-libre-latin-700-normal.woff2",
  ),
) as Font;

// Resolves a length in rem, vw, px or em, including clamp(), at a given screen width.
const cssLength = (value: string, screen: number, em = 16): number => {
  const clamp = value.match(/^clamp\((.+),(.+),(.+)\)$/);
  if (clamp) {
    const [min, preferred, max] = clamp.slice(1).map((part) => cssLength(part.trim(), screen, em));
    return Math.min(max, Math.max(min, preferred));
  }
  const [, number, unit] = value.match(/^(-?[\d.]+)(rem|vw|px|em)?$/) ?? [];
  const scale = { rem: 16, vw: screen / 100, px: 1, em, "": 1 }[unit ?? ""] ?? NaN;
  return parseFloat(number) * scale;
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
        const links = $(list)
          .find("a")
          .map((_, a) => ({ text: $(a).text().trim(), href: $(a).attr("href"), lang: $(a).attr("lang") }))
          .get();
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

  // A panel that ends after its links leaves a straight dark edge across the stamp below it.
  it("stretch the open phone menu panel to the bottom of the screen", () => {
    for (const page of shippedPages()) {
      const panel: Record<string, string> = {};
      for (const root of pageCss(builtPage(page))) {
        root.walkRules(/^#site-menu(\[[^\]]+\])?$/, (rule) => {
          if (rule.parent?.type !== "root") return;
          rule.walkDecls((decl) => void (panel[decl.prop] = decl.value.replace(/\s+/g, " ").trim()));
        });
      }
      // The popover default is height: fit-content, which would win over the bottom inset.
      expect({ inset: panel.inset, height: panel.height }, page).toEqual({ inset: "76px 0 0", height: "auto" });
    }
  });

  it("crossfade into the next page with a CSS view transition, only under prefers-reduced-motion: no-preference", () => {
    for (const page of shippedPages()) {
      const transitions: string[] = [];
      for (const root of pageCss(builtPage(page))) {
        root.walkAtRules("view-transition", (rule) => {
          const media = rule.parent?.type === "atrule" ? squash((rule.parent as AtRule).params) : "";
          rule.walkDecls("navigation", (decl) => void transitions.push(`${media} ${decl.value}`));
        });
      }
      expect(transitions, page).toEqual(["(prefers-reduced-motion:no-preference) auto"]);
    }
  });

  it("pad the top of every hero past the navbar, so the nav never overlaps the words", () => {
    // The minifier rewrites max-width queries into range syntax.
    const phone = (rule: Rule) => {
      const media = rule.parent?.type === "atrule" ? (rule.parent as AtRule) : undefined;
      if (!media) return false;
      return /^\((max-width:|width<=)760px\)$/.test(squash(media.params));
    };
    const firstPx = (value: string) => Number(value.match(/(\d+(?:\.\d+)?)px/)?.[1] ?? NaN);
    for (const page of shippedPages()) {
      const nav = { desktop: 0, phone: 0 };
      const heroTops: { phone: boolean; top: number; rule: string }[] = [];
      for (const root of pageCss(builtPage(page))) {
        root.walkRules((rule) => {
          const atRoot = rule.parent?.type === "root";
          if (!atRoot && !phone(rule)) return;
          if (/^\.nav\b[^\s]*$/.test(rule.selector)) {
            rule.walkDecls("height", (decl) => void (nav[atRoot ? "desktop" : "phone"] = firstPx(decl.value)));
          }
          if (/^\.hero\b[^\s]*$/.test(rule.selector)) {
            rule.walkDecls(
              /^padding(-top)?$/,
              (decl) =>
                void heroTops.push({
                  phone: !atRoot,
                  top: firstPx(decl.value.split(/\s+(?![^(]*\))/)[0]),
                  rule: rule.selector,
                }),
            );
          }
        });
      }
      expect(nav.desktop, page).toBeGreaterThan(0);
      expect(nav.phone, page).toBeGreaterThan(0);
      expect(heroTops.length, page).toBeGreaterThanOrEqual(2);
      for (const { phone, top, rule } of heroTops)
        expect(top, `${page} ${rule}`).toBeGreaterThanOrEqual(phone ? nav.phone : nav.desktop);
    }
  });

  it("mark the link to the page's own section, and only that one, as the current page", () => {
    const section: Record<string, string> = {
      "index.html": "/",
      "halloween/index.html": "/halloween/",
      "halloween/2021/index.html": "/halloween/",
      "halloween/2022/index.html": "/halloween/",
      "halloween/2023/index.html": "/halloween/",
      "halloween/2024/index.html": "/halloween/",
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

  // Text alignment inherits, so the nearest element a desktop rule aligns decides where the heading sits.
  it("set every section heading on the left on desktop", () => {
    const aligned: string[] = [];
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const rules: { selector: string; value: string }[] = [];
      for (const root of pageCss($)) {
        root.walkDecls("text-align", (decl) => {
          for (let node = decl.parent?.parent; node; node = node.parent as typeof node) {
            if (node.type === "atrule" && /width/.test((node as AtRule).params)) return;
          }
          rules.push({ selector: (decl.parent as Rule).selector, value: decl.value });
        });
      }
      const matches = (el: Parameters<typeof $>[0], selector: string) => {
        try {
          return $(el).is(selector);
        } catch {
          return false;
        }
      };
      $("h2").each((_, h2) => {
        for (const el of [h2, ...$(h2).parents().get()]) {
          const value = rules.filter((rule) => matches(el, rule.selector)).at(-1)?.value;
          if (value) {
            if (!["left", "start"].includes(value)) aligned.push(`${page} ${readText($, h2)}: ${value}`);
            return;
          }
        }
      });
    }
    expect(aligned).toEqual([]);
  });

  it("inline their CSS, so no stylesheet request holds up first paint", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      expect(
        $("link[rel='stylesheet']")
          .map((_, l) => $.html(l))
          .get(),
        page,
      ).toEqual([]);
      expect($("head style").length, page).toBeGreaterThan(0);
    }
  });

  // The retired sparkle was one closed path of four quadratic curves, and no other drawing has that shape.
  it("draw no sparkle in the hero", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const stars = $("header path").filter((_, path) =>
        /^M[^A-Za-z]*(Q[^A-Za-z]*){4}Z$/.test(($(path).attr("d") ?? "").trim()),
      );
      expect(stars.map((_, path) => $.html(path)).get(), page).toEqual([]);
    }
  });

  // The trophy's drag-to-turn is the one script; everything else is HTML and CSS.
  it("ship JavaScript only on the Halloween list, as one module for the trophy", () => {
    for (const page of shippedPages()) {
      const scripts = builtPage(page)("script");
      if (page === "halloween/index.html") {
        expect(scripts, page).toHaveLength(1);
        expect(scripts.attr("type"), page).toBe("module");
      } else expect(scripts, page).toHaveLength(0);
    }
  });

  it("animate only under prefers-reduced-motion: no-preference", () => {
    for (const page of shippedPages()) {
      const animations: Declaration[] = [];
      for (const root of pageCss(builtPage(page)))
        root.walkDecls(/^(animation(-name)?|transition(-property)?)$/, (decl) => void animations.push(decl));
      // A floor, so the guard check below cannot pass on an empty list if the CSS moves somewhere this test does not read.
      expect(animations.length, page).toBeGreaterThanOrEqual(2);
      for (const decl of animations) {
        const guards: string[] = [];
        for (let node = decl.parent; node; node = node.parent as typeof node) {
          if (node.type === "atrule" && (node as AtRule).name === "media") guards.push(squash((node as AtRule).params));
        }
        expect(guards, `${page} ${decl.toString()}`).toContainEqual(
          expect.stringContaining("(prefers-reduced-motion:no-preference)"),
        );
      }
    }
  });

  // A title wider than the hero's text area spills past the gutter and sits off center.
  it.each([360, 390])("fit every hero title line inside the phone hero's text area at %ipx", (screen) => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const phoneDecl = (selector: string, prop: string, phone: boolean) => {
        let found: string | undefined;
        for (const root of pageCss($)) {
          root.walkDecls(prop, (decl) => {
            const rule = decl.parent as Rule;
            const media = rule.parent?.type === "atrule" ? squash((rule.parent as AtRule).params) : "";
            if (
              (phone ? /760px/.test(media) : media === "") &&
              rule.selector.replace(/\[data-astro-cid-[^\]]+\]/g, "") === selector
            )
              found = decl.value;
          });
        }
        return found;
      };
      // A page shrinks its own title through --fit, so the shared size is read apart from the page's factor.
      const shared =
        (phoneDecl("h1", "font-size", true) ?? "").match(/^calc\((.+)\s*\*\s*var\(--fit,\s*1\)\)$/)?.[1] ?? "";
      const fit = Number(
        $("header h1")
          .attr("style")
          ?.match(/--fit:\s*([\d.]+)/)?.[1] ?? 1,
      );
      const fontSize = cssLength(shared.trim(), screen) * fit;
      const tracking = cssLength(phoneDecl("h1", "letter-spacing", false) ?? "0", screen, fontSize);
      const gutter = cssLength((phoneDecl(".hero", "padding", true) ?? "").split(/\s+/)[1], screen);
      const room = screen - 2 * gutter;
      expect(room, page).toBeGreaterThan(0);
      const lines = ($("header h1").html() ?? "").split(/<br[^>]*>/).map((line) => load(line).text().trim());
      for (const line of lines) {
        const run = serif.layout(line);
        const width = (run.advanceWidth * fontSize) / serif.unitsPerEm + tracking * [...line].length;
        expect(width, `${page} "${line}"`).toBeLessThanOrEqual(room);
      }
    }
  });

  // Tilted photos were tried and dropped; only the stamp's turning ring and the menu strokes' X may rotate.
  it("never tilt a photo or card", () => {
    const tilts: string[] = [];
    for (const page of shippedPages()) {
      for (const root of pageCss(builtPage(page))) {
        root.walkDecls(/^(transform|rotate)$/, (decl) => {
          if (decl.prop === "transform" && !/rotate/.test(decl.value)) return;
          const rule = decl.parent as Rule;
          if (rule.parent?.type === "atrule" && /keyframes/.test((rule.parent as AtRule).name)) return;
          if (
            /^\.nav:has\(#site-menu:popover-open\) \.s[02]$/.test(
              rule.selector.replace(/\[data-astro-cid-[^\]]+\]/g, ""),
            )
          )
            return;
          tilts.push(`${page} ${rule.selector} { ${decl.prop}: ${decl.value} }`);
        });
      }
    }
    expect(tilts).toEqual([]);
  });

  // The title's lines are broken at build time for the real font; wrapping in the fallback shifted the layout as it loaded.
  it("never wrap a hero title line", () => {
    for (const page of shippedPages()) {
      const values: string[] = [];
      for (const root of pageCss(builtPage(page)))
        root.walkDecls("white-space", (decl) => {
          if ((decl.parent as Rule).selector.replace(/\[data-astro-cid-[^\]]+\]/g, "") === "h1")
            values.push(decl.value);
        });
      expect(values, page).toContain("nowrap");
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
          if (!scale.has(squash(decl.value)))
            offScale.push(`${page} ${decl.parent?.toString().split("{")[0].trim()} { font-size: ${decl.value} }`);
        });
      }
    }
    // A floor, so the check cannot pass on zero declarations if the CSS moves somewhere this test does not read.
    expect(declarations).toBeGreaterThanOrEqual(8);
    expect(offScale).toEqual([]);
  });
});
