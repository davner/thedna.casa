import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { imageMetadata, shippedImages } from "./site";

const taggedIn = async (files: string[]) => {
  const tagged = [];
  for (const file of files) {
    const found = await imageMetadata(file);
    if (found.exif || found.xmp || found.iptc) tagged.push({ file, ...found });
  }
  return tagged;
};

describe("shipped images", () => {
  // One test over the whole list, because the site ships no photos yet and an empty it.each would fail.
  it("carry no EXIF, XMP or IPTC metadata", async () => {
    expect(await taggedIn(shippedImages())).toEqual([]);
  });
});

describe("Astro's image pipeline", () => {
  const fixture = new URL("fixtures/photo-site/", import.meta.url);

  it("strips GPS from a tagged photo on its way to the built site", async () => {
    expect(await imageMetadata(fileURLToPath(new URL("src/gps-tagged.jpg", fixture)))).toMatchObject({ exif: true, xmp: true });
    const built = shippedImages(new URL("dist/", fixture));
    expect(built.length).toBeGreaterThan(0);
    expect(await taggedIn(built)).toEqual([]);
  });
});
