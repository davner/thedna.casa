import { describe, expect, it } from "vitest";
import { newestFirst, partyDate, photoSeed } from "./parties";

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

describe("photoSeed", () => {
  it("depends only on the photo's file name, not the folder it sits in", () => {
    expect(photoSeed("../../assets/photos/halloween/2026/garage.jpg")).toBe(photoSeed("garage.jpg"));
  });

  it("gives each of the 2026 photos a different whole-number seed", () => {
    const seeds = ["costumes-dan-alexis.jpg", "wanted-wall.jpg", "garage.jpg"].map(photoSeed);
    expect(new Set(seeds).size).toBe(3);
    for (const seed of seeds) expect(Number.isInteger(seed)).toBe(true);
  });
});

describe("partyDate", () => {
  it("writes a party's day long for the recap, short for the list, and as a machine date", () => {
    expect(partyDate(new Date("2024-10-26"))).toEqual({
      datetime: "2024-10-26",
      long: "Saturday, October 26, 2024",
      short: "Sat, Oct 26",
    });
  });

  // A bare YAML date is midnight UTC, which is still the day before west of Greenwich.
  it("keeps the calendar day whatever the build machine's time zone", () => {
    const zone = process.env.TZ;
    process.env.TZ = "America/Los_Angeles";
    try {
      expect(partyDate(new Date("2026-10-17")).long).toBe("Saturday, October 17, 2026");
    } finally {
      process.env.TZ = zone;
    }
  });
});
