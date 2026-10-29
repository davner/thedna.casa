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
});
