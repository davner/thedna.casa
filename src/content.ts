import type { ImageMetadata } from "astro";

// PLACEHOLDER copy: Dan and Alexis have not written the welcome or the one-liners yet.

export interface Welcome {
  text: string;
  photo?: ImageMetadata;
  alt: string;
}

export const welcome: Welcome = {
  text: "Placeholder welcome. A few warm sentences go here: who we are, that this is our little corner of the web, and that we're glad you stopped by.",
  // Import a file from src/assets/photos/ and describe it in alt; without one a pink petal shape stands in.
  alt: "Photo placeholder",
};

export interface Member {
  name: string;
  line: string;
  color: string;
  // Import a file from src/assets/photos/; without one the member shows a solid color circle.
  portrait?: ImageMetadata;
}

export const members: Member[] = [
  { name: "Dan", line: "One line about Dan.", color: "var(--salamander)" },
  { name: "Alexis", line: "One line about Alexis.", color: "var(--pink)" },
  { name: "Milly", line: "The dog. One line about Milly.", color: "var(--sage)" },
  { name: "Penny", line: "The cat. One line about Penny.", color: "var(--gold)" },
];
