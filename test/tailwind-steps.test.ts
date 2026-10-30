import { describe, expect, it } from "vitest";
import type { AtRule, Declaration } from "postcss";
import { builtPage, pageCss, shippedPages } from "./site";
import { containerSizes, durationSteps, fractionStep, keywordSteps, spacingSteps } from "../src/tailwind-steps";

// Every property Tailwind's spacing and sizing utilities write, plus the grid tracks a fixed column width hides in.
const sizing =
  /^(margin|padding|inset|scroll-margin|scroll-padding)(-.+)?$|^(top|right|bottom|left|gap|row-gap|column-gap|translate|flex-basis|text-indent|grid-template-columns|grid-template-rows)$|^(min-|max-)?(width|height|inline-size|block-size)$/;

const insideLayer = (decl: Declaration, names: string[]) => {
  for (let node = decl.parent; node; node = node.parent as typeof node)
    if (node.type === "atrule" && (node as AtRule).name === "layer" && names.includes((node as AtRule).params))
      return true;
  return false;
};

const allowedPx = new Set<number>([
  ...(keywordSteps.includes("px") ? [1] : []),
  ...spacingSteps.map((step) => step * 4),
]);
const keywords = new Set<string>(keywordSteps);

// The CSS each size keyword compiles to; "px" is a length, so it is read with the spacing steps.
const keywordFor: Record<string, string> = {
  auto: "auto",
  none: "none",
  "min-content": "min",
  "max-content": "max",
  "fit-content": "fit",
  "100%": "full",
};
const viewportKeyword: Record<string, string> = { vw: "screen", vh: "screen", dvh: "dvh", svh: "svh", lvh: "lvh" };

// Lightning folds a fraction utility into its percentage, so a percentage passes when some allowed fraction makes it.
const isFraction = (percent: number) => {
  for (let denominator = 1; denominator <= 100; denominator++) {
    const numerator = (percent * denominator) / 100;
    if (
      Math.abs(numerator - Math.round(numerator)) < 1e-3 &&
      fractionStep.test(`${Math.round(Math.abs(numerator))}/${denominator}`)
    )
      return true;
  }
  return false;
};

// Lengths that are not a spacing step, a container size, a fraction or a full-screen keyword.
const offStep = (value: string) => {
  const problems: string[] = [];
  if (/\b(clamp|min|max)\(/.test(value)) problems.push("fluid function");
  for (const [, n] of value.matchAll(/var\(--spacing\)\s*\*\s*(-?[\d.]+)/g))
    if (!(spacingSteps as readonly number[]).includes(Math.abs(Number(n)))) problems.push(`${n} spacing steps`);
  for (const [token, size] of value.matchAll(/var\(--container-([\w-]+)\)/g))
    if (!(containerSizes as readonly string[]).includes(size)) problems.push(token);
  const bare = value.replace(/var\([^)]*\)/g, "").replace(/\b(calc|repeat|minmax)\(/g, "(");
  for (const [token, n, unit] of bare.matchAll(/(-?\d*\.?\d+)([a-z]+|%)/gi)) {
    const px = unit === "px" ? Math.abs(Number(n)) : unit === "rem" ? Math.abs(Number(n)) * 16 : NaN;
    if (unit === "px" || unit === "rem") {
      if (!allowedPx.has(px)) problems.push(token);
    } else if (unit === "%") {
      if (!(token === "100%" ? keywords.has("full") : isFraction(Math.abs(Number(n))))) problems.push(token);
    } else if (unit in viewportKeyword) {
      if (Number(n) !== 100 || !keywords.has(viewportKeyword[unit])) problems.push(token);
    } else if (unit !== "fr") problems.push(token);
  }
  for (const [word] of bare.replace(/-?\d*\.?\d+([a-z]+|%)?/gi, "").matchAll(/[a-z][\w-]*/gi))
    if (!keywords.has(keywordFor[word])) problems.push(word);
  return problems;
};

// Splits on the commas between a shorthand's items, not the ones inside a function.
const items = (value: string) => value.split(/,(?![^(]*\))/).map((item) => item.trim());

const motion = /^(transition|animation)(-duration|-delay|-timing-function)?$/;

// Durations and easing that are not Tailwind's: off-list times, curves of the site's own, and the browser's ease keywords.
const offMotion = (prop: string, value: string) => {
  const problems: string[] = [];
  // Tailwind's transition utilities fall back to its default curve, the same one as --ease-in-out.
  const named = value.replace(/var\(--tw-ease,\s*var\(--default-transition-timing-function\)\)/g, "var(--ease-in-out)");
  for (const item of items(named)) {
    // The ring's slow endless turn is a hand-made piece's own clock, not a transition.
    if (/\binfinite\b/.test(item)) continue;
    for (const [token, n, unit] of item.matchAll(/(?<![\w-])(\d*\.?\d+)(ms|s)\b/g)) {
      const ms = Number(n) * (unit === "s" ? 1000 : 1);
      if (!(durationSteps as readonly number[]).includes(ms)) problems.push(token);
    }
    if (/cubic-bezier\(|steps\(|\bease(-in|-out|-in-out)?\b/.test(item.replace(/var\(--ease-[\w-]+\)/g, "")))
      problems.push(item);
    // A shorthand with no curve runs on the browser's ease, which is not one of Tailwind's.
    const shorthand = prop === "transition" || prop === "animation";
    if (shorthand && !/allow-discrete|\blinear\b|var\(--ease-/.test(item)) problems.push(`${item} (no easing)`);
  }
  return problems;
};

describe.each(shippedPages())("%s", (page) => {
  const css = () => pageCss(builtPage(page));

  it("sizes and spaces everything with allowed Tailwind steps", () => {
    const off: string[] = [];
    let checked = 0;
    for (const root of css())
      root.walkDecls((decl) => {
        const custom = decl.prop.startsWith("--");
        if (!sizing.test(decl.prop) && !custom) return;
        // The theme and Tailwind's own internals define the scale rather than use it.
        if (insideLayer(decl, ["theme", "properties"]) || decl.prop.startsWith("--tw-")) return;
        if (custom && !/\d(px|rem|vw|vh|ch|cqi)\b|var\(--spacing\)/.test(decl.value)) return;
        checked++;
        // Preflight's resets size against the text itself, which the type scale already covers.
        if (insideLayer(decl, ["base"]) && /^-?[\d.]+(em|lh)$/.test(decl.value)) return;
        const problems = offStep(decl.value);
        if (problems.length)
          off.push(`${(decl.parent as { selector?: string }).selector} { ${decl.prop}: ${decl.value} } ${problems}`);
      });
    // A floor, so the check cannot pass on an empty walk if the CSS moves somewhere this test does not read.
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(off).toEqual([]);
  });

  it("leaves no custom fluid value anywhere, custom properties included", () => {
    const fluid: string[] = [];
    for (const root of css())
      root.walkDecls((decl) => {
        if (insideLayer(decl, ["theme", "properties"]) || decl.prop.startsWith("--tw-")) return;
        if (/\b(clamp|min|max)\(|\d(cqi|cqw|vw|vh|vmin|vmax|ch)\b/.test(decl.value))
          fluid.push(`${(decl.parent as { selector?: string }).selector} { ${decl.prop}: ${decl.value} }`);
      });
    expect(fluid).toEqual([]);
  });

  it("moves only on Tailwind's durations and easing curves", () => {
    const off: string[] = [];
    let checked = 0;
    for (const root of css())
      root.walkDecls(motion, (decl) => {
        if (insideLayer(decl, ["theme", "properties"])) return;
        checked++;
        const problems = offMotion(decl.prop, decl.value);
        if (problems.length)
          off.push(`${(decl.parent as { selector?: string }).selector} { ${decl.prop}: ${decl.value} } ${problems}`);
      });
    expect(checked).toBeGreaterThan(0);
    expect(off).toEqual([]);
  });

  it("switches layout only at Tailwind's default breakpoints", () => {
    const breakpoint = /^\((min-width:|width>=)(40|48|64|80|96)rem\)$/;
    const queries: string[] = [];
    for (const root of css())
      root.walkAtRules("media", (rule) => {
        const params = rule.params.replace(/\s+/g, "");
        if (/width|height/.test(params) && !breakpoint.test(params)) queries.push(rule.params);
      });
    expect(queries).toEqual([]);
  });
});
