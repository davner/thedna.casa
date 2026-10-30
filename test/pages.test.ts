import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { AtRule, Declaration, Rule } from "postcss";
import { parse } from "yaml";
import { builtPage, pageCss, readText, shippedPages } from "./site";

const squash = (value: string) => value.replace(/\s+/g, "");

const designFontSizes = () => {
  const design = readFileSync(new URL("../DESIGN.md", import.meta.url), "utf8");
  const frontMatter = design.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const typography: Record<string, { fontSize?: string }> = parse(frontMatter)?.typography ?? {};
  // A role written as Tailwind text classes ("text-5xl md:text-7xl") ships the theme variables those classes set.
  const sizes = (fontSize: string) => {
    const classes = fontSize.trim().split(/\s+/);
    return classes.every((name) => /^([\w-]+:)?text-[\w.]+$/.test(name))
      ? classes.map((name) => `var(--${name.replace(/^[\w-]+:/, "")})`)
      : [squash(fontSize)];
  };
  return new Set(
    Object.values(typography)
      .flatMap((role) => sizes(role.fontSize ?? ""))
      .filter(Boolean),
  );
};

// Preflight's resets size text relative to its parent, which is itself checked against the scale.
const isPreflightRelative = (decl: Declaration) => {
  if (!/^(inherit|[\d.]+(em|%))$/.test(decl.value)) return false;
  for (let node = decl.parent; node; node = node.parent as typeof node)
    if (node.type === "atrule" && (node as AtRule).name === "layer" && (node as AtRule).params === "base") return true;
  return false;
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

  // The hero title's size classes are built in TypeScript, which Tailwind does not scan, so a missing one would ship no rule.
  it("ship a rule for every size class on a hero title", () => {
    const escape = (name: string) =>
      name.replace(/^(\d)/, (digit) => `\\3${digit} `).replace(/[^\w\s\\-]/g, (char) => `\\${char}`);
    const missing: string[] = [];
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      const selectors = new Set<string>();
      for (const root of pageCss($)) root.walkRules((rule) => void selectors.add(rule.selector));
      const classes = ($("header h1").attr("class") ?? "").split(/\s+/).filter(Boolean);
      expect(classes.length, page).toBeGreaterThan(0);
      for (const name of classes) if (!selectors.has(`.${escape(name)}`)) missing.push(`${page} ${name}`);
    }
    expect(missing).toEqual([]);
  });

  it("set every text size from DESIGN.md's type scale", () => {
    const scale = designFontSizes();
    expect(scale.size).toBeGreaterThan(0);
    const offScale: string[] = [];
    let declarations = 0;
    for (const page of shippedPages()) {
      for (const root of pageCss(builtPage(page))) {
        root.walkDecls("font-size", (decl) => {
          if (isPreflightRelative(decl)) return;
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
