import { describe, expect, it } from "vitest";
import type { AtRule, Declaration } from "postcss";
import { builtFileExists, builtPage, pageCss, photoSiteDist, readText } from "./site";
import { members, welcome } from "../src/content";

describe("built root page", () => {
  const $ = builtPage("index.html");

  const sectionHeading = (text: string) => $("h2").filter((_, h) => $(h).text().trim() === text);
  const membersHeading = () => sectionHeading("Who lives here");

  // Each member's visible texts in reading order, so the test does not care which tags hold them.
  const memberEntries = () =>
    membersHeading().closest("section").find("li").map((_, li) => [
      $(li).children().map((_, child) => $(child).text().trim()).get().filter(Boolean),
    ]).get() as string[][];

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

  it("links an SVG favicon, a PNG fallback and an apple-touch icon that all exist", () => {
    const href = (selector: string) => $(`head ${selector}`).attr("href") ?? "";
    const icons = [
      href("link[rel='icon'][type='image/svg+xml']"),
      href("link[rel='icon'][type='image/png']"),
      href("link[rel='apple-touch-icon']"),
    ];
    for (const icon of icons) {
      expect(icon).not.toBe("");
      expect(builtFileExists(icon), icon).toBe(true);
    }
  });

  it("ships no JavaScript, so it renders fully with JavaScript off", () => {
    expect($("script").map((_, s) => $.html(s)).get()).toEqual([]);
  });

  it("animates only under prefers-reduced-motion: no-preference", () => {
    const animations: Declaration[] = [];
    for (const root of pageCss($)) root.walkDecls(/^animation(-name)?$/, (decl) => void animations.push(decl));
    // A floor, so the guard check below cannot pass on an empty list if the CSS moves somewhere this test does not read.
    expect(animations.length).toBeGreaterThanOrEqual(2);
    for (const decl of animations) {
      const guards: string[] = [];
      for (let node = decl.parent; node; node = node.parent as typeof node) {
        if (node.type === "atrule" && (node as AtRule).name === "media") guards.push((node as AtRule).params.replace(/\s+/g, ""));
      }
      expect(guards, decl.toString()).toContainEqual(expect.stringContaining("(prefers-reduced-motion:no-preference)"));
    }
  });

  it("lists Dan, Alexis, Milly and Penny under Who lives here", () => {
    expect(membersHeading()).toHaveLength(1);
    expect(memberEntries().map((texts) => texts[0])).toEqual(["Dan", "Alexis", "Milly", "Penny"]);
  });

  it("welcomes with Bienvenidos, a hello from Dan & Alexis and the welcome text", () => {
    const hello = sectionHeading("Hola, we're Dan & Alexis.");
    expect(hello).toHaveLength(1);
    const section = readText($, hello.closest("section"));
    expect(section).toContain("Bienvenidos");
    expect(section).toContain(welcome.text);
  });

  it("gives the welcome photo, or its placeholder, alt text", () => {
    const photo = $("h2:contains('Hola')").closest("section").find("img, [role='img']");
    expect(photo).toHaveLength(1);
    expect((photo.attr("alt") ?? photo.attr("aria-label") ?? "").trim()).not.toBe("");
  });

  // Phones show the words before the petal shape, so screen readers should meet them in that order too.
  it("reads the welcome words before the welcome photo", () => {
    const section = $("#welcome-heading").closest("section");
    const order = section.find("h2, img, [role='img']").map((_, el) => (el.tagName === "h2" ? "words" : "photo")).get();
    expect(order).toEqual(["words", "photo"]);
  });

  it("signs off in the footer with Con cariño and the build year", () => {
    expect(readText($, "footer")).toBe(`Con cariño · © ${new Date().getFullYear()} The DNA Casa`);
  });

  it("has no marquee", () => {
    expect($("marquee")).toHaveLength(0);
    expect($.html()).not.toMatch(/marquee/i);
  });

  it("runs its headings as one h1 then h2s, in page order", () => {
    const headings = $("h1, h2, h3, h4, h5, h6").map((_, h) => `${h.tagName} ${readText($, h)}`).get();
    expect(headings).toEqual(["h1 THE DNA CASA", "h2 Hola, we're Dan & Alexis.", "h2 Who lives here"]);
  });

  it("gives each member the one-liner from the content module", () => {
    expect(memberEntries()).toEqual(members.map((m) => [m.name, m.line]));
  });

  // The stamp ring turns inside a square box, so at 45 degrees its corners reach about 1.41x the stamp's width.
  it("clips the hero sideways at every width, so the turning ring never makes the page scroll sideways", () => {
    const clips: string[] = [];
    for (const root of pageCss($)) {
      root.walkRules(/(^|[\s,])header\b|\.hero\b/, (rule) => {
        if (rule.parent?.type !== "root") return;
        rule.walkDecls(/^overflow(-x)?$/, (decl) => void clips.push(decl.value));
      });
    }
    expect(clips).toContainEqual(expect.stringMatching(/^(clip|hidden)\b/));
  });

  it("opens the phone screen with the turning stamp, above the wordmark", () => {
    const orders: string[] = [];
    for (const root of pageCss($)) {
      root.walkAtRules("media", (media) => {
        // The minifier rewrites max-width queries into range syntax.
        if (!/^\((max-width:|width<=)760px\)$/.test(media.params.replace(/\s+/g, ""))) return;
        media.walkRules(/\.stamp\b/, (rule) => rule.walkDecls("order", (decl) => void orders.push(decl.value)));
      });
    }
    expect(orders).toContainEqual(expect.stringMatching(/^-\d/));
  });

  it("hides the hero's logo, ring, squiggle and sparkles from assistive tech", () => {
    const drawings = $("header svg").filter((_, svg) => $(svg).parents("svg").length === 0);
    expect(drawings.length).toBeGreaterThan(0);
    drawings.each((_, svg) => {
      expect($(svg).closest("[aria-hidden='true']"), $.html(svg).slice(0, 80)).toHaveLength(1);
    });
  });
});

describe("member portraits", () => {
  const $ = builtPage("portraits/index.html", photoSiteDist);

  // The member's name is printed right under the portrait, so alt text would make screen readers say it twice.
  it("have empty alt text", () => {
    const portraits = $("li img");
    expect(portraits).toHaveLength(1);
    expect(portraits.attr("alt")).toBe("");
  });
});
