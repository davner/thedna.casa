import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// A photo sits on the item it shows, so the page never has to guess which photo goes where.
const halloween = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/halloween" }),
  schema: ({ image }) => {
    const photo = z.object({ src: image(), alt: z.string().min(1), shape: z.enum(["petal", "circle"]).default("petal") });
    return z.object({
      year: z.number().int(),
      name: z.string(),
      theme: z.string(),
      drinks: z.array(z.string()),
      drinksBy: z.string().optional(),
      ourCostumes: z.array(z.object({ who: z.string(), as: z.string(), asLang: z.string().optional(), photo: photo.optional() })),
      contest: z.object({
        rule: z.string(),
        result: z.string(),
        winners: z.array(z.object({ names: z.string(), costume: z.string() })),
      }),
      highlights: z.array(z.object({ title: z.string(), text: z.string(), photo: photo.optional() })),
    });
  },
});

export const collections = { halloween };
