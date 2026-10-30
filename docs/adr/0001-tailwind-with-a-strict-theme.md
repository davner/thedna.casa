# Tailwind v4 with a strict theme, and hand-made pieces as the exception

The site's look had grown into about 1,200 lines of scoped CSS. Each component made up its own spacing, its own `clamp(...)` and `min(...)` sizes and its own 760px breakpoint, and the colors were defined three times. We moved the styling to Tailwind CSS v4 and let Tailwind's design settle those basics. We did not keep a custom scale on top of it. Only the hand-made pieces keep scoped CSS, so the site still looks drawn rather than templated.

## What we decided

- **Wiring.** Tailwind is set up the way Astro's `astro add tailwind` does it: the `@tailwindcss/vite` plugin and one global stylesheet, `src/styles/global.css`, imported by the base layout. There is no `tailwind.config.js` and no `@astrojs/tailwind`. Preflight (Tailwind's CSS reset) is on.
- **Strict theme.** The theme defines the 11 palette colors and the 2 font families, and nothing else of its own. `--color-*: initial` and `--font-*: initial` wipe Tailwind's defaults, so `text-black` or `font-mono` cannot be written. The palette module in `src/palette.ts` stays, because SVG fills, the theme-color meta and the favicon need the colors outside CSS. A test keeps the two copies equal. CSS reads colors only through the theme's `--color-*` variables.
- **Tailwind's scales and breakpoints.** Spacing, sizes, text sizes, tracking, line height, radius, z-index, durations and easing come from Tailwind's own scales. Breakpoints are Tailwind's defaults (sm 640, md 768, lg 1024, xl 1280, 2xl 1536), written mobile-first. The old 760px switch is md now.
- **The allowed-step list.** v4 accepts any multiple of the spacing unit (`p-4.5` and `w-137` compile), so Tailwind alone does not hold a scale. `src/tailwind-steps.ts` lists the classic named spacing steps, the container sizes, fractions, the viewport and size keywords, and the classic durations. The build tests read that list.
- **No arbitrary values.** No bracket utilities (`w-[...]`) and no arbitrary properties. The `(--var)` shorthands, such as `bg-(--dark)`, are allowed, because they only read a variable.
- **Tests on what ships.** The vitest suite builds the site and checks its CSS. It fails on an arbitrary-value utility, a step that is not on the list, theme colors that differ from the palette module, a text size outside DESIGN.md, a custom fluid value, motion off Tailwind's durations and curves, a breakpoint that is not Tailwind's, or a custom property that nothing reads. The scoped-style allowlist is the one test that reads source, because the built CSS names a scoped rule only by a hash.

## Values with no stock utility

A value with no stock utility gets one of three treatments, picked in this order:

1. **Change the value** to one that has a utility, when that keeps the picture. This covers most cases. For example, the list row's `grid-cols-[auto_1fr_auto]` became `flex` with `flex-1` in the middle.
2. **A named `@utility` in the global stylesheet,** for a page value that utilities cannot write but that is not a drawing. The step and motion tests still read its values. There are four: `reveal` (the scroll-driven fade-up), `invite-width` (the invite's width from its own aspect ratio), `frame-strip` (photo-strip columns that stop growing at a frame's width) and `divider` (the one hairline between rows, so every list draws the same line).
3. **Hand-made scoped CSS,** for the signature pieces whose masks, clip paths, keyframes, SVG geometry or recolor variables no utility can express: Stamp, Drips, Welcome (the soft photo mask), Nav (the menu strokes), Trophy and Button. It is written as plain CSS that reads the theme variables (`var(--color-*)`, `var(--spacing)`, `var(--container-*)`), never `@apply`, and its numbers snap to allowed steps too. The page-wide grain is the same kind of piece. It lives as plain CSS in the global stylesheet's base layer, so the base layout has no scoped style.

An inline `style` holds what is set per element. This covers the recap photos' `clip-path: url(#soft-...)` (each photo has its own seeded mask), the round thumbnails' `clip-path: circle(50%)`, the invite's `--aspect` and the page's `--dark`. The thumbnails keep the clip-path because `rounded-full` antialiases the edge differently.

## Considered options

- **Keep scoped CSS and add a design-token file.** Rejected: that keeps the long tail of one-off values and makes us maintain our own scale.
- **Allow arbitrary values for the hard cases.** Rejected: one bracket at a time, the scale stops holding. A named `@utility` keeps the value in one place, where the tests can read it.
- **`rounded-full` for the round thumbnails.** Rejected: it is not pixel-identical to the old `clip-path: circle(50%)`.

## Consequences

- Tailwind's `hover:` variant only fires under `(hover: hover)`. `@custom-variant hover (&:hover)` puts back the old behavior, where a hover style also shows after a tap.
- Tailwind scans only `src/**/*.astro`. Words in scoped `<style>` blocks still generate stray utilities, so `@source not inline(...)` drops the ones that would break a test (bare `transform` and `transition`, and `m-82` from the stamp's path data).
- `prettier-plugin-tailwindcss` is configured but does not sort classes in `.astro` files with the current `prettier-plugin-astro`.
