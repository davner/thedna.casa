import { getPathBBox, isClosedPath, normalizePath, parsePathString } from "svg-path-commander/util";
import { describe, expect, it } from "vitest";
import { brushSquiggle, marigoldMask, sparkle, wave } from "./shapes";

const expectWellFormed = (d: string) => {
  const segments = parsePathString(d);
  expect(segments[0][0]).toBe("M");
  for (const [, ...params] of segments) for (const n of params) expect(Number.isFinite(n)).toBe(true);
};

const generators: [string, (seed: number) => string][] = [
  ["wave", (seed) => wave(seed, 1440, 80, 2)],
  ["sparkle", (seed) => sparkle(seed)],
  ["marigoldMask", (seed) => marigoldMask(seed)],
  ["brushSquiggle", (seed) => brushSquiggle(seed, 200, 24, 3, 6)],
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

describe("marigoldMask", () => {
  it.each([1, 232, 233, 9999])("is a closed path inside the unit box (seed %i)", (seed) => {
    const d = marigoldMask(seed);
    const segments = normalizePath(parsePathString(d));
    expect(isClosedPath(segments)).toBe(true);
    const [, startX, startY] = segments[0];
    expect(segments.at(-2)?.slice(-2)).toEqual([startX, startY]);
    const box = getPathBBox(d);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x2).toBeLessThanOrEqual(1);
    expect(box.y2).toBeLessThanOrEqual(1);
  });
});
