import { describe, expect, it } from "vitest";
import type { AtRule, Declaration } from "postcss";
import { readFileSync } from "node:fs";
import { load } from "cheerio";
import sharp from "sharp";
import { builtFileExists, builtFilePath, builtPage, pageCss, photoSiteDist, readText } from "./site";
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

  it("has one h1 reading THE DnA CASA and the subtitle Dan & Alexis", () => {
    expect($("h1")).toHaveLength(1);
    expect(readText($, "h1")).toBe("THE DnA CASA");
    expect($("p").filter((_, p) => $(p).text().trim() === "Dan & Alexis")).toHaveLength(1);
  });

  it("has a title, a description and link-preview meta in the head", () => {
    const meta = (attr: string, key: string) => $(`head meta[${attr}="${key}"]`).attr("content") ?? "";
    expect($("head title").text()).toContain("The DnA Casa");
    expect(meta("name", "description")).not.toBe("");
    expect(meta("property", "og:title")).toContain("The DnA Casa");
    expect(meta("property", "og:description")).not.toBe("");
    expect(meta("property", "og:url")).toBe("https://thedna.casa/");
    expect(meta("property", "og:type")).toBe("website");
  });

  it("uses the page's own Beso logo as the favicon", () => {
    const paths = ($svg: ReturnType<typeof $>) => $svg.find("path").map((_, p) => $(p).attr("d")).get().sort();
    const logo = paths($("svg.stamp-mark").first());
    expect(logo.length).toBeGreaterThan(0);
    const favicon = load(readFileSync(builtFilePath("/favicon.svg"), "utf8"), { xmlMode: true });
    expect(favicon("path").map((_, p) => favicon(p).attr("d")).get().sort()).toEqual(logo);
  });

  // The link travels in messages, where a preview without an image is easy to scroll past.
  it("gives shared links a large 1200x630 preview image that exists", async () => {
    const meta = (attr: string, key: string) => $(`head meta[${attr}="${key}"]`).attr("content") ?? "";
    const image = meta("property", "og:image");
    expect(image).toMatch(/^https:\/\/thedna\.casa\/.+\.png$/);
    const path = new URL(image).pathname;
    expect(builtFileExists(path), path).toBe(true);
    const { width, height, format } = await sharp(builtFilePath(path)).metadata();
    expect({ width, height, format }).toEqual({ width: 1200, height: 630, format: "png" });
    expect(meta("property", "og:image:alt")).not.toBe("");
    expect(meta("name", "twitter:card")).toBe("summary_large_image");
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

  it("signs off in the footer with Con cariño and the build year", () => {
    expect(readText($, "footer")).toBe(`Con cariño · © ${new Date().getFullYear()} The DnA Casa`);
  });

  // Without lang a screen reader says these with an English voice.
  it("marks Bienvenidos and Con cariño as Spanish", () => {
    for (const phrase of ["Bienvenidos", "Con cariño"]) {
      const holders = $("[lang='es']").filter((_, el) => $(el).text().trim() === phrase);
      expect(holders, phrase).toHaveLength(1);
    }
  });

  it("inlines its CSS, so no stylesheet request holds up first paint", () => {
    expect($("link[rel='stylesheet']").map((_, l) => $.html(l)).get()).toEqual([]);
    expect($("head style").length).toBeGreaterThan(0);
  });

  it("loads only the font faces the page sets text in", () => {
    const faces = new Set<string>();
    for (const root of pageCss($)) {
      root.walkAtRules("font-face", (face) => {
        const prop = (name: string) => face.nodes?.find((n): n is Declaration => n.type === "decl" && n.prop === name)?.value ?? "";
        faces.add(`${prop("font-family").replace(/["']/g, "")} ${prop("font-weight")} ${prop("font-style")}`);
      });
    }
    expect([...faces].sort()).toEqual(["Averia Serif Libre 400 italic", "Averia Serif Libre 700 normal", "Schibsted Grotesk 400 normal"]);
  });

  it("has no marquee", () => {
    expect($("marquee")).toHaveLength(0);
    expect($.html()).not.toMatch(/marquee/i);
  });

  // Member names are h3s so a screen reader can jump from one member to the next.
  it("runs its headings as one h1, then h2s, with an h3 per member under Who lives here", () => {
    const headings = $("h1, h2, h3, h4, h5, h6").map((_, h) => `${h.tagName} ${readText($, h)}`).get();
    expect(headings).toEqual([
      "h1 THE DnA CASA",
      "h2 Hola, we're Dan & Alexis.",
      "h2 Who lives here",
      ...members.map((m) => `h3 ${m.name}`),
    ]);
  });

  it("shows a photo for every member and a described welcome photo", () => {
    expect(membersHeading().closest("section").find("li").map((_, li) => $(li).find("img").length).get()).toEqual(members.map(() => 1));
    const photo = sectionHeading("Hola, we're Dan & Alexis.").closest("section").find("img");
    expect(photo).toHaveLength(1);
    expect(photo.attr("alt")).not.toBe("");
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

  // Without border-box the hero's 214px of padding stacks on its min(92dvh, 880px) height and pushes the wave below a desktop screen.
  it("counts the hero's padding inside its height", () => {
    const sizing: string[] = [];
    for (const root of pageCss($)) {
      root.walkRules(/\.hero\b/, (rule) => {
        if (rule.parent?.type !== "root") return;
        rule.walkDecls("box-sizing", (decl) => void sizing.push(decl.value));
      });
    }
    expect(sizing).toContain("border-box");
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

  // A sparkle is a four-point star: one closed path of exactly four quadratic curves.
  it("draws no sparkle in the hero", () => {
    const stars = $("header path").filter((_, path) => {
      const d = $(path).attr("d") ?? "";
      return /^M[^A-Za-z]*(Q[^A-Za-z]*){4}Z$/.test(d.trim());
    });
    expect(stars.map((_, path) => $.html(path)).get()).toEqual([]);
  });

  it("hides the hero's logo, ring and squiggle from assistive tech", () => {
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

describe("welcome without a photo", () => {
  const $ = builtPage("no-photo/index.html", photoSiteDist);

  // Without a real photo the petal is decoration, and announcing a placeholder tells a listener nothing.
  it("hides the petal placeholder from assistive tech", () => {
    const section = $("section");
    expect(section.find("img, [role='img'], [aria-label]")).toHaveLength(0);
    const drawings = section.find("svg");
    expect(drawings.length).toBeGreaterThan(0);
    drawings.each((_, svg) => {
      expect($(svg).closest("[aria-hidden='true']"), $.html(svg).slice(0, 80)).toHaveLength(1);
    });
  });
});

describe("welcome photo", () => {
  const $ = builtPage("welcome/index.html", photoSiteDist);

  it("has descriptive alt text", () => {
    const photo = $("img");
    expect(photo).toHaveLength(1);
    expect(photo.attr("alt")).toBe("Dan and Alexis on the porch");
  });

  // Phones show the words before the photo, so screen readers should meet them in that order too.
  it("comes after the welcome words in reading order", () => {
    const order = $("h2, img").map((_, el) => (el.tagName === "h2" ? "words" : "photo")).get();
    expect(order).toEqual(["words", "photo"]);
  });
});
