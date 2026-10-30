import { describe, expect, it } from "vitest";
import type { AtRule, Declaration } from "postcss";
import { builtPage, pageCss } from "./site";
import { spacingSteps } from "../src/tailwind-steps";

// Every property Tailwind's spacing and sizing utilities write, plus the grid tracks a fixed column width hides in.
const sizing =
  /^(margin|padding|inset|scroll-margin|scroll-padding)(-.+)?$|^(top|right|bottom|left|gap|row-gap|column-gap|translate|flex-basis|text-indent|grid-template-columns|grid-template-rows)$|^(min-|max-)?(width|height|inline-size|block-size)$/;

const insideLayer = (decl: Declaration, names: string[]) => {
  for (let node = decl.parent; node; node = node.parent as typeof node)
    if (node.type === "atrule" && (node as AtRule).name === "layer" && names.includes((node as AtRule).params))
      return true;
  return false;
};

const allowedPx = new Set<number>([1, ...spacingSteps.map((step) => step * 4)]);

// Lengths that are not a spacing step, a container size, a fraction or a full-screen keyword.
const offStep = (value: string) => {
  const problems: string[] = [];
  if (/\b(clamp|min|max)\(/.test(value)) problems.push("fluid function");
  for (const [, n] of value.matchAll(/var\(--spacing\)\s*\*\s*(-?[\d.]+)/g))
    if (!(spacingSteps as readonly number[]).includes(Math.abs(Number(n)))) problems.push(`${n} spacing steps`);
  const bare = value.replace(/var\(--spacing\)\s*\*\s*-?[\d.]+/g, "");
  for (const [token, n, unit] of bare.matchAll(/(-?\d*\.?\d+)([a-z]+)\b/gi)) {
    const px = unit === "px" ? Math.abs(Number(n)) : unit === "rem" ? Math.abs(Number(n)) * 16 : NaN;
    if (unit === "px" || unit === "rem") {
      if (!allowedPx.has(px)) problems.push(token);
    } else if (/^(vw|vh|dvh|svh|lvh)$/.test(unit)) {
      if (Number(n) !== 100) problems.push(token);
    } else if (unit !== "fr") problems.push(token);
  }
  return problems;
};

const homeCss = () => pageCss(builtPage("index.html"));

describe("the home page", () => {
  it("sizes and spaces everything with allowed Tailwind steps", () => {
    const off: string[] = [];
    let checked = 0;
    for (const root of homeCss())
      root.walkDecls((decl) => {
        const custom = decl.prop.startsWith("--");
        if (!sizing.test(decl.prop) && !custom) return;
        // The theme and Tailwind's own internals define the scale rather than use it.
        if (insideLayer(decl, ["theme", "properties"]) || decl.prop.startsWith("--tw-")) return;
        if (custom && !/\d(px|rem|vw|vh|ch|cqi)\b/.test(decl.value)) return;
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

  it("switches layout only at Tailwind's default breakpoints", () => {
    const breakpoint = /^\((min-width:|width>=)(40|48|64|80|96)rem\)$/;
    const queries: string[] = [];
    for (const root of homeCss())
      root.walkAtRules("media", (rule) => {
        const params = rule.params.replace(/\s+/g, "");
        if (/width|height/.test(params) && !breakpoint.test(params)) queries.push(rule.params);
      });
    expect(queries).toEqual([]);
  });
});
