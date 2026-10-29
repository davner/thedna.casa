import { curveCatmullRom, curveCatmullRomClosed, line as d3line } from "d3-shape";
import { getStroke } from "perfect-freehand";
import { createNoise2D } from "simplex-noise";

export type Pt = [number, number];

// Hand-written because the shapes approved in the prototype came from this exact generator; another would redraw them.
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

// Nudged in or out a little around an ellipse, so eyes and cheeks are never perfect circles.
export const dot = (seed: number, cx: number, cy: number, rx: number, ry = rx): string => {
  const noise = createNoise2D(mulberry32(seed));
  const pts: Pt[] = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    const k = 1 + 0.07 * noise(Math.cos(a), Math.sin(a));
    return [cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)];
  });
  return smooth(pts, true);
};

// Sampled to points rather than d3's curve path, because the approved ghost was a polygon through these samples.
const catmullRom = (pts: Pt[], perSegment: number): Pt[] => {
  const n = pts.length;
  return pts.flatMap((_, i) => {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    return Array.from({ length: perSegment }, (_, k): Pt => {
      const t = k / perSegment;
      const at = (j: 0 | 1) =>
        0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t ** 2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t ** 3);
      return [at(0), at(1)];
    });
  });
};

const polygon = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

// A dome over a scalloped hem in a 100-unit box; the settings Dan picked in the prototype, so changing any redraws the approved ghost.
export const ghost = (seed: number): string => {
  const noise = createNoise2D(mulberry32(seed));
  const dome: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI + (i / 8) * Math.PI;
    return [50 + 34 * Math.cos(a), 50 + 40 * Math.sin(a)];
  });
  const hem: Pt[] = [[85, 76], [87, 100], [86, 112], [75, 101], [63, 113], [51, 102], [39, 113], [27, 101], [15, 111], [13, 98], [15, 74]];
  const pts: Pt[] = [...dome, ...hem].map(([x, y], i) => [x + noise(i * 0.5, 1) * 2.2, y + noise(1, i * 0.5) * 2.2]);
  return polygon(catmullRom(pts, 6));
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

export const menuStrokes = (seed: number): string[] => {
  const brush = brusher(seed, 0.5);
  return [12, 20, 28].map((y) => brush.stroke(line([6, y], [34, y + 0.5], 10), 4.5));
};

// The Beso settings Dan picked in the prototype; changing any of them redraws the approved logo.
const roughness = 0.5;
const petalScale = 0.72;
const moonThinness = 0.2;
const sunScale = 0.8;

const sunCenter: Pt = [240, 160];
const discRadius = 80;
const petalRings = [
  { count: 14, offset: 0, reach: 152, width: 11 },
  { count: 14, offset: 12.9, reach: 130, width: 11 },
  { count: 14, offset: 6.4, reach: 106, width: 10 },
];
const scallops = 3;

// A petal fans out from the disc and ends in a scalloped tip; jitter keeps the fourteen in a ring from matching.
const ruffle = (jitter: (amount: number) => number, r0: number, r1: number, deg: number, halfWidth: number): string => {
  const [cx, cy] = sunCenter;
  const tipR = r1 * (1 + jitter(0.07));
  const d0 = deg + jitter(3);
  const w = halfWidth * (1 + jitter(0.2));
  const spread = w * 1.45;
  const [sx, sy] = polar(cx, cy, r0, d0 - w * 0.7);
  const [ex, ey] = polar(cx, cy, r0, d0 + w * 0.7);
  const mid = r0 + (tipR - r0) * 0.5;
  const [lx, ly] = polar(cx, cy, mid, d0 - spread * 1.05);
  const [rx, ry] = polar(cx, cy, mid, d0 + spread * 1.05);
  const tips = Array.from({ length: scallops + 1 }, (_, k) => {
    const a = d0 - spread + (2 * spread * k) / scallops;
    const edge = k === 0 || k === scallops ? 0.9 : 0.96 + jitter(0.03);
    return polar(cx, cy, tipR * edge, a);
  });
  let d = `M${sx} ${sy} Q${lx} ${ly} ${tips[0][0]} ${tips[0][1]}`;
  for (let k = 0; k < scallops; k++) {
    const a = d0 - spread + (2 * spread * (k + 0.5)) / scallops;
    const [qx, qy] = polar(cx, cy, tipR * (1.07 + jitter(0.03)), a);
    d += ` Q${qx} ${qy} ${tips[k + 1][0]} ${tips[k + 1][1]}`;
  }
  return d + ` Q${rx} ${ry} ${ex} ${ey} Z`;
};

const sunDisc = (noise: (x: number, y: number) => number): string => {
  const [cx, cy] = sunCenter;
  const pts: Pt[] = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = discRadius * (1 + noise(Math.cos(a) * 1.3, Math.sin(a) * 1.3) * 0.045 * roughness);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return smooth(pts, true);
};

// The moon's outer edge is an arc from its top tip to its bottom tip; thinness flattens the arc's bulge into a crescent.
const moon = (noise: (x: number, y: number) => number): string => {
  const top: Pt = [188, 140];
  const bottom: Pt = [232, 350];
  const chord = Math.hypot(bottom[0] - top[0], bottom[1] - top[1]);
  const along: Pt = [(bottom[0] - top[0]) / chord, (bottom[1] - top[1]) / chord];
  const bulge = 173.7 * (1 - moonThinness);
  const radius = (chord ** 2 / 4 + bulge ** 2) / (2 * bulge);
  const centerX = (top[0] + bottom[0]) / 2 - along[1] * (bulge - radius);
  const centerY = (top[1] + bottom[1]) / 2 + along[0] * (bulge - radius);
  const from = (Math.atan2(top[1] - centerY, top[0] - centerX) * 180) / Math.PI;
  let to = (Math.atan2(bottom[1] - centerY, bottom[0] - centerX) * 180) / Math.PI;
  while (to > from) to -= 360;
  const steps = 14;
  const outer: Pt[] = Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    const edge = i === 0 || i === steps ? 0 : noise(i * 0.45, 3.1) * 0.05 * roughness;
    return [centerX + radius * (1 + edge) * Math.cos(a), centerY + radius * (1 + edge) * Math.sin(a)];
  });
  outer[0] = top;
  outer[steps] = bottom;
  return (
    smooth(outer, false) +
    " C206 346 190 338 192 324 C193 312 182 310 186 302 C190 296 180 294 184 288 C180 282 176 278 186 272 C198 266 206 262 200 254 C192 244 172 240 172 228 C171 205 172 170 188 140 Z"
  );
};

// The strokes are drawn in one fixed order, because each brush stroke takes the next noise row.
const faces = (brush: ReturnType<typeof brusher>) => ({
  browNose: brush.stroke(join(quad([198, 141], [213, 128], [230, 138]), quad([230, 138], [236, 142], [236, 152], 5), line([236, 152], [236, 176]), quad([236, 176], [236, 182], [230, 182], 4))),
  brow: brush.stroke(quad([282, 141], [267, 128], [250, 138])),
  eyeL: brush.stroke(quad([206, 156], [216, 164], [226, 156], 8), 5.5),
  eyeR: brush.stroke(quad([252, 156], [262, 164], [272, 156], 8), 5.5),
  lips: brush.shape(join(quad([222, 198], [240, 189], [258, 198], 6), quad([258, 198], [240, 213], [222, 198], 6)).slice(0, -1)),
  moonEye: brush.stroke(quad([140, 224], [152, 232], [164, 224], 8), 5.5),
  moonBrow: brush.stroke(quad([136, 210], [150, 200], [166, 208], 8), 5.5),
});

export const marigoldMark = (seed: number) => {
  const rand = mulberry32(seed);
  const jitter = (amount: number) => (rand() * 2 - 1) * amount * roughness;
  const noise = createNoise2D(mulberry32(seed + 99));
  const [cx, cy] = sunCenter;
  const reach = (r1: number) => discRadius + (r1 - discRadius) * petalScale;
  const petals = petalRings.map((ring) =>
    Array.from({ length: ring.count }, (_, i) => ruffle(jitter, discRadius - 10, reach(ring.reach), ring.offset + (i * 360) / ring.count, ring.width)),
  );
  const disc = sunDisc(noise);
  const moonPath = moon(noise);
  const faceScale = discRadius / 82;
  const sunShift = (1 - sunScale) * 50;
  const sunLift = 25 + (1 - petalScale) * 50;
  return {
    petals,
    disc,
    moon: moonPath,
    face: faces(brusher(seed + 7, 1.1)),
    sunTransform: `translate(${sunShift} ${sunLift}) translate(${cx} ${cy}) scale(${sunScale}) translate(${-cx} ${-cy})`,
    faceTransform: `translate(${cx} ${cy}) scale(${faceScale}) translate(${-cx} ${-cy})`,
  };
};

// A hanging edge in a w by h box: each drip is a neck with a round bulb and flared shoulders, written as a height for every x.
export const drips = (seed: number, w: number, h: number, count: number): string => {
  const rand = mulberry32(seed);
  const noise = createNoise2D(mulberry32(seed + 1));
  const base = h * 0.1;
  const slot = w / count;
  const ds = Array.from({ length: count }, (_, i) => ({
    c: (i + 0.5) * slot + (rand() - 0.5) * slot * 0.7,
    r: 5 + rand() * 7,
    len: rand() < 0.25 ? h * (0.14 + rand() * 0.1) : h * (0.35 + rand() * 0.55),
  }));
  const y = (x: number) => {
    let v = base + 4 * noise(x / 160, 0);
    for (const { c, r, len } of ds) {
      const dx = Math.abs(x - c);
      const s = r * 2.4;
      if (dx <= r) v = Math.max(v, base + len - r + Math.sqrt(r * r - dx * dx));
      else if (dx < r + s) v = Math.max(v, base + (len - r) * (1 - (dx - r) / s) ** 3);
    }
    return v;
  };
  // Kept at even 3-unit steps along the edge, so the steep necks get as many points as the flat stretches between them.
  const raw: Pt[] = Array.from({ length: Math.ceil(w) * 2 + 1 }, (_, i) => [i / 2, y(i / 2)]);
  const edge: Pt[] = [raw[0]];
  let travelled = 0;
  for (let i = 1; i < raw.length; i++) {
    travelled += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
    if (travelled >= 3) {
      edge.push(raw[i]);
      travelled = 0;
    }
  }
  return `M0 0L${edge.map(([x, v]) => `${x.toFixed(1)} ${v.toFixed(1)}`).join("L")}L${w} 0Z`;
};
