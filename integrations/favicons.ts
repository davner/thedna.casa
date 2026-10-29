import { readFile, writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import sharp from "sharp";
import { palette } from "../src/palette.ts";

const { cream, mole } = palette;

const sharePreview = async (svg: Buffer) =>
  sharp({ create: { width: 1200, height: 630, channels: 3, background: mole } })
    .composite([{ input: await sharp(svg, { density: 1200 }).resize(400, 400).png().toBuffer() }])
    .png()
    .toBuffer();

type File = { type: string; body: Buffer };

const render = async (svg: Buffer): Promise<Record<string, File>> => ({
  "favicon.svg": { type: "image/svg+xml", body: svg },
  "favicon-32x32.png": {
    type: "image/png",
    body: await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer(),
  },
  // iOS paints transparent corners black, so the touch icon sits on cream with a margin.
  "apple-touch-icon.png": {
    type: "image/png",
    body: await sharp(svg, { density: 300 })
      .resize(148, 148)
      .extend({ top: 16, bottom: 16, left: 16, right: 16, background: cream })
      .flatten({ background: cream })
      .png()
      .toBuffer(),
  },
  "share.png": { type: "image/png", body: await sharePreview(svg) },
});

export default function favicons(source: URL): AstroIntegration {
  const files = () => readFile(source).then(render);
  return {
    name: "favicons",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const file: File | undefined = (await files())[(req.url ?? "").split("?")[0].slice(1)];
          if (!file) return next();
          res.setHeader("Content-Type", file.type);
          res.end(file.body);
        });
      },
      "astro:build:done": async ({ dir }) => {
        for (const [name, file] of Object.entries(await files())) await writeFile(new URL(name, dir), file.body);
      },
    },
  };
}
