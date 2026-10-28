import { describe, expect, it } from "vitest";
import { builtPage, shippedPages } from "./site";

describe("shipped pages", () => {
  it("include no prototype route", () => {
    expect(shippedPages().filter((page) => /prototype/i.test(page))).toEqual([]);
  });

  it("carry no prototype variant switcher", () => {
    for (const page of shippedPages()) {
      const $ = builtPage(page);
      expect($(".proto-switcher, [aria-label*='variant switcher' i]"), page).toHaveLength(0);
    }
  });
});
