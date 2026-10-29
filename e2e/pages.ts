import { devices } from "@playwright/test";

export const pages = ["/", "/halloween/", "/halloween/2026/"];

// Firefox has no mobile emulation, so every engine takes just the phone's viewport.
export const phone = { viewport: devices["iPhone 13"].viewport };
