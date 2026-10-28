import { readFileSync } from "node:fs";
import { load } from "cheerio";

const dist = new URL("../dist/", import.meta.url);

export const builtPage = (path: string) => load(readFileSync(new URL(path, dist), "utf8"));

// cheerio's text() drops <br>, which would glue "THE DNA" to "CASA".
export const readText = ($: ReturnType<typeof load>, selector: string) => {
  const el = $(selector).clone();
  el.find("br").replaceWith(" ");
  return el.text().replace(/\s+/g, " ").trim();
};
