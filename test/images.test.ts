import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { builtPage, imageMetadata, shippedImages, shippedPages } from "./site";

const taggedIn = async (files: string[]) => {
  const tagged = [];
  for (const file of files) {
    const found = await imageMetadata(file);
    if (found.exif || found.xmp || found.iptc) tagged.push({ file, ...found });
  }
  return tagged;
};

describe("shipped images", () => {
  // One test over the whole list, so a failure names every tagged file at once.
  it("carry no EXIF, XMP or IPTC metadata", async () => {
    expect(await taggedIn(shippedImages())).toEqual([]);
  });
});

describe("Astro's image pipeline", () => {
  const fixture = new URL("fixtures/photo-site/", import.meta.url);

  it("strips GPS from a tagged photo on its way to the built site", async () => {
    expect(await imageMetadata(fileURLToPath(new URL("src/gps-tagged.jpg", fixture)))).toMatchObject({
      exif: true,
      xmp: true,
    });
    const built = shippedImages(new URL("dist/", fixture));
    expect(built.length).toBeGreaterThan(0);
    expect(await taggedIn(built)).toEqual([]);
  });
});

describe("shipped photos", () => {
  const photos = () =>
    shippedPages().flatMap((page) => {
      const $ = builtPage(page);
      return $("img")
        .map((_, img) => ({
          page,
          src: $(img).attr("src"),
          srcset: $(img).attr("srcset") ?? "",
          sizes: $(img).attr("sizes") ?? "",
        }))
        .get();
    });

  // The widest box sizes names is the photo's largest shown width; a 2x screen needs a file at least twice that.
  it("offer a file at least twice their largest shown width, for 2x screens", () => {
    const all = photos();
    expect(all.length).toBeGreaterThan(0);
    const short = all.flatMap(({ page, src, srcset, sizes }) => {
      const lengths = sizes.split(",").map((entry) => entry.trim().replace(/^\([^)]*\)\s*/, ""));
      const widest = Math.max(
        0,
        ...lengths.flatMap((length) => [...length.matchAll(/(\d+)px/g)].map((m) => Number(m[1]))),
      );
      const candidates = [...srcset.matchAll(/\s(\d+)w\b/g)].map((m) => Number(m[1]));
      const best = Math.max(0, ...candidates);
      return widest > 0 && best >= 2 * widest ? [] : [{ page, src, widest, best }];
    });
    expect(short).toEqual([]);
  });

  // A 2x phone picks the smallest file at least twice its shown width; without one sized for it, that is the desktop 2x file.
  it("offer a 2x phone file smaller than the 2x desktop file", () => {
    const heavy = photos().flatMap(({ page, src, srcset, sizes }) => {
      const phone = sizes.match(/^\(max-width: 760px\)\s*([^,]+),/)?.[1] ?? "";
      const phoneWidest = Math.max(0, ...[...phone.matchAll(/(\d+)px/g)].map((m) => Number(m[1])));
      const candidates = [...srcset.matchAll(/\s(\d+)w\b/g)].map((m) => Number(m[1]));
      const picked = Math.min(...candidates.filter((w) => w >= 2 * phoneWidest));
      return phoneWidest === 0 || picked < Math.max(...candidates) ? [] : [{ page, src, phoneWidest, picked }];
    });
    expect(heavy).toEqual([]);
  });
});
