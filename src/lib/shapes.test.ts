import { describe, expect, it } from "vitest";
import { wave } from "./shapes";

describe("wave", () => {
  it("gives byte-identical path data for the same seed", () => {
    const first = wave(232, 1440, 80, 2);
    expect(first).toMatch(/^M/);
    expect(wave(232, 1440, 80, 2)).toBe(first);
  });
});
