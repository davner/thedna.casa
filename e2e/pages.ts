import { devices } from "@playwright/test";
import { readdirSync } from "node:fs";

export const pages = ["/", "/halloween/", "/halloween/2026/"];

// Every party file builds a page, so a new party is checked without editing this list.
export const shippedPages = [
  "/",
  "/halloween/",
  ...readdirSync(new URL("../src/content/halloween/", import.meta.url))
    .filter((file) => file.endsWith(".md"))
    .map((file) => `/halloween/${file.replace(/\.md$/, "")}/`),
];

// Firefox has no mobile emulation, so every engine takes just the phone's viewport.
export const phone = { viewport: devices["iPhone 13"].viewport };
