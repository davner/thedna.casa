import { expand } from "brace-expansion";
import tailwindTheme from "tailwindcss/theme.css?raw";
import globalCss from "../styles/global.css?raw";
import { serif } from "./serif";

// Tailwind generates only the title sizes global.css force-includes, so that list is the model's scale: each breakpoint's
// largest listed step is its display size, and a title too wide for it steps down through the smaller ones.
const titleSizes = /@source inline\(\s*"([^"]*text-[^"]*)"\s*\)/
  .exec(globalCss)![1]
  .trim()
  .split(/\s+/)
  .flatMap((item) => expand(item));

// Sizes and breakpoints in px, read from Tailwind's own theme rather than copied.
const themePx = (name: string) => Number(new RegExp(`--${name}:\\s*([\\d.]+)rem`).exec(tailwindTheme)![1]) * 16;

const stepsAt = (prefix: string) =>
  titleSizes
    .filter((size) => (prefix ? size.startsWith(`${prefix}:`) : !size.includes(":")))
    .map((size) => size.split("text-")[1])
    .sort((a, b) => themePx(`text-${a}`) - themePx(`text-${b}`));

const phoneSteps = stepsAt("");
const phoneDisplay = phoneSteps.at(-1)!;

// The page gutter global.css sets from md, which is also the hero's gap; a breakpoint that sets none keeps the last.
const gutterSteps = new Map(
  [...globalCss.matchAll(/@variant (\w+) \{\s*--gutter: --spacing\(([\d.]+)\);/g)].map(([, prefix, steps]) => [
    prefix,
    Number(steps) * themePx("spacing"),
  ]),
);

// Each breakpoint's steps and gutter, at the breakpoint's own width, narrowest first.
const breakpoints = [...new Set(titleSizes.filter((size) => size.includes(":")).map((size) => size.split(":")[0]))]
  .map((prefix) => ({ prefix, width: themePx(`breakpoint-${prefix}`), steps: stepsAt(prefix) }))
  .sort((a, b) => a.width - b.width)
  .map((breakpoint, i, all) => ({
    ...breakpoint,
    gutter: all.slice(0, i + 1).reduce((gutter, { prefix }) => gutterSteps.get(prefix) ?? gutter, NaN),
  }));

// The narrowest phone the site is tested at, with the hero's 20px gutters.
const phone = 360;
export const phoneTitleRoom = phone - 2 * 20;

// The hero's tracking: tight on phones, tighter from md, where the sizes are larger.
const phoneTracking = -0.025;
const wideTracking = -0.05;

const ems = (line: string, tracking: number) =>
  serif.layout(line).advanceWidth / serif.unitsPerEm + tracking * [...line].length;

export const phoneTitleWidth = (line: string) => ems(line, phoneTracking) * themePx(`text-${phoneDisplay}`);

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

// A word too wide to break steps the phone title down one size just for that party.
export const heroTitleSize = (lines: string[], layout: "beside" | "full") => {
  const phoneStep =
    Math.max(0, ...lines.map(phoneTitleWidth)) <= phoneTitleRoom ? phoneDisplay : (phoneSteps.at(-2) ?? phoneDisplay);
  const widest = Math.max(0, ...lines.map((line) => ems(line, wideTracking)));
  const classes = [`text-${phoneStep}`];
  let current = phoneStep;
  for (const breakpoint of breakpoints) {
    const { prefix, steps } = breakpoint;
    const step = steps.findLast((step) => widest * themePx(`text-${step}`) <= column(breakpoint, layout)) ?? steps[0];
    if (step !== current) classes.push(`${prefix}:text-${step}`);
    current = step;
  }
  return classes.join(" ");
};
