import { curveCatmullRom, curveCatmullRomClosed, line as d3line } from "d3-shape";
import { getStroke } from "perfect-freehand";
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

export const smooth = (pts: Pt[], closed: boolean): string => {
  const d = (closed ? closedCurve : openCurve)(pts) ?? "";
  // d3's closed curve ends back on its start point but never emits Z, so stroked joins would show a gap.
  return closed && d ? `${d}Z` : d;
};

export const wave = (seed: number, w: number, h: number, bumps: number): string => {
  const noise = createNoise2D(mulberry32(seed));
  const n = Math.max(1, bumps * 2);
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => [(i / n) * w, h * (0.5 + 0.45 * noise(i * 0.6, 0.5))]);
  return `${smooth(pts, false)}L${w},${h}L0,${h}Z`;
};

// Jitter keeps the four-point sparkle looking hand-pressed rather than ruled; it fills a 100x100 box.
export const sparkle = (seed: number): string => {
  const rand = mulberry32(seed);
  const j = (n: number) => +(n * (0.85 + rand() * 0.3)).toFixed(1);
  return `M50 ${j(2)} Q${j(56)} ${j(44)} ${100 - j(2)} 50 Q${j(56)} ${j(56)} 50 ${100 - j(2)} Q${j(44)} ${j(56)} ${j(2)} 50 Q${j(44)} ${j(44)} 50 ${j(2)} Z`;
};

// Unit-box coordinates let a viewBox of 0 0 1 1 scale the mask to any photo size.
export const marigoldMask = (seed: number): string => {
  const petals = 18;
  const depth = 0.05;
  const noise = createNoise2D(mulberry32(seed));
  const at = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(0.5 + r * Math.cos(a)).toFixed(4)} ${(0.5 + r * Math.sin(a)).toFixed(4)}`;
  };
  const step = 360 / petals;
  const valleys = Array.from({ length: petals }, (_, i) => 0.5 - depth + depth * 0.3 * noise(i, 2));
  const parts = [`M${at(0, valleys[0])}`];
  for (let i = 0; i < petals; i++) {
    const r = 0.5 + depth * 0.4 * noise(i, 1);
    const next = (i + 1) % petals;
    parts.push(`Q${at((i + 0.5) * step, r + depth * 0.6)} ${at(next * step, valleys[next])}`);
  }
  return `${parts.join(" ")} Z`;
};

// perfect-freehand returns outline points only, so midpoint quadratics join them into a smooth closed path.
const outlineToPath = (outline: number[][]): string => {
  if (!outline.length) return "";
  const r = (n: number) => +n.toFixed(1);
  const parts: (string | number)[] = ["M", r(outline[0][0]), r(outline[0][1]), "Q"];
  outline.forEach(([x0, y0], i) => {
    const [x1, y1] = outline[(i + 1) % outline.length];
    parts.push(r(x0), r(y0), r((x0 + x1) / 2), r((y0 + y1) / 2));
  });
  return `${parts.join(" ")} Z`;
};

// One brusher per drawing so each stroke gets its own noise row and no two strokes wobble alike.
export const brusher = (seed: number, wobble: number) => {
  const noise = createNoise2D(mulberry32(seed));
  let stroke = 0;
  const jitter = (pts: Pt[]): Pt[] => {
    stroke++;
    return pts.map(([x, y], i) => [x + noise(i * 0.4, stroke) * wobble, y + noise(stroke, i * 0.4) * wobble]);
  };
  return {
    stroke: (pts: Pt[], size = 6) =>
      outlineToPath(
        getStroke(jitter(pts), {
          size,
          thinning: 0.55,
          smoothing: 0.6,
          streamline: 0.35,
          simulatePressure: true,
          start: { taper: size * 1.6 },
          end: { taper: size * 1.6 },
          last: true,
        }),
      ),
    shape: (pts: Pt[]) => smooth(jitter(pts), true),
  };
};

export const brushSquiggle = (seed: number, w: number, h: number, bumps: number, size: number): string => {
  const noise = createNoise2D(mulberry32(seed + 500));
  const pts: Pt[] = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    return [size + t * (w - 2 * size), h / 2 + Math.sin(t * bumps * Math.PI * 2) * (h / 2 - size) * (0.8 + 0.2 * noise(t * 3, 1))];
  });
  return brusher(seed, 0.6).stroke(pts, size);
};

export const polar = (cx: number, cy: number, r: number, deg: number): Pt => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)];
};

export const quad = (p0: Pt, c: Pt, p1: Pt, n = 10): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
  });

export const line = (p0: Pt, p1: Pt, n = 6): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => [p0[0] + ((p1[0] - p0[0]) * i) / n, p0[1] + ((p1[1] - p0[1]) * i) / n]);

export const join = (...parts: Pt[][]): Pt[] => parts.flatMap((p, i) => (i === 0 ? p : p.slice(1)));
