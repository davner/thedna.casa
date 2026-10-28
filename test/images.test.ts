import { describe, expect, it } from "vitest";
import { imageMetadata, shippedImages } from "./site";

describe("shipped images", () => {
  // One test over the whole list, because the site ships no photos yet and an empty it.each would fail.
  it("carry no EXIF, XMP or IPTC metadata", async () => {
    const tagged = [];
    for (const file of shippedImages()) {
      const found = await imageMetadata(file);
      if (found.exif || found.xmp || found.iptc) tagged.push({ file, ...found });
    }
    expect(tagged).toEqual([]);
  });
});
