import { parsePathString } from "svg-path-commander/util";
import { describe, expect, it } from "vitest";
import { wave } from "./shapes";

const expectWellFormed = (d: string) => {
  const segments = parsePathString(d);
  expect(segments[0][0]).toBe("M");
  for (const [, ...params] of segments) for (const n of params) expect(Number.isFinite(n)).toBe(true);
};

describe("wave", () => {
  it("gives byte-identical path data for the same seed", () => {
    const first = wave(232, 1440, 80, 2);
    expect(first).toMatch(/^M/);
    expect(wave(232, 1440, 80, 2)).toBe(first);
  });

  it("gives a different path for a different seed", () => {
    expect(wave(233, 1440, 80, 2)).not.toBe(wave(232, 1440, 80, 2));
  });

  it.each([
    ["the page's wave", [232, 1440, 80, 2]],
    ["zero bumps", [232, 1440, 80, 0]],
    ["zero size", [232, 0, 0, 2]],
  ] as const)("is well-formed path data with no NaN or Infinity: %s", (_, args) => {
    expectWellFormed(wave(...args));
  });
});
