import { beforeAll, describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import type { CheerioAPI } from "cheerio";
import { parse } from "yaml";
import { builtPage, pageCss, readText } from "./site";
import { ghost, marigoldMark } from "../src/lib/shapes";
import { palette } from "../src/palette";

// The party file itself is the source of truth for the recap's words.
const partyFile = readFileSync(new URL("../src/content/halloween/2026.md", import.meta.url), "utf8");
const [, frontMatter, intro] = partyFile.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
const party = parse(frontMatter);

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
    const headings = $("h1, h2, h3, h4, h5, h6").map((_, h) => `${h.tagName} ${$(h).text().trim()}`).get();
    expect(headings).toEqual([
      "h1 TRICK-R-DRINK",
      "h2 Our costumes",
      "h2 The costume contest",
      "h2 The drinks",
      "h2 New this year",
      "h3 The Wanted Wall",
      "h3 The garage",
      "h3 Garrett and Ainsley",
    ]);
  });

  const section = (heading: string) => $("h2").filter((_, h) => $(h).text().trim() === heading).closest("section");

  it("subtitles the hero with the party's theme and opens with the intro", () => {
    expect($("header p").filter((_, p) => $(p).text().trim() === "Our tiki Halloween")).toHaveLength(1);
    expect(readText($, "main")).toContain(intro.trim());
  });

  it("captions each of our costumes with who and what, from the party file", () => {
    const captions = section("Our costumes").find("figcaption").map((_, c) => readText($, c)).get();
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
    const winners = section("The costume contest").find("li").map((_, li) => readText($, li)).get();
    expect(winners).toEqual(party.contest.winners.map((w: { names: string; costume: string }) => `${w.names} as ${w.costume}`));
  });

  it("names the drinks and who made them", () => {
    const drinks = readText($, section("The drinks"));
    for (const drink of party.drinks) expect(drinks).toContain(drink);
    expect(drinks).toContain(`Made by ${party.drinksBy}.`);
  });

  it("tells each highlight under its title", () => {
    const highlights = section("New this year").find("li").map((_, li) => [[$(li).find("h3").text().trim(), readText($, $(li).find("p"))]]).get();
    expect(highlights).toEqual(party.highlights.map((h: { title: string; text: string }) => [h.title, h.text]));
  });

  it("shows each photo from the party file on the item it shows, with its alt text", () => {
    const alts = (heading: string) => section(heading).find("img").map((_, img) => $(img).attr("alt") ?? "").get();
    const fromFile = (items: { photo?: { alt: string } }[]) => items.flatMap((item) => (item.photo ? [item.photo.alt] : []));
    expect(alts("Our costumes")).toEqual(fromFile(party.ourCostumes));
    expect(alts("New this year")).toEqual(fromFile(party.highlights));
    expect($("img").map((_, img) => $(img).attr("alt")).get().filter((alt) => !alt?.trim())).toEqual([]);
  });

  it("names the party in the title and the link preview title", () => {
    expect($("head title").text()).toBe("Trick-R-Drink · The DnA Casa");
    expect($("head meta[property='og:title']").attr("content")).toBe("Trick-R-Drink · The DnA Casa");
  });

  it("rings the stamp with the party's name and year", () => {
    expect($("header svg text").text()).toBe("TRICK-R-DRINK · HALLOWEEN 2026 · THE DnA CASA · ");
  });

  it("holds a still cream ghost in the stamp ring instead of the Beso", () => {
    const paths = $("header path").map((_, path) => $(path).attr("d")).get();
    expect(paths).not.toContain(marigoldMark(3).disc);
    const body = $("header path").filter((_, path) => $(path).attr("d") === ghost(41));
    expect(body).toHaveLength(1);
    expect(body.attr("fill")).toBe(palette.cream);
    expect(body.attr("stroke")).toBeUndefined();
    const face = body.siblings().find("path").map((_, path) => $(path).closest("[fill]").attr("fill")).get();
    expect(face.sort()).toEqual([palette.mole, palette.mole, palette.cheek, palette.cheek].sort());
  });

  it("hides the hero's drawings from assistive tech", () => {
    const drawings = $("header svg").filter((_, svg) => $(svg).parents("svg").length === 0);
    expect(drawings.length).toBeGreaterThanOrEqual(3);
    drawings.each((_, svg) => {
      expect($(svg).closest("[aria-hidden='true']"), $.html(svg).slice(0, 80)).toHaveLength(1);
    });
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
          if (node.type === "atrule" && (node as { name: string }).name === "supports") supports.push((node as { params: string }).params);
        }
        if (/view\(/.test(decl.value) && supports.some((s) => s.includes("animation-timeline"))) reveals.push(decl.parent?.toString().split("{")[0].trim() ?? "");
      });
    }
    expect(reveals.length).toBeGreaterThan(0);
    const revealed = reveals.map((selector) => $(selector.replace(/\[data-astro-cid-[^\]]+\]/g, "")).length).reduce((a, b) => a + b, 0);
    expect(revealed).toBeGreaterThanOrEqual(5);
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

  it("opens with a short hero titled HALLOWEEN, October at the casa, and no stamp ring", () => {
    expect($("h1")).toHaveLength(1);
    expect($("h1").text().trim()).toBe("HALLOWEEN");
    expect($("header p").filter((_, p) => $(p).text().trim() === "October at the casa")).toHaveLength(1);
    expect($("header svg text, .stamp")).toHaveLength(0);
  });

  it("is titled Halloween in the tab and the link preview", () => {
    expect($("head title").text()).toBe("Halloween · The DnA Casa");
    expect($("head meta[property='og:title']").attr("content")).toBe("Halloween · The DnA Casa");
  });

  it("has one row per party, newest first, each one link to its recap", () => {
    const years = parties.map((p: { year: number }) => p.year).sort((a: number, b: number) => b - a);
    expect(rows().map((_, li) => [[$(li).find("a").length, $(li).find("a").attr("href")]]).get()).toEqual(years.map((y: number) => [1, `/halloween/${y}/`]));
  });

  // The row's words already name the party, so the thumbnail is decoration and must stay silent.
  it("shows each party's year, name and theme, with a circle thumbnail", () => {
    const newest = [...parties].sort((a: { year: number }, b: { year: number }) => b.year - a.year);
    expect(rows().map((_, li) => readText($, li)).get()).toEqual(newest.map((p: { year: number; name: string; theme: string }) => `${p.year} ${p.name} A ${p.theme} Halloween`));
    rows().each((_, li) => {
      expect($(li).find("a img")).toHaveLength(1);
      expect($(li).find("a img").attr("alt")).toBe("");
    });
  });
});
