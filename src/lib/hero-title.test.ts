import { describe, expect, it } from "vitest";
import { heroTitleLines, phoneTitleRoom, phoneTitleWidth } from "./hero-title";

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
