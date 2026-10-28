import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { load, type CheerioAPI } from "cheerio";
import postcss, { type Root } from "postcss";
import sharp from "sharp";

const dist = new URL("../dist/", import.meta.url);
// A second built site whose pages render the real components with photos, since the real site has none yet.
export const photoSiteDist = new URL("fixtures/photo-site/dist/", import.meta.url);
const inDist = (path: string, root = dist) => new URL(path.replace(/^\//, ""), root);
const read = (path: string, root = dist) => readFileSync(inDist(path, root), "utf8");

export const builtPage = (path: string, root = dist) => load(read(path, root));

export const builtFileExists = (path: string) => existsSync(inDist(path));

export const builtFilePath = (path: string) => fileURLToPath(inDist(path));

// cheerio's text() drops <br>, which would glue "THE DnA" to "CASA".
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

export const pageCss = ($: CheerioAPI): Root[] => $("style").map((_, el) => postcss.parse($(el).text())).get();
