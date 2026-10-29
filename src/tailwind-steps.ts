// Tailwind v4 accepts any multiple of --spacing, so the site keeps its own list: the classic named scale.
export const spacingSteps = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64,
  72, 80, 96,
] as const;

export const containerSizes = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
] as const;

export const keywordSteps = ["px", "full", "auto", "screen", "dvh", "svh", "lvh", "min", "max", "fit"] as const;

export const fractionStep = /^[1-9]\d*\/[1-9]\d*$/;
