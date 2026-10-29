import { describe, expect, it } from "vitest";
import { newestFirst, petalSeed } from "./parties";

describe("newestFirst", () => {
  it("orders parties by year, newest first, whatever order they arrive in", () => {
    const parties = [2025, 2027, 2026].map((year) => ({ data: { year } }));
    expect(newestFirst(parties).map((p) => p.data.year)).toEqual([2027, 2026, 2025]);
  });

  it("leaves the collection it was given in its own order", () => {
    const parties = [2025, 2027].map((year) => ({ data: { year } }));
    newestFirst(parties);
    expect(parties.map((p) => p.data.year)).toEqual([2025, 2027]);
  });
});

describe("petalSeed", () => {
  it("depends only on the photo's file name, not the folder it sits in", () => {
    expect(petalSeed("../../assets/photos/halloween/2026/garage.jpg")).toBe(petalSeed("garage.jpg"));
  });

  it("gives each of the 2026 photos a different whole-number seed", () => {
    const seeds = ["costumes-dan-alexis.jpg", "wanted-wall.jpg", "garage.jpg"].map(petalSeed);
    expect(new Set(seeds).size).toBe(3);
    for (const seed of seeds) expect(Number.isInteger(seed)).toBe(true);
  });
});
