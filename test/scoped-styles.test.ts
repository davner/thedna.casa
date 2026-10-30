import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = new URL("../src/", import.meta.url);

// The built CSS names a scoped rule only by a hash, so this one check reads the source.
const filesWithStyle = () =>
  readdirSync(src, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".astro"))
    .filter((file) => /<style[\s>]/.test(readFileSync(new URL(file, src), "utf8")))
    .sort();

// Masks, clip paths, keyframes, SVG geometry and the stone button's recolor variables, which utilities cannot express.
const handMade = [
  "components/Stamp.astro",
  "components/halloween/Drips.astro",
  "components/Welcome.astro",
  "components/Nav.astro",
  "components/halloween/Trophy.astro",
  "components/Button.astro",
];

// Shrinks as each piece moves to utility classes, and is gone when the migration is done.
const stillToMigrate: string[] = [];

describe("scoped styles", () => {
  it("live only in the hand-made pieces and the files still to migrate", () => {
    expect(filesWithStyle()).toEqual([...handMade, ...stillToMigrate].sort());
  });
});
