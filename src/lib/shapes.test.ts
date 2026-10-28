import { parsePathString } from "svg-path-commander/util";
import { describe, expect, it } from "vitest";
import { marigoldMask, sparkle, wave } from "./shapes";

const expectWellFormed = (d: string) => {
  const segments = parsePathString(d);
  expect(segments[0][0]).toBe("M");
  for (const [, ...params] of segments) for (const n of params) expect(Number.isFinite(n)).toBe(true);
};

const generators: [string, (seed: number) => string][] = [
  ["wave", (seed) => wave(seed, 1440, 80, 2)],
  ["sparkle", (seed) => sparkle(seed)],
  ["marigoldMask", (seed) => marigoldMask(seed)],
];

describe.each(generators)("%s", (_, generate) => {
  it("gives byte-identical path data for the same seed", () => {
    const first = generate(232);
    expect(first).toMatch(/^M/);
    expect(generate(232)).toBe(first);
  });

  it("gives a different path for a different seed", () => {
    expect(generate(233)).not.toBe(generate(232));
  });

  it("is well-formed path data with no NaN or Infinity", () => {
    expectWellFormed(generate(232));
  });
});

describe("wave", () => {
  it.each([
    ["zero bumps", [232, 1440, 80, 0]],
    ["zero size", [232, 0, 0, 2]],
  ] as const)("stays finite with %s", (_, args) => {
    expectWellFormed(wave(...args));
  });
});
