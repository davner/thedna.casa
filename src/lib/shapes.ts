import { curveCatmullRom, curveCatmullRomClosed, line as d3line } from "d3-shape";
import { createNoise2D } from "simplex-noise";

export type Pt = [number, number];

// No maintained library ships a small seedable PRNG; mulberry32 is a few lines and well known.
export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// alpha 0 is uniform Catmull-Rom, the curve the prototype shapes were tuned with.
const openCurve = d3line().curve(curveCatmullRom.alpha(0)).digits(1);
const closedCurve = d3line().curve(curveCatmullRomClosed.alpha(0)).digits(1);

export const smooth = (pts: Pt[], closed: boolean): string => (closed ? closedCurve : openCurve)(pts) ?? "";

export const wave = (seed: number, w = 1440, h = 60, bumps = 6): string => {
  const noise = createNoise2D(mulberry32(seed));
  const n = Math.max(1, bumps * 2);
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => [(i / n) * w, h * (0.5 + 0.45 * noise(i * 0.6, 0.5))]);
  return `${smooth(pts, false)}L${w},${h}L0,${h}Z`;
};
