import type { ImageMetadata } from "astro";
import alexisPhoto from "./assets/photos/alexis.jpg";
import danPhoto from "./assets/photos/dan.jpg";
import millyPhoto from "./assets/photos/milly.jpg";
import pennyPhoto from "./assets/photos/penny.jpg";
import welcomePhoto from "./assets/photos/welcome.jpg";

// PLACEHOLDER copy: Dan and Alexis have not written the welcome or the one-liners yet.

// The fixed words around the page; the welcome and members below are what changes most.
export const copy = {
  title: "The DNA Casa",
  description: "Hola from Dan & Alexis, and Milly and Penny too. Come meet the household.",
  wordmark: ["THE DNA", "CASA"],
  subtitle: "Dan & Alexis",
  ring: "THE DNA CASA · DAN & ALEXIS · CON CARIÑO · ",
  kicker: "Bienvenidos",
  hello: "Hola, we're Dan & Alexis.",
  membersHeading: "Who lives here",
  signoff: "Con cariño",
  shareImageAlt: "The DNA Casa's sun-and-moon mark on mole brown",
};

export interface Welcome {
  text: string;
  photo?: { src: ImageMetadata; alt: string };
}

export const welcome: Welcome = {
  text: "Placeholder welcome. A few warm sentences go here: who we are, that this is our little corner of the web, and that we're glad you stopped by.",
  // Without a photo a pink petal shape stands in.
  photo: { src: welcomePhoto, alt: "Dan and Alexis standing back to back in front of a red curtain, looking at the camera" },
};

export interface Member {
  name: string;
  line: string;
  color: string;
  // Import a file from src/assets/photos/; without one the member shows a solid color circle.
  portrait?: ImageMetadata;
}

export const members: Member[] = [
  { name: "Dan", line: "One line about Dan.", color: "var(--salamander)", portrait: danPhoto },
  { name: "Alexis", line: "One line about Alexis.", color: "var(--pink)", portrait: alexisPhoto },
  { name: "Milly", line: "The dog. One line about Milly.", color: "var(--sage)", portrait: millyPhoto },
  { name: "Penny", line: "The cat. One line about Penny.", color: "var(--gold)", portrait: pennyPhoto },
];
