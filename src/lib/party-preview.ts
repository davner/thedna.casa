import sharp from "sharp";
import { palette } from "../palette";

interface Party { name: string; year: number }

const words = ({ name, year }: Party) => `${name.toUpperCase()} · HALLOWEEN ${year}`;

// Beside the drawing, so the alt text cannot drift from what the image shows.
export const partyShare = (party: Party) => ({
  path: `/halloween/${party.year}/share.png`,
  alt: `A cream ghost over ${words(party)} on Trona black`,
});

export const partyPreview = async (_party: Party) =>
  sharp({ create: { width: 1200, height: 630, channels: 3, background: palette.trona } }).png().toBuffer();
