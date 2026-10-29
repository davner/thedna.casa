import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { petalSeed } from "./lib/parties";

// A photo sits on the item it shows, so the page never has to guess which photo goes where.
const halloween = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/halloween" }),
  schema: ({ image }) => {
    // The seed is read from the path as written, before image() turns it into a hashed build URL.
    const photo = z.preprocess(
      (raw) =>
        raw && typeof raw === "object" && "src" in raw && typeof raw.src === "string"
          ? { ...raw, seed: petalSeed(raw.src) }
          : raw,
      z.object({
        src: image(),
        alt: z.string().min(1),
        shape: z.enum(["petal", "circle"]).default("petal"),
        seed: z.number().int(),
      }),
    );
    return z.object({
      year: z.number().int(),
      date: z.coerce.date(),
      name: z.string(),
      theme: z.string(),
      // A party known only from its invite has no costumes, contest, drinks or highlights yet, and skips those sections.
      ourCostumes: z
        .array(z.object({ who: z.string(), as: z.string(), asLang: z.string().optional(), photo: photo.optional() }))
        .default([]),
      contest: z
        .object({
          rule: z.string().optional(),
          result: z.string(),
          winners: z.array(z.object({ names: z.string(), costume: z.string() })),
          photo: photo.optional(),
        })
        .optional(),
      drinks: z
        .object({ names: z.array(z.string()).min(1), by: z.string().optional(), photo: photo.optional() })
        .optional(),
      // Frames tell one moment in order, like stills from a video, so they keep their own shape instead of a petal.
      highlights: z
        .array(
          z.object({
            title: z.string(),
            text: z.string(),
            photo: photo.optional(),
            frames: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string() })).optional(),
          }),
        )
        .default([]),
      invite: z.object({ src: image(), alt: z.string().min(1) }).optional(),
    });
  },
});

export const collections = { halloween };
