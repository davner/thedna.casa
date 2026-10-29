import { describe, expect, it } from "vitest";
import { newestFirst } from "./parties";

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
