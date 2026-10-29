import { serif } from "./serif";

// The narrowest phone the site is tested at, with the hero's phone title size (14vw), tracking and 20px gutters.
const phone = 360;
const size = 0.14 * phone;
const tracking = -0.03 * size;
export const phoneTitleRoom = phone - 2 * 20;

export const phoneTitleWidth = (line: string) =>
  (serif.layout(line).advanceWidth * size) / serif.unitsPerEm + tracking * [...line].length;

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
