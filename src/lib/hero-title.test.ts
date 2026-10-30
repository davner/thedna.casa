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

  // Beside the stamp the column is 396px at md, 527px at lg, 659px at xl and 912px at 2xl; HALLOWEEN is 6.22em wide.
  it("picks the largest step at each breakpoint whose longest line fits the column", () => {
    expect(heroTitleSize(["HALLOWEEN"], "beside")).toBe("text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl");
  });

  it("gives a title the whole hero's width when nothing sits beside it", () => {
    expect(heroTitleSize(["HALLOWEEN"], "full")).toBe("text-5xl md:text-7xl lg:text-8xl xl:text-9xl");
  });

  it("steps a phone title down exactly one size when a word is too wide to break", () => {
    expect(heroTitleSize(["HAUNTED", "HOMECOMING"], "full").split(" ")[0]).toBe("text-4xl");
  });
});
