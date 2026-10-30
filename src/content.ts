import type { ImageMetadata } from "astro";
import type { palette } from "./palette";
import alexisPhoto from "./assets/photos/alexis.jpg";
import danPhoto from "./assets/photos/dan.jpg";
import millyPhoto from "./assets/photos/milly.jpg";
import pennyPhoto from "./assets/photos/penny.jpg";
import welcomePhoto from "./assets/photos/welcome.jpg";

// The fixed words around the page; the welcome and members below are what changes most.
export const copy = {
  title: "The DnA Casa",
  description: "Hola from Dan & Alexis, and Milly and Penny too. Come meet the household.",
  wordmark: ["THE DnA", "CASA"],
  subtitle: "Dan & Alexis",
  ring: "THE DnA CASA · DAN & ALEXIS · CON CARIÑO · ",
  kicker: "Bienvenidos",
  hello: "Hola, we're Dan & Alexis.",
  membersHeading: "Who lives here",
  signoff: "Con cariño",
  shareImageAlt: "The DnA Casa's sun-and-moon mark on mole brown",
};

export interface Share {
  path: string;
  alt: string;
}

export interface Welcome {
  text: string;
  photo?: { src: ImageMetadata; alt: string };
}

export const welcome: Welcome = {
  text: "We met in Flagstaff, AZ, on a first date where Alexis showed up thirty minutes late and ate a whole chicken. Dan knew right away. We moved to Tucson so Dan could play with telescopes, and then, somewhere in the middle of the pandemic, we looked at each other and asked what the heck we were still doing there. So we packed up and moved to Los Angeles to be close to Alexis' family. This is our little corner of the internet.",
  // Without a photo the soft photo shape, filled pink, stands in.
  photo: {
    src: welcomePhoto,
    alt: "Dan and Alexis standing back to back in front of a red curtain, looking at the camera",
  },
};

export interface Member {
  name: string;
  line: string;
  color: keyof typeof palette;
  // Import a file from src/assets/photos/; without one the member shows a solid color circle.
  portrait?: { src: ImageMetadata; alt: string };
}

export const members: Member[] = [
  {
    name: "Dan",
    line: 'Builds software for telescopes, collects vinyl and chases good coffee. Concerts took some of his hearing, and Alexis thinks half his "huh?"s are on purpose.',
    color: "salamander",
    portrait: {
      src: danPhoto,
      alt: "Dan in sunglasses and a patterned knit shirt, smiling on a sunny street lined with hedges",
    },
  },
  {
    name: "Alexis",
    line: "Research tech at Caltech, artist at heart and the most thoughtful person you'll ever meet. Also the sleepiest, the cutest, and the one who decides where we're dropping.",
    color: "pink",
    portrait: {
      src: alexisPhoto,
      alt: "Alexis in a white embroidered blouse, smiling with her eyes down, red tile roofs behind her",
    },
  },
  {
    name: "Milly",
    line: "Big floppy Dumbo ears, a whole lot of sass and zero fear of heights. She's sure she's invincible, and she's definitely the cutest pup around.",
    color: "sage",
    portrait: {
      src: millyPhoto,
      alt: "Milly, a brown cocker spaniel, nose to the camera on the lawn with one ear blown out sideways",
    },
  },
  {
    name: "Penny",
    line: "A calico cuddle bug who will let you know, loudly, when dinner is late. She and Milly are Stinky and the Brainless.",
    color: "gold",
    portrait: { src: pennyPhoto, alt: "Penny, a calico cat, sitting in the sun with her eyes half closed" },
  },
];
