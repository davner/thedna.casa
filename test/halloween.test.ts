import { beforeAll, describe, expect, it } from "vitest";
import type { CheerioAPI } from "cheerio";
import { builtPage } from "./site";

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
});
