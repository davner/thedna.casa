import type { ImageMetadata } from "astro";

// PLACEHOLDER copy: Dan and Alexis have not written the welcome or the one-liners yet.
// Edit the words here; the page layout reads everything from this file.

export interface Member {
  name: string;
  line: string;
  color: string;
  // Import a file from src/assets/photos/; without one the member shows a solid color circle.
  portrait?: ImageMetadata;
}

export const members: Member[] = [
  { name: "Dan", line: "One line about Dan.", color: "var(--sal)" },
  { name: "Alexis", line: "One line about Alexis.", color: "var(--pink)" },
  { name: "Milly", line: "The dog. One line about Milly.", color: "var(--sage)" },
  { name: "Penny", line: "The cat. One line about Penny.", color: "var(--oro)" },
];
