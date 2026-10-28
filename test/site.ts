import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { load, type CheerioAPI } from "cheerio";
import postcss, { type Root } from "postcss";
import sharp from "sharp";

const dist = new URL("../dist/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path.replace(/^\//, ""), dist), "utf8");

export const builtPage = (path: string) => load(read(path));

// cheerio's text() drops <br>, which would glue "THE DNA" to "CASA".
export const readText = ($: CheerioAPI, selector: Parameters<CheerioAPI>[0]) => {
  const el = $(selector).clone();
  el.find("br").replaceWith(" ");
  return el.text().replace(/\s+/g, " ").trim();
};

// sharp reads metadata from every format Astro can emit; exifr cannot parse WebP, Astro's default output.
export const imageMetadata = async (file: string) => {
  const { exif, xmp, iptc } = await sharp(file).metadata();
  return { exif: !!exif, xmp: !!xmp, iptc: !!iptc };
};

const shippedFiles = (root: URL) => readdirSync(root, { recursive: true, encoding: "utf8" });

export const shippedImages = (root: URL = dist) =>
  shippedFiles(root)
    .filter((file) => /\.(jpe?g|png|webp|avif|gif|tiff?|heic|heif)$/i.test(file))
    .map((file) => fileURLToPath(new URL(file, root)));

export const shippedPages = () => shippedFiles(dist).filter((file) => file.endsWith(".html"));

// Astro inlines small stylesheets and links larger ones, so a page's CSS lives in both places.
export const pageCss = ($: CheerioAPI): Root[] => [
  ...$("style").map((_, el) => $(el).text()).get(),
  ...$("link[rel='stylesheet']").map((_, el) => read($(el).attr("href") ?? "")).get(),
].map((css) => postcss.parse(css));
