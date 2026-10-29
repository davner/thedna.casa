import { serif } from "./serif";

// Tailwind's text steps in px, smallest first, so a title can only ever take a size from Tailwind's scale.
const steps = { "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128 } as const;
type Step = keyof typeof steps;
const order = Object.keys(steps) as Step[];

const phoneDisplay: Step = "5xl";

// The display size at each Tailwind breakpoint, at the breakpoint's own width.
const breakpoints = [
  { prefix: "md", width: 768, display: "7xl" },
  { prefix: "lg", width: 1024, display: "8xl" },
  { prefix: "xl", width: 1280, display: "9xl" },
  { prefix: "2xl", width: 1536, display: "9xl" },
] as const;

// The narrowest phone the site is tested at, with the hero's tracking and 20px gutters.
const phone = 360;
const tracking = -0.03;
export const phoneTitleRoom = phone - 2 * 20;

const ems = (line: string) => serif.layout(line).advanceWidth / serif.unitsPerEm + tracking * [...line].length;

export const phoneTitleWidth = (line: string) => ems(line) * steps[phoneDisplay];

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

// Mirrors the hero grid at a breakpoint's narrowest width: 6vw gutters and gap, and a stamp or invite slot of
// min(380px, 34%) beside the words. The e2e hero checks catch this drifting from the CSS.
const column = (width: number, layout: "beside" | "full") => {
  const inner = width - 2 * 0.06 * width;
  return layout === "full" ? inner : inner - 0.06 * width - Math.min(380, 0.34 * inner);
};

const below = (step: Step) => order[Math.max(0, order.indexOf(step) - 1)];

// A word too wide to break steps the phone title down one size just for that party.
export const heroTitleSize = (lines: string[], layout: "beside" | "full") => {
  const widest = Math.max(0, ...lines.map(ems));
  const phoneStep = widest * steps[phoneDisplay] <= phoneTitleRoom ? phoneDisplay : below(phoneDisplay);
  const classes = [`text-${phoneStep}`];
  let current: Step = phoneStep;
  for (const { prefix, width, display } of breakpoints) {
    let step: Step = display;
    while (step !== order[0] && widest * steps[step] > column(width, layout)) step = below(step);
    if (step !== current) classes.push(`${prefix}:text-${step}`);
    current = step;
  }
  return classes.join(" ");
};
