import { expand } from "brace-expansion";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { heroTitleLines, heroTitleSize, phoneTitleRoom, phoneTitleWidth } from "./hero-title";

describe("heroTitleLines", () => {
  it("keeps a short name on one line", () => {
    expect(heroTitleLines("HALLOWEEN")).toEqual(["HALLOWEEN"]);
  });

  it("breaks after a hyphen and keeps the hyphen at the line end", () => {
    expect(heroTitleLines("TRICK-R-DRINK")).toEqual(["TRICK-R-", "DRINK"]);
  });

  it("breaks between words and drops the space", () => {
    expect(heroTitleLines("LET'S GET TIKI FREAKY")).toEqual(["LET'S GET", "TIKI FREAKY"]);
  });

  it("fits every line it makes inside the phone hero", () => {
    for (const name of ["TRICK-R-DRINK", "LET'S GET TIKI FREAKY", "A NIGHT IN THE HAUNTED HOUSE"]) {
      for (const line of heroTitleLines(name)) expect(phoneTitleWidth(line), line).toBeLessThanOrEqual(phoneTitleRoom);
    }
  });

  it("gives a word too wide for a phone a line of its own rather than splitting it", () => {
    expect(heroTitleLines("ANTIDISESTABLISHMENTARIANISM GHOSTS")).toEqual(["ANTIDISESTABLISHMENTARIANISM", "GHOSTS"]);
  });
});

describe("heroTitleSize", () => {
  it("keeps the display size at every breakpoint for a name that fits", () => {
    expect(heroTitleSize(["THE DnA", "CASA"], "beside")).toBe("text-5xl md:text-7xl lg:text-8xl xl:text-9xl");
  });

  // Beside the stamp the column is 396px at md, 527px at lg, 659px at xl and 912px at 2xl; HALLOWEEN is 6.00em wide.
  it("picks the largest step at each breakpoint whose longest line fits the column", () => {
    expect(heroTitleSize(["HALLOWEEN"], "beside")).toBe("text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl");
  });

  // At tighter tracking HOMECOMING is 6.80em wide: 652px at text-8xl, inside the 659px column beside the invite at xl.
  it("sets HAUNTED HOMECOMING at 96px beside its invite from xl", () => {
    expect(heroTitleSize(["HAUNTED", "HOMECOMING"], "beside")).toBe(
      "text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl",
    );
  });

  it("gives a title the whole hero's width when nothing sits beside it", () => {
    expect(heroTitleSize(["HALLOWEEN"], "full")).toBe("text-5xl md:text-7xl lg:text-8xl xl:text-9xl");
  });

  it("steps a phone title down exactly one size when a word is too wide to break", () => {
    expect(heroTitleSize(["HAUNTED", "HOMECOMING"], "full").split(" ")[0]).toBe("text-4xl");
  });
});

// Tailwind only generates the size classes global.css force-includes, so a class the model picks outside that list
// would leave the title unsized.
describe("the title sizes global.css force-includes", () => {
  const css = readFileSync(new URL("../styles/global.css", import.meta.url), "utf8");
  const listed = new Set(
    [...css.matchAll(/@source inline\(\s*"([^"]*text-[^"]*)"\s*\)/g)].flatMap(([, list]) =>
      list
        .trim()
        .split(/\s+/)
        .flatMap((item) => expand(item)),
    ),
  );
  const prefixes = ["", "md", "lg", "xl", "2xl"];
  const order = ["4xl", "5xl", "6xl", "7xl", "8xl", "9xl"];
  const largestListed = (prefix: string) =>
    order.findLast((step) => listed.has(prefix ? `${prefix}:text-${step}` : `text-${step}`));
  // A breakpoint with no class of its own keeps the size of the one below it.
  const sizeAt = (classes: string, prefix: string) => {
    const own = new Map(classes.split(" ").map((c) => [c.includes(":") ? c.split(":")[0] : "", c.split("text-")[1]]));
    return prefixes
      .slice(0, prefixes.indexOf(prefix) + 1)
      .reduce<string | undefined>((size, p) => own.get(p) ?? size, undefined);
  };

  it("holds every size the model can pick, from a one-letter title to one far too wide", () => {
    expect(listed.size).toBeGreaterThan(0);
    const picked = new Set<string>();
    for (const layout of ["beside", "full"] as const)
      for (let letters = 1; letters <= 40; letters++)
        for (const c of heroTitleSize(["W".repeat(letters)], layout).split(" ")) picked.add(c);
    expect([...picked].filter((c) => !listed.has(c))).toEqual([]);
  });

  it("tops out at the size a title that fits gets at each breakpoint", () => {
    const fits = heroTitleSize(["W"], "full");
    for (const prefix of prefixes) expect(sizeAt(fits, prefix), prefix || "phone").toBe(largestListed(prefix));
  });
});
