import type { ImageMetadata } from "astro";
import alexisPhoto from "./assets/photos/alexis.jpg";
import danPhoto from "./assets/photos/dan.jpg";
import millyPhoto from "./assets/photos/milly.jpg";
import pennyPhoto from "./assets/photos/penny.jpg";
import welcomePhoto from "./assets/photos/welcome.jpg";

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
  text: "We met in Flagstaff, AZ. On our first date Alexis was thirty minutes late and ate a whole chicken, and Dan knew pretty much right away. We moved to Tucson, AZ so Dan could play with telescopes 🌌🔭🦔. Then, during the pandemic, we asked ourselves what the heck we were still doing there and moved to Los Angeles to be close to Alexis' family. This is our little corner of the internet. Welcome home.",
  // Without a photo a pink petal shape stands in.
  photo: { src: welcomePhoto, alt: "Dan and Alexis standing back to back in front of a red curtain, looking at the camera" },
};

export interface Member {
  name: string;
  // Two rhyming lines split by a newline, which the page keeps.
  line: string;
  color: string;
  // Import a file from src/assets/photos/; without one the member shows a solid color circle.
  portrait?: ImageMetadata;
}

export const members: Member[] = [
  { name: "Dan", line: "He builds for telescopes, he's got stars on the brain,\nspins vinyl with a latte, then calls where we drop again.", color: "var(--salamander)", portrait: danPhoto },
  { name: "Alexis", line: "Research tech at Caltech, the sleepiest, cutest wife,\nlately she's into clowns, and she's his duo for life.", color: "var(--pink)", portrait: alexisPhoto },
  { name: "Milly", line: "Floppy Dumbo ears, the sassiest pup of all,\nshe leaps off giant heights, convinced she'll never fall.", color: "var(--sage)", portrait: millyPhoto },
  { name: "Penny", line: "A calico cuddle bug who yells when dinner's late,\nhalf of Stinky and the Brainless, with Milly as her mate.", color: "var(--gold)", portrait: pennyPhoto },
];
