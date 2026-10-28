import { describe, expect, it } from "vitest";
import type { AtRule, Declaration } from "postcss";
import { builtPage, pageCss, readText } from "./site";

describe("built root page", () => {
  const $ = builtPage("index.html");

  it("has one h1 reading THE DNA CASA and the subtitle Dan & Alexis", () => {
    expect($("h1")).toHaveLength(1);
    expect(readText($, "h1")).toBe("THE DNA CASA");
    expect($("p").filter((_, p) => $(p).text().trim() === "Dan & Alexis")).toHaveLength(1);
  });

  it("has a title, a description and link-preview meta in the head", () => {
    const meta = (attr: string, key: string) => $(`head meta[${attr}="${key}"]`).attr("content") ?? "";
    expect($("head title").text()).toContain("The DNA Casa");
    expect(meta("name", "description")).not.toBe("");
    expect(meta("property", "og:title")).toContain("The DNA Casa");
    expect(meta("property", "og:description")).not.toBe("");
    expect(meta("property", "og:url")).toBe("https://thedna.casa/");
    expect(meta("property", "og:type")).toBe("website");
  });

  it("ships no JavaScript, so it renders fully with JavaScript off", () => {
    expect($("script").map((_, s) => $.html(s)).get()).toEqual([]);
  });

  it("animates only under prefers-reduced-motion: no-preference", () => {
    const animations: Declaration[] = [];
    for (const root of pageCss($)) root.walkDecls(/^animation(-name)?$/, (decl) => void animations.push(decl));
    // The ring turns and the squiggle paints on.
    expect(animations.length).toBeGreaterThanOrEqual(2);
    for (const decl of animations) {
      const guards: string[] = [];
      for (let node = decl.parent; node; node = node.parent as typeof node) {
        if (node.type === "atrule" && (node as AtRule).name === "media") guards.push((node as AtRule).params.replace(/\s+/g, ""));
      }
      expect(guards, decl.toString()).toContainEqual(expect.stringContaining("(prefers-reduced-motion:no-preference)"));
    }
  });

  it("hides the hero's logo, ring, squiggle and sparkles from assistive tech", () => {
    const drawings = $("header svg").filter((_, svg) => $(svg).parents("svg").length === 0);
    expect(drawings.length).toBeGreaterThan(0);
    drawings.each((_, svg) => {
      expect($(svg).closest("[aria-hidden='true']"), $.html(svg).slice(0, 80)).toHaveLength(1);
    });
  });
});
