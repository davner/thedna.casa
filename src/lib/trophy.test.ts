import { describe, expect, it } from "vitest";
import { plates } from "./trophy";

const party = (year: number, winners: { names: string; costume: string }[] | undefined) => ({
  data: { year, contest: winners && { result: "", winners } },
});

describe("plates", () => {
  it("gives each winner a plate, oldest year first, the way the real base fills up", () => {
    const parties = [
      party(2023, [{ names: "Victoria", costume: "the Waterboy" }]),
      party(2021, [{ names: "Adriana", costume: "the Queen of Hearts" }]),
      party(2026, [
        { names: "Ian and Kathy", costume: "Ryu and Chun-Li, from Street Fighter" },
        { names: "Cesar and Emily", costume: "the Waterboy and H2O" },
      ]),
    ];
    expect(plates(parties)).toEqual([
      { year: 2021, names: "ADRIANA", costume: "The Queen of Hearts" },
      { year: 2023, names: "VICTORIA", costume: "The Waterboy" },
      { year: 2025, names: "LIFE", costume: "The Party Pooper" },
      { year: 2026, names: "IAN AND KATHY", costume: "Ryu and Chun-Li" },
      { year: 2026, names: "CESAR AND EMILY", costume: "The Waterboy and H2O" },
    ]);
  });

  it("skips a party with no contest yet", () => {
    expect(plates([party(2022, undefined)]).map((p) => p.year)).toEqual([2025]);
  });

  // 2025 had no party, so Life holds that plate until a real 2025 party file says otherwise.
  it("gives 2025's plate to a real 2025 winner over Life", () => {
    expect(plates([party(2025, [{ names: "Milly", costume: "a bat" }])])).toEqual([
      { year: 2025, names: "MILLY", costume: "A bat" },
    ]);
  });
});
