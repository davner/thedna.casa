import { serif } from "./serif";

// Tailwind's text steps in px, smallest first, so a title can only ever take a size from Tailwind's scale.
const steps = { "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128 } as const;
type Step = keyof typeof steps;
const order = Object.keys(steps) as Step[];

const phoneDisplay: Step = "5xl";

// The display size at each Tailwind breakpoint, at the breakpoint's own width, and the site gutter there.
const breakpoints = [
  { prefix: "md", width: 768, display: "7xl", gutter: 48 },
  { prefix: "lg", width: 1024, display: "8xl", gutter: 64 },
  { prefix: "xl", width: 1280, display: "9xl", gutter: 80 },
  { prefix: "2xl", width: 1536, display: "9xl", gutter: 80 },
] as const;

// The narrowest phone the site is tested at, with the hero's 20px gutters.
const phone = 360;
export const phoneTitleRoom = phone - 2 * 20;

// The hero's tracking: tight on phones, tighter from md, where the sizes are larger.
const phoneTracking = -0.025;
const wideTracking = -0.05;

const ems = (line: string, tracking: number) =>
  serif.layout(line).advanceWidth / serif.unitsPerEm + tracking * [...line].length;

export const phoneTitleWidth = (line: string) => ems(line, phoneTracking) * steps[phoneDisplay];

// Lines are fixed at build time so every screen breaks the name in the same places.
export const heroTitleLines = (name: string): string[] => {
  const pieces = name.split(/(?<=-)|\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const piece of pieces) {
    const last = lines.at(-1);
    const joined = last === undefined ? piece : last.endsWith("-") ? last + piece : `${last} ${piece}`;
    if (last !== undefined && phoneTitleWidth(joined) <= phoneTitleRoom) lines[lines.length - 1] = joined;
    else lines.push(piece);
  }
  return lines;
};

// Mirrors the hero at a breakpoint's narrowest width: gutters and a gap of the site gutter, and a stamp or invite
// slot of 34% of the inner width, capped at 384px, beside the words. The e2e hero checks catch this drifting from the CSS.
const column = ({ width, gutter }: (typeof breakpoints)[number], layout: "beside" | "full") => {
  const inner = width - 2 * gutter;
  return layout === "full" ? inner : inner - gutter - Math.min(384, 0.34 * inner);
};

const below = (step: Step) => order[Math.max(0, order.indexOf(step) - 1)];

// A word too wide to break steps the phone title down one size just for that party.
export const heroTitleSize = (lines: string[], layout: "beside" | "full") => {
  const phoneStep = Math.max(0, ...lines.map(phoneTitleWidth)) <= phoneTitleRoom ? phoneDisplay : below(phoneDisplay);
  const widest = Math.max(0, ...lines.map((line) => ems(line, wideTracking)));
  const classes = [`text-${phoneStep}`];
  let current: Step = phoneStep;
  for (const breakpoint of breakpoints) {
    const { prefix, display } = breakpoint;
    let step: Step = display;
    while (step !== order[0] && widest * steps[step] > column(breakpoint, layout)) step = below(step);
    if (step !== current) classes.push(`${prefix}:text-${step}`);
    current = step;
  }
  return classes.join(" ");
};
