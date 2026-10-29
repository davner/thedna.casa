import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { palette } from "../../../palette";

export const getStaticPaths = (async () => {
  const parties = await getCollection("halloween");
  return parties.map((party) => ({ params: { year: String(party.data.year) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async () => {
  const png = await sharp({ create: { width: 1200, height: 630, channels: 3, background: palette.trona } }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
