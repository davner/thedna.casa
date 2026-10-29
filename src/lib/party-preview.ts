import sharp from "sharp";
import { palette } from "../palette";
import type { Share } from "../content";
import { serif } from "./serif";
import { ghostFigure } from "./shapes";

interface Party {
  name: string;
  year: number;
}

const partyWords = ({ name, year }: Party) => `${name.toUpperCase()} · HALLOWEEN ${year}`;

// Beside the drawing, so the alt text cannot drift from what the image shows.
export const partyShare = (party: Party): Share => ({
  path: `/halloween/${party.year}/share.png`,
  alt: `A cream ghost over ${partyWords(party)} on Trona black`,
});

const width = 1200;
const height = 630;
const margin = 80;

// librsvg has no way to load a web font, so the glyphs go in as paths.
// Shrinks only when a long name would run past the margins, so most parties share one size.
const line = (text: string, baseline: number, size: number) => {
  const run = serif.layout(text);
  const fit = Math.min(size, ((width - 2 * margin) * serif.unitsPerEm) / run.advanceWidth);
  const scale = fit / serif.unitsPerEm;
  let x = (width - run.advanceWidth * scale) / 2;
  return run.glyphs
    .map((glyph, i) => {
      const position = run.positions[i];
      const at = `translate(${(x + position.xOffset * scale).toFixed(2)} ${baseline}) scale(${scale} ${-scale})`;
      x += position.xAdvance * scale;
      return `<path transform="${at}" d="${glyph.path.toSVG()}"/>`;
    })
    .join("");
};

const ghostHeight = 300;

export const partyPreview = async (party: Party) => {
  const [vx, vy, vw, vh] = ghostFigure.viewBox.split(" ").map(Number);
  const ghostWidth = (ghostHeight * vw) / vh;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="${palette.trona}"/>
<svg x="${(width - ghostWidth) / 2}" y="70" width="${ghostWidth}" height="${ghostHeight}" viewBox="${vx} ${vy} ${vw} ${vh}">
<path d="${ghostFigure.body}" fill="${palette.cream}"/>
<g fill="${palette.mole}">${ghostFigure.eyes.map((d) => `<path d="${d}"/>`).join("")}</g>
<g fill="${palette.cheek}">${ghostFigure.cheeks.map((d) => `<path d="${d}"/>`).join("")}</g>
</svg>
<g fill="${palette.cream}">${line(partyWords(party), 500, 72)}</g>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
};
