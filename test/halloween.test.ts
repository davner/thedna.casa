import { beforeAll, describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import type { CheerioAPI } from "cheerio";
import { parse } from "yaml";
import sharp from "sharp";
import { builtFileExists, builtFilePath, builtPage, pageCss, readText } from "./site";
import { drips, ghost, marigoldMark, marigoldMask } from "../src/lib/shapes";
import { petalSeed } from "../src/lib/parties";
import { palette } from "../src/palette";

// The party file itself is the source of truth for the recap's words.
const partyFile = readFileSync(new URL("../src/content/halloween/2026.md", import.meta.url), "utf8");
const [, frontMatter, intro] = partyFile.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
const party = parse(frontMatter);

const expectDripEdge = ($: CheerioAPI) => {
  const edge = $("header + main > svg").first();
  expect(edge.attr("aria-hidden")).toBe("true");
  const fill = edge.find("path");
  expect(fill).toHaveLength(1);
  expect(fill.attr("d")).toBe(drips(66, 2400, 160, 18));
  expect(fill.attr("fill")).toBe(palette.trona);
};

const expectStampGhost = ($: CheerioAPI) => {
  const paths = $("header path")
    .map((_, path) => $(path).attr("d"))
    .get();
  expect(paths).not.toContain(marigoldMark(3).disc);
  const body = $("header .stamp path").filter((_, path) => $(path).attr("d") === ghost(41));
  expect(body).toHaveLength(1);
  expect(body.attr("fill")).toBe(palette.cream);
  expect(body.attr("stroke")).toBeUndefined();
  const face = body
    .siblings()
    .find("path")
    .map((_, path) => $(path).closest("[fill]").attr("fill"))
    .get();
  expect(face.sort()).toEqual([palette.mole, palette.mole, palette.cheek, palette.cheek].sort());
};

const expectHiddenDrawings = ($: CheerioAPI, atLeast: number) => {
  const drawings = $("header svg").filter((_, svg) => $(svg).parents("svg").length === 0);
  expect(drawings.length).toBeGreaterThanOrEqual(atLeast);
  drawings.each((_, svg) => {
    expect($(svg).closest("[aria-hidden='true']"), $.html(svg).slice(0, 80)).toHaveLength(1);
  });
};

// The drips overlap the top of the cream block, so the first content must start below the longest one.
const clearanceBelowDrips = ($: CheerioAPI, selector: string, phone: boolean) => {
  const value = (target: string, prop: string) => {
    let found: string | undefined;
    for (const root of pageCss($)) {
      root.walkDecls(new RegExp(`^${prop}(-top)?$`), (decl) => {
        const rule = decl.parent as { selector?: string; parent?: { type: string; params?: string } };
        const at = rule.parent?.type === "atrule" ? (rule.parent.params ?? "").replace(/\s+/g, "") : "";
        if (
          (phone ? /760px/.test(at) : at === "") &&
          rule.selector?.replace(/\[data-astro-cid-[^\]]+\]/g, "") === target
        )
          found = decl.value.split(/\s+/)[0];
      });
    }
    return parseFloat(found ?? "NaN");
  };
  return value(selector, "padding") - value(".drips", "height");
};

describe("built Trick-R-Drink recap", () => {
  let $: CheerioAPI;
  beforeAll(() => {
    $ = builtPage("halloween/2026/index.html");
  });

  it("has one h1 reading TRICK-R-DRINK", () => {
    expect($("h1")).toHaveLength(1);
    // The line break sits after a hyphen, so the name reads whole without it.
    expect($("h1").text().trim()).toBe("TRICK-R-DRINK");
  });

  // Highlights are h3s so a screen reader can jump from one to the next.
  it("runs its headings as the h1, then an h2 per section, with an h3 per highlight", () => {
    const headings = $("h1, h2, h3, h4, h5, h6")
      .map((_, h) => `${h.tagName} ${$(h).text().trim()}`)
      .get();
    expect(headings).toEqual([
      "h1 TRICK-R-DRINK",
      "h2 Our costumes",
      "h2 The costume contest",
      "h2 The drinks",
      "h2 New this year",
      "h3 The Wanted Wall",
      "h3 The garage",
      "h2 The invite",
    ]);
  });

  const section = (heading: string) =>
    $("h2")
      .filter((_, h) => $(h).text().trim() === heading)
      .closest("section");

  it("subtitles the hero with the party's theme and opens with the intro", () => {
    expect($("header p").filter((_, p) => $(p).text().trim() === "Our tiki Halloween")).toHaveLength(1);
    expect(readText($, "main")).toContain(intro.trim());
  });

  it("dates the party under the subtitle, readable by machines too", () => {
    const day = $("header time");
    expect(day).toHaveLength(1);
    expect(day.attr("datetime")).toBe("2026-10-17");
    expect(day.text().trim()).toBe("Saturday, October 17, 2026");
  });

  it("captions each of our costumes with who and what, from the party file", () => {
    const captions = section("Our costumes")
      .find("figcaption")
      .map((_, c) => readText($, c))
      .get();
    expect(captions).toEqual(party.ourCostumes.map((c: { who: string; as: string }) => `${c.who} as ${c.as}`));
  });

  // Without lang a screen reader says it with an English voice.
  it("marks payasas as Spanish", () => {
    expect($("[lang='es']").filter((_, el) => $(el).text().trim() === "payasas")).toHaveLength(1);
  });

  it("states the contest rule and result and lists each winner with their costume", () => {
    const contest = readText($, section("The costume contest"));
    expect(contest).toContain(party.contest.rule);
    expect(contest).toContain(party.contest.result);
    const winners = section("The costume contest")
      .find("li")
      .map((_, li) => readText($, li))
      .get();
    expect(winners).toEqual(
      party.contest.winners.map((w: { names: string; costume: string }) => `${w.names} as ${w.costume}`),
    );
  });

  it("names the drinks and who made them", () => {
    const drinks = readText($, section("The drinks"));
    for (const drink of party.drinks.names) expect(drinks).toContain(drink);
    expect(drinks).toContain(`Made by ${party.drinks.by}.`);
  });

  it("tells each highlight under its title", () => {
    const highlights = section("New this year")
      .find("li")
      .map((_, li) => [[$(li).find("h3").text().trim(), readText($, $(li).find("p"))]])
      .get();
    expect(highlights).toEqual(party.highlights.map((h: { title: string; text: string }) => [h.title, h.text]));
  });

  it("shows each photo from the party file on the item it shows, with its alt text", () => {
    const alts = (heading: string) =>
      section(heading)
        .find("img")
        .map((_, img) => $(img).attr("alt") ?? "")
        .get();
    const fromFile = (items: { photo?: { alt: string } }[]) =>
      items.flatMap((item) => (item.photo ? [item.photo.alt] : []));
    expect(alts("Our costumes")).toEqual(fromFile(party.ourCostumes));
    expect(alts("New this year")).toEqual(fromFile(party.highlights));
    expect(
      $("img")
        .map((_, img) => $(img).attr("alt"))
        .get()
        .filter((alt) => !alt?.trim()),
    ).toEqual([]);
  });

  // Keyed to the photo itself, so adding or dropping another photo never reshapes this one.
  it("clips each petal photo with the mask seeded by its own file name", () => {
    type Photo = { src: string; alt: string; shape?: string };
    const petals: Photo[] = [...party.ourCostumes, ...party.highlights, party.contest, party.drinks].flatMap(
      (item: { photo?: Photo } | undefined) => (item?.photo && item.photo.shape !== "circle" ? [item.photo] : []),
    );
    expect(petals.length).toBeGreaterThan(0);
    for (const photo of petals) {
      const img = $("img").filter((_, el) => $(el).attr("alt") === photo.alt);
      const id = img.attr("style")?.match(/url\(#([^)]+)\)/)?.[1] ?? "";
      expect($(`svg [id='${id}'] path`).attr("d"), photo.alt).toBe(marigoldMask(petalSeed(photo.src)));
    }
  });

  it("names the party in the title and the link preview title", () => {
    expect($("head title").text()).toBe("Trick-R-Drink · The DnA Casa");
    expect($("head meta[property='og:title']").attr("content")).toBe("Trick-R-Drink · The DnA Casa");
  });

  // A recap shared in a message should look like that party, not like the home page.
  it("points its link preview at its own 1200x630 PNG that exists", async () => {
    const image = $("head meta[property='og:image']").attr("content") ?? "";
    expect(image).toMatch(/^https:\/\/thedna\.casa\/.+\.png$/);
    expect(image).not.toBe("https://thedna.casa/share.png");
    const path = new URL(image).pathname;
    expect(builtFileExists(path), path).toBe(true);
    const { width, height, format } = await sharp(builtFilePath(path)).metadata();
    expect({ width, height, format }).toEqual({ width: 1200, height: 630, format: "png" });
  });

  it("paints its link preview as a cream ghost over a wide line of words on Trona black", async () => {
    const path = new URL($("head meta[property='og:image']").attr("content") ?? "").pathname;
    const { data, info } = await sharp(builtFilePath(path)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const hex = (x: number, y: number) => {
      const i = (y * info.width + x) * 3;
      return `#${[data[i], data[i + 1], data[i + 2]].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
    };
    const creamColumns = (top: number, bottom: number) => {
      const xs = new Set<number>();
      for (let y = top; y < bottom; y++)
        for (let x = 0; x < info.width; x++) if (hex(x, y) === palette.cream) xs.add(x);
      return xs.size ? Math.max(...xs) - Math.min(...xs) : 0;
    };
    expect([hex(0, 0), hex(1199, 629)]).toEqual([palette.trona, palette.trona]);
    expect(creamColumns(0, 315)).toBeGreaterThan(150);
    expect(creamColumns(0, 315)).toBeLessThan(400);
    expect(creamColumns(315, 630)).toBeGreaterThan(700);
  });

  it("describes its link preview image by the party's name and year", () => {
    expect($("head meta[property='og:image:alt']").attr("content")).toBe(
      "A cream ghost over TRICK-R-DRINK · HALLOWEEN 2026 on Trona black",
    );
  });

  // The stamp belongs to Halloween as a whole, so a party never gets its own mark or ring words.
  it("opens with only the title, theme and squiggle: no stamp, ring or ghost", () => {
    expect($("header .stamp, header svg text")).toHaveLength(0);
    expect($("header path").filter((_, path) => $(path).attr("d") === ghost(41))).toHaveLength(0);
  });

  it("hides the hero's drawings from assistive tech", () => {
    expectHiddenDrawings($, 1);
  });

  it("hangs the Trona drip edge into the cream under the hero, hidden from assistive tech", () => {
    expectDripEdge($);
  });

  it("runs the drips down once on load, in half a second at most, only without a reduced-motion preference", () => {
    const edge = $("header + main > svg").first();
    const runs: { decls: Record<string, string>; guards: string[] }[] = [];
    for (const root of pageCss($)) {
      root.walkRules((rule) => {
        const plain = rule.selector.replace(/\[data-astro-cid-[^\]]+\]/g, "").replace(/:where\(\.astro-[^)]+\)/g, "");
        const decls: Record<string, string> = {};
        rule.walkDecls(/^animation/, (decl) => void (decls[decl.prop] = decl.value));
        if (!Object.keys(decls).length || !edge.is(plain)) return;
        const guards: string[] = [];
        for (let node = rule.parent; node; node = node.parent as typeof node) {
          if (node.type === "atrule" && (node as { name: string }).name === "media")
            guards.push((node as { params: string }).params.replace(/\s+/g, ""));
        }
        runs.push({ decls, guards });
      });
    }
    expect(runs).toHaveLength(1);
    const [{ decls, guards }] = runs;
    // The minifier folds a shorthand into a form Chrome can reject, so the drips keep to longhands like the scroll fades.
    expect(decls.animation).toBeUndefined();
    expect(decls["animation-name"]).toBeTruthy();
    expect(
      parseFloat(decls["animation-duration"]) * (decls["animation-duration"].endsWith("ms") ? 0.001 : 1),
    ).toBeLessThanOrEqual(0.5);
    expect(decls["animation-iteration-count"] ?? "1").toBe("1");
    expect(guards).toContainEqual(expect.stringContaining("(prefers-reduced-motion:no-preference)"));
  });

  it.each([
    ["desktop", false],
    ["phone", true],
  ])("starts the intro below the drips on %s", (_, phone) => {
    expect(clearanceBelowDrips($, ".intro", phone)).toBeGreaterThanOrEqual(24);
  });

  it("tints the phone's browser chrome Trona black", () => {
    expect($("head meta[name='theme-color']").attr("content")).toBe("#201d1e");
  });

  it("signs off in the footer with Con cariño and the build year", () => {
    expect(readText($, "footer")).toBe(`Con cariño · © ${new Date().getFullYear()} The DnA Casa`);
  });

  // Browsers without scroll-driven animation must show every section still, never stuck invisible.
  it("fades sections up on scroll only where the browser supports scroll timelines", () => {
    const reveals: string[] = [];
    for (const root of pageCss($)) {
      // A timeline folded into the animation shorthand is dropped as invalid by Chrome, so only the longhand counts.
      root.walkDecls("animation-timeline", (decl) => {
        const supports = [];
        for (let node = decl.parent; node; node = node.parent as typeof node) {
          if (node.type === "atrule" && (node as { name: string }).name === "supports")
            supports.push((node as { params: string }).params);
        }
        if (/view\(/.test(decl.value) && supports.some((s) => s.includes("animation-timeline")))
          reveals.push(decl.parent?.toString().split("{")[0].trim() ?? "");
      });
    }
    expect(reveals.length).toBeGreaterThan(0);
    const revealed = reveals
      .map((selector) => $(selector.replace(/\[data-astro-cid-[^\]]+\]/g, "")).length)
      .reduce((a, b) => a + b, 0);
    expect(revealed).toBeGreaterThanOrEqual(5);
  });
});

const partyData = (year: number) =>
  parse(
    readFileSync(new URL(`../src/content/halloween/${year}.md`, import.meta.url), "utf8").match(
      /^---\n([\s\S]*?)\n---\n/,
    )?.[1] ?? "",
  );

describe("built recap with an invite", () => {
  let $: CheerioAPI;
  const invited = partyData(2024);
  beforeAll(() => {
    $ = builtPage("halloween/2024/index.html");
  });
  const section = (heading: string) =>
    $("h2")
      .filter((_, h) => $(h).text().trim() === heading)
      .closest("section");

  // The winners with the trophy belong with the contest, and the bar with the drinks, not under what was new.
  it("shows the winners' photo in the contest and the bar's photo in the drinks", () => {
    const alts = (heading: string) =>
      section(heading)
        .find("img")
        .map((_, img) => $(img).attr("alt"))
        .get();
    expect(alts("The costume contest")).toEqual([invited.contest.photo.alt]);
    expect(alts("The drinks")).toEqual([invited.drinks.photo.alt]);
    expect(alts("New this year")).not.toContain(invited.contest.photo.alt);
    expect(alts("New this year")).not.toContain(invited.drinks.photo.alt);
  });

  it("closes with The invite, after New this year", () => {
    const sections = $("main > section h2")
      .map((_, h) => $(h).text().trim())
      .get();
    expect(sections.slice(-2)).toEqual(["New this year", "The invite"]);
  });

  // An invite is mostly words, so a petal or circle mask would cut them off.
  it("shows the invite whole, with its alt text from the party file", () => {
    const img = $("h2")
      .filter((_, h) => $(h).text().trim() === "The invite")
      .closest("section")
      .find("img");
    expect(img).toHaveLength(1);
    expect(img.attr("alt")).toBe(invited.invite.alt);
    expect(img.attr("style") ?? "").not.toMatch(/clip-path/);
  });
});

describe("built recap known only from its invite", () => {
  it("skips the sections it has nothing for and keeps the hero and the intro", () => {
    const $ = builtPage("halloween/2021/index.html");
    expect(readText($, "h1")).toBe("HALLOWEEN COSTUME PARTY");
    expect($("header time").attr("datetime")).toBe("2021-10-23");
    expect(
      $("main h2")
        .map((_, h) => $(h).text().trim())
        .get(),
    ).toEqual(["The invite"]);
    expect(readText($, "main")).toContain("It was a potluck, everyone brought Mexican food");
  });

  // A banner shrunk to a card's 420px would leave its words too small to read.
  it("spreads a banner invite across the column", () => {
    const $ = builtPage("halloween/2022/index.html");
    const img = $("main img");
    const widest = Math.max(
      ...(img.attr("srcset") ?? "").split(",").map((entry) => parseInt(entry.trim().split(/\s+/)[1] ?? "0")),
    );
    expect(widest).toBeGreaterThanOrEqual(2200);
    expect(img.attr("sizes")).toContain("1100px");
  });
});

// Every party file, read straight from disk, so the list is checked against what the collection holds.
const partyDir = new URL("../src/content/halloween/", import.meta.url);
const parties = readdirSync(partyDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => parse(readFileSync(new URL(file, partyDir), "utf8").match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? ""));

describe("built Halloween list", () => {
  let $: CheerioAPI;
  beforeAll(() => {
    $ = builtPage("halloween/index.html");
  });

  const rows = () => $("main li");

  it("opens with a hero titled HALLOWEEN and October at the casa", () => {
    expect($("h1")).toHaveLength(1);
    expect($("h1").text().trim()).toBe("HALLOWEEN");
    expect($("header p").filter((_, p) => $(p).text().trim() === "October at the casa")).toHaveLength(1);
  });

  it("rings the stamp with Halloween and the household's words", () => {
    expect($("header .stamp svg text").text()).toBe("HALLOWEEN · THE DnA CASA · CON CARIÑO · ");
  });

  it("holds a still cream ghost in the stamp ring instead of the Beso", () => {
    expectStampGhost($);
  });

  it("hides the hero's drawings from assistive tech", () => {
    expectHiddenDrawings($, 3);
  });

  it("hangs the Trona drip edge into the cream under the hero, hidden from assistive tech", () => {
    expectDripEdge($);
  });

  it.each([
    ["desktop", false],
    ["phone", true],
  ])("starts the parties below the drips on %s", (_, phone) => {
    expect(clearanceBelowDrips($, "section", phone)).toBeGreaterThanOrEqual(24);
  });

  it("is titled Halloween in the tab and the link preview", () => {
    expect($("head title").text()).toBe("Halloween · The DnA Casa");
    expect($("head meta[property='og:title']").attr("content")).toBe("Halloween · The DnA Casa");
  });

  it("keeps the site's link preview image", () => {
    expect($("head meta[property='og:image']").attr("content")).toBe("https://thedna.casa/share.png");
    expect($("head meta[property='og:image:alt']").attr("content")).toBe(
      "The DnA Casa's sun-and-moon mark on mole brown",
    );
  });

  it("has one row per party, newest first, each one link to its recap", () => {
    const years = parties.map((p: { year: number }) => p.year).sort((a: number, b: number) => b - a);
    expect(
      rows()
        .map((_, li) => [[$(li).find("a").length, $(li).find("a").attr("href")]])
        .get(),
    ).toEqual(years.map((y: number) => [1, `/halloween/${y}/`]));
  });

  // The row's words already name the party, so the thumbnail is decoration and must stay silent.
  it("shows each party's year, name, theme and date, with a circle thumbnail", () => {
    const newest = [...parties].sort((a: { year: number }, b: { year: number }) => b.year - a.year);
    expect(
      rows()
        .map((_, li) => readText($, li))
        .get(),
    ).toEqual(
      newest.map(
        (p: { year: number; name: string; theme: string; date: string }) =>
          `${p.year} ${p.name} A ${p.theme} Halloween ${new Date(p.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}`,
      ),
    );
    rows().each((_, li) => {
      expect($(li).find("a img")).toHaveLength(1);
      expect($(li).find("a img").attr("alt")).toBe("");
    });
  });
});
