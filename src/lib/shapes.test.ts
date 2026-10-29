import { getPathBBox, isClosedPath, normalizePath, parsePathString } from "svg-path-commander/util";
import { describe, expect, it } from "vitest";
import {
  brusher,
  brushSquiggle,
  dot,
  drips,
  ghost,
  join,
  line,
  marigoldMark,
  marigoldMask,
  menuStrokes,
  pebble,
  polar,
  quad,
  wave,
} from "./shapes";

const expectWellFormed = (d: string) => {
  const segments = parsePathString(d);
  expect(segments[0][0]).toBe("M");
  for (const [, ...params] of segments) for (const n of params) expect(Number.isFinite(n)).toBe(true);
};

const generators: [string, (seed: number) => string][] = [
  ["wave", (seed) => wave(seed, 1440, 80, 2)],
  ["marigoldMask", (seed) => marigoldMask(seed)],
  ["brushSquiggle", (seed) => brushSquiggle(seed, 200, 24, 3, 6)],
  ["dot", (seed) => dot(seed, 208, 182, 10)],
  ["ghost", (seed) => ghost(seed)],
  ["drips", (seed) => drips(seed, 2400, 160, 18)],
  ["pebble", (seed) => pebble(seed, 200, 80)],
  ...[0, 1, 2].map((i): [string, (seed: number) => string] => [
    `menuStrokes stroke ${i}`,
    (seed) => menuStrokes(seed)[i],
  ]),
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
  it("stays finite with zero bumps", () => {
    expectWellFormed(wave(232, 1440, 80, 0));
  });

  it("stays finite with zero size", () => {
    expectWellFormed(wave(232, 0, 0, 2));
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

describe("dot", () => {
  it.each([
    [10, undefined],
    [6, 4],
  ])("is a closed path (rx %i, ry %s)", (rx, ry) => {
    expect(isClosedPath(parsePathString(dot(81, 208, 182, rx, ry)))).toBe(true);
  });
});

describe("pebble", () => {
  it("is a closed stone that stays inside its box", () => {
    const d = pebble(5, 200, 80);
    expect(isClosedPath(parsePathString(d))).toBe(true);
    const { x, y, x2, y2 } = getPathBBox(d);
    expect([x, y]).toEqual([expect.any(Number), expect.any(Number)]);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(x2).toBeLessThanOrEqual(200);
    expect(y2).toBeLessThanOrEqual(80);
  });

  // A squared-off stone fills its box like a slab; a lower power would pinch it to a lozenge.
  it("fills most of its box, so a label always has room inside", () => {
    const { width, height } = getPathBBox(pebble(5, 200, 80));
    expect(width).toBeGreaterThan(180);
    expect(height).toBeGreaterThan(64);
  });
});

describe("ghost", () => {
  it.each([1, 41, 9999])("is a closed path (seed %i)", (seed) => {
    expect(isClosedPath(parsePathString(ghost(seed)))).toBe(true);
  });
});

describe("drips", () => {
  it("stays finite with zero drips", () => {
    expectWellFormed(drips(66, 2400, 160, 0));
  });

  it("stays finite with zero size", () => {
    expectWellFormed(drips(66, 0, 0, 18));
  });

  it("is a closed fill path", () => {
    expect(isClosedPath(parsePathString(drips(66, 2400, 160, 18)))).toBe(true);
  });
});

describe("menuStrokes", () => {
  it("draws three strokes inside the button's 40-unit box", () => {
    const strokes = menuStrokes(71);
    expect(strokes).toHaveLength(3);
    for (const d of strokes) {
      const box = getPathBBox(d);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x2).toBeLessThanOrEqual(40);
      expect(box.y2).toBeLessThanOrEqual(40);
    }
  });
});

describe("polar", () => {
  it("measures degrees clockwise from twelve o'clock", () => {
    expect(polar(240, 160, 10, 0)).toEqual([240, 150]);
    expect(polar(240, 160, 10, 90)).toEqual([250, 160]);
    expect(polar(240, 160, 10, 180)).toEqual([240, 170]);
  });
});

describe("centerlines", () => {
  it("samples a quadratic curve from start to end, pulled toward its control", () => {
    expect(quad([0, 0], [5, 10], [10, 0], 2)).toEqual([
      [0, 0],
      [5, 5],
      [10, 0],
    ]);
  });

  it("samples a straight line in even steps", () => {
    expect(line([0, 0], [6, 3], 3)).toEqual([
      [0, 0],
      [2, 1],
      [4, 2],
      [6, 3],
    ]);
  });

  it("joins centerlines without repeating the shared point", () => {
    expect(join(line([0, 0], [2, 0], 1), line([2, 0], [2, 2], 1))).toEqual([
      [0, 0],
      [2, 0],
      [2, 2],
    ]);
  });
});

describe("brusher", () => {
  const centerline = quad([206, 156], [216, 164], [226, 156], 8);
  const lips = join(quad([222, 198], [240, 189], [258, 198], 6), quad([258, 198], [240, 213], [222, 198], 6)).slice(
    0,
    -1,
  );

  it("draws the same strokes and shapes from the same seed", () => {
    const draw = () => {
      const b = brusher(10, 1.1);
      return [b.stroke(centerline, 5.5), b.stroke(centerline), b.shape(lips)];
    };
    expect(draw()).toEqual(draw());
  });

  it("wobbles each stroke differently, even along the same centerline", () => {
    const b = brusher(10, 1.1);
    expect(b.stroke(centerline)).not.toBe(b.stroke(centerline));
  });

  it("gives well-formed strokes and closed shapes", () => {
    const b = brusher(10, 1.1);
    expectWellFormed(b.stroke(centerline));
    const shape = b.shape(lips);
    expectWellFormed(shape);
    expect(isClosedPath(parsePathString(shape))).toBe(true);
  });
});

describe("marigoldMark", () => {
  const paths = (seed: number) => {
    const mark = marigoldMark(seed);
    return [...mark.petals.flat(), mark.disc, mark.moon, ...Object.values(mark.face)];
  };

  it("draws byte-identical path data for the same seed", () => {
    expect(marigoldMark(3)).toEqual(marigoldMark(3));
  });

  it("draws a different mark for a different seed", () => {
    expect(paths(4)).not.toEqual(paths(3));
  });

  it("gives three rings of fourteen petals", () => {
    expect(marigoldMark(3).petals.map((ring) => ring.length)).toEqual([14, 14, 14]);
  });

  it.each([3, 4, 9999])("is well-formed path data with closed shapes (seed %i)", (seed) => {
    for (const d of paths(seed)) {
      expectWellFormed(d);
      expect(isClosedPath(parsePathString(d)), d.slice(0, 40)).toBe(true);
    }
  });

  it("gives transforms with finite numbers", () => {
    const { sunTransform, faceTransform } = marigoldMark(3);
    for (const t of [sunTransform, faceTransform]) expect(t).toMatch(/^(translate\([-\d. ]+\)|scale\([\d.]+\)| )+$/);
  });
});
