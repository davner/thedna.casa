import { createRequire } from "node:module";
import { openSync, type Font } from "fontkit";

// The same self-hosted file the pages load, so build-time measuring and drawing match what visitors see.
export const serif = openSync(
  createRequire(import.meta.url).resolve(
    "@fontsource/averia-serif-libre/files/averia-serif-libre-latin-700-normal.woff2",
  ),
) as Font;
