import { readFileSync } from "node:fs";
import { load, type CheerioAPI } from "cheerio";
import postcss, { type Root } from "postcss";

const dist = new URL("../dist/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path.replace(/^\//, ""), dist), "utf8");

export const builtPage = (path: string) => load(read(path));

// cheerio's text() drops <br>, which would glue "THE DNA" to "CASA".
export const readText = ($: CheerioAPI, selector: Parameters<CheerioAPI>[0]) => {
  const el = $(selector).clone();
  el.find("br").replaceWith(" ");
  return el.text().replace(/\s+/g, " ").trim();
};

// Astro inlines small stylesheets and links larger ones, so a page's CSS lives in both places.
export const pageCss = ($: CheerioAPI): Root[] => [
  ...$("style").map((_, el) => $(el).text()).get(),
  ...$("link[rel='stylesheet']").map((_, el) => read($(el).attr("href") ?? "")).get(),
].map((css) => postcss.parse(css));
