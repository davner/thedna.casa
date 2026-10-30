---
name: The DnA Casa
description: A warm, restrained, hand-made home on the web for one household.
colors:
  mole: "#43262a"
  cream: "#f6e7da"
  cream-page: "#faf4ec"
  terra: "#c8643c"
  pink: "#e4007c"
  gold: "#f2b233"
  salamander: "#2f3e3e"
  sage: "#b9c9b4"
  cheek: "#f7c6d9"
  blush: "#f0c7b4"
  trona: "#201d1e"
typography:
  display:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-4xl text-5xl text-6xl text-7xl text-8xl text-9xl"
    fontWeight: 700
    lineHeight: "leading-none"
    letterSpacing: "md:tracking-tighter"
  headline:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-4xl lg:text-5xl xl:text-6xl"
    fontWeight: 700
    lineHeight: "leading-none"
    letterSpacing: "tracking-tighter"
  title:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-3xl"
    fontWeight: 700
    lineHeight: "leading-tight"
    letterSpacing: "tracking-tight"
  subtitle:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-xl lg:text-2xl xl:text-3xl"
    fontWeight: 400
    lineHeight: "leading-tight"
    letterSpacing: "tracking-normal"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "text-base xl:text-lg"
    fontWeight: 400
    lineHeight: "leading-relaxed"
    letterSpacing: "tracking-tight"
  label:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-xl"
    fontWeight: 700
    lineHeight: "leading-tight"
    letterSpacing: "tracking-tight"
  display-phone:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-4xl text-5xl"
    fontWeight: 700
    lineHeight: "leading-none"
    letterSpacing: "tracking-tight"
  title-phone:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-2xl"
    fontWeight: 700
    lineHeight: "leading-tight"
    letterSpacing: "tracking-tight"
  caption:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "text-base"
    fontWeight: 400
    lineHeight: "leading-tight"
    letterSpacing: "tracking-tight"
  ring:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-base"
    fontWeight: 700
    letterSpacing: "tracking-widest"
  signoff:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-base"
    fontWeight: 400
    lineHeight: "leading-tight"
    letterSpacing: "tracking-normal"
  intro:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "text-xl lg:text-2xl xl:text-3xl"
    fontWeight: 400
    lineHeight: "leading-snug"
    letterSpacing: "tracking-normal"
rounded:
  circle: "rounded-full"
  frame: "rounded-2xl"
spacing:
  gutter: "gutter-x-6"
  column: "max-w-6xl"
  column-gap: "gutter-gap-6"
  gutter-phone: "px-6"
  gutter-phone-hero: "px-5"
components:
  member-circle:
    backgroundColor: "{colors.salamander}"
    rounded: "{rounded.circle}"
    width: "max-w-52"
  member-circle-phone:
    rounded: "{rounded.circle}"
    width: "w-20"
  kicker:
    textColor: "{colors.terra}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.cream}"
    typography: "{typography.label}"
  menu-link:
    textColor: "{colors.cream}"
    typography: "{typography.headline}"
  button:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.cream-page}"
    typography: "{typography.label}"
  footer:
    backgroundColor: "{colors.mole}"
    textColor: "{colors.cream}"
    padding: "pt-12 px-5 pb-24"
  recap-hero:
    backgroundColor: "{colors.trona}"
    padding: "pt-24 pb-10 md:pt-32 md:pb-14 lg:pt-36 xl:pt-44"
  invite:
    width: "max-w-64 md:max-w-96"
    height: "max-h-64 md:max-h-(--container-lg)"
  drips:
    backgroundColor: "{colors.trona}"
    height: "h-24 md:h-40"
  photo-large:
    width: "max-w-72 md:max-w-lg"
  photo-small:
    width: "max-w-56 md:max-w-80"
  photo-beside:
    width: "max-w-72 md:max-w-md"
  frame:
    rounded: "{rounded.frame}"
    width: "max-w-40 md:max-w-60"
  thumbnail:
    rounded: "{rounded.circle}"
    width: "w-20 lg:w-24 xl:w-28"
  trophy-stage:
    height: "h-(--container-lg) lg:h-(--container-2xl) xl:h-(--container-3xl)"
---

# Design System: The DnA Casa

## Overview

**Creative North Star: "Mole and Marigold"**

The page is two colors holding a household between them: a deep mole brown above and below, a cream middle, and a marigold sun at the top. Everything else is a small accent on those two fields. It should feel warm, restrained and hand-made: a person made it, and they stopped before it got busy.

Density is low. Each section does one thing: the hero names the page, the middle tells the story, and the footer signs off. The hand shows in a few seeded, drawn shapes (one squiggle, one edge between hero and middle, the soft photo mask, hand-pressed dots, the logo strokes), never in ornament spread across the page. One page-wide grain layer gives both fields a paper feel.

Halloween pages keep the same system and swap one thing: Trona black stands in for mole as the dark field, and drips stand in for the wave. Same fonts, same sizes, same accents.

Rejected and settled: a literal house, many arches, leaf or dappled shadows, squiggles everywhere, heavy hand-drawn ornament, a scrolling word strip, sparkles.

**Key Characteristics:**

- Two big color fields, a dark one and cream, joined by one drawn edge.
- Big, tight, all-caps serif wordmark; italic serif for the soft voice.
- Accents (pink, gold, terra) only in small doses.
- Flat surfaces; depth from grain, not shadows.
- Quiet motion, all of it off under reduced motion.

## Colors

A deep, warm brown and two creams carry the page; the saturated colors are accents and member identities.

### Primary

- **Mole** (`mole`): the hero and footer field, the ink on cream, the welcome heading and the ghost's eyes. The browser theme color. It stands in for black everywhere except Halloween pages.
- **Marigold** (`gold`): the logo's sun, Penny's circle.

### Secondary

- **Rosa Mexicano** (`pink`): Alexis's color. The home squiggle, Alexis's circle, the text selection highlight.
- **Terracotta** (`terra`): the one orange. Section headings and large text on cream ("Who lives here", "Bienvenidos", every Halloween section heading, the contest result, the year on the Halloween list). On the dark fields: the Halloween squiggle, the nav's current-page underline and the focus ring.

### Tertiary

- **Salamander** (`salamander`): Dan's color, his member circle.
- **Sage** (`sage`): Milly's circle.
- **Cheek** (`cheek`): the cheeks on the Beso and the ghost, and the soft photo shape that stands in for the welcome photo.
- **Blush** (`blush`): the italic hero subtitle on the dark field.

### Neutral

- **Cream Ink** (`cream`): text and the stamp ring on the dark field, and the ghost's body.
- **Page Cream** (`cream-page`): the middle field on every page.
- **Trona Black** (`trona`): the hero, footer, drips and phone menu field on Halloween pages, and their theme color. A warm near-black, darker than mole.

### Named Rules

**The No Black Rule.** Mole is the darkest color on household pages and Trona black on Halloween pages. Nothing is pure black.

**The One Orange Rule.** Terracotta is the only orange outside the logo. A page or a party never adds its own accent color (pumpkin, lime and plum were tried for Halloween and rejected).

**The Large Terracotta Rule.** Terracotta is about 3.6:1 on page cream, 3.45:1 on mole and 4.26:1 on Trona. Use it for strokes and for text at label size (`text-xl`, 1.25rem, bold) or larger, never for body or caption text.

**The Logo Exception.** The Beso logo's three petal oranges (#D9661A, #EC8A1E, #F5A623) are part of the fixed mark and live in its component, not the palette. They appear nowhere else.

**The Member Color Rule.** Each member owns one color, in order: Salamander (Dan), Rosa Mexicano (Alexis), Sage (Milly), Marigold (Penny). Don't reuse a member's color to mean something else on the same screen.

## Typography

**Display Font:** Averia Serif Libre (fallback serif)
**Body Font:** Schibsted Grotesk (fallback sans-serif)

**Character:** a soft, slightly irregular serif for every heading and the warm asides, and a plain grotesk for reading. Only three faces ship: serif 700, serif italic 400, grotesk 400. All are self-hosted through Fontsource.

### Hierarchy

- **Display:** the hero title, all caps: THE DnA CASA and a party's name, broken between words or after a hyphen wherever it would overflow a 360px phone (TRICK-R- / DRINK, LET'S GET / TIKI FREAKY), the same breaks on every screen; HALLOWEEN on one line. Its size is picked at build time from Tailwind's text steps (`src/lib/hero-title.ts`). On phones it is `text-5xl`, small enough that HALLOWEEN fits inside the 20px hero gutters from 360px up; a party name with a word too wide to break (HOMECOMING) steps down one size to `text-4xl`, on that page only. From md up, each breakpoint takes the largest step whose longest line still fits the hero's column at that breakpoint, up to `text-7xl` at md, `text-8xl` at lg and `text-9xl` from xl.
- **Headline:** section headings on every page, sized once on `h2` in the global stylesheet's base layer. `text-4xl` on phones and tablets, which is also the size of the phone menu links, then `text-5xl` at lg and `text-6xl` from xl.
- **Title:** names and short items: member names, contest winners, the drinks, the new-this-year titles, the year and name on the Halloween list. `text-2xl` on phones, `text-3xl` from md. Member names and the new-this-year titles are `h3`s, sized once on `h3` in the base layer next to `h2`; the rest carry the classes.
- **Subtitle:** the hero subtitle ("Dan & Alexis", "Our tiki Halloween", "October at the casa"), and a recap's date as the subtitle's second line ("Saturday, October 17, 2026"), in italic. `text-xl`, then `text-2xl` at lg and `text-3xl` from xl.
- **Intro:** a party recap's intro, in italic at the subtitle's sizes, with a little more line height (`leading-snug`) because it runs to several lines.
- **Label:** the "Bienvenidos" kicker, a recap's contest result and the desktop nav links. `text-xl` at every width.
- **Body:** running text, at most `max-w-sm` (384px) wide in the welcome, `max-w-md` (448px) from xl. `text-base`, then `text-lg` from xl.
- **Caption:** member one-liners, photo captions, costume lines, the party theme on the list, "Made by" lines. `text-base` at every width.
- **Ring:** the stamp ring text, `text-base` in the ring's 200-unit SVG, so it scales with the stamp. A longer ring tightens its spacing, never its size.
- **Sign-off:** the footer, italic at `text-base`.

### Named Rules

**The One Scale Rule.** Every text size on every page is one of the roles above, each a Tailwind text step per breakpoint, listed as classes in this file's front matter. A build test reads those classes and fails on any `font-size` in the built CSS, the hand-made pieces' scoped CSS included, that is not one of them. A page never invents its own size; an element that feels too quiet moves up to an existing role instead. Sizes change only at Tailwind's breakpoints, never fluidly with the screen width.

**The Two Families Rule.** Averia Serif Libre and Schibsted Grotesk only. A new role picks a weight these two already ship before it adds one.

**The Tight Serif Rule.** Serif headings set tight, on Tailwind's tracking steps: between `tracking-tight` (-0.025em) and `tracking-tighter` (-0.05em). Display titles are `tracking-tight` on phones, where the line breaks are decided, and `tracking-tighter` from md; section headings are `tracking-tighter`. Display titles and section headings set solid (`leading-none`), titles at `leading-tight` (1.25). The italic voice resets letter spacing to `tracking-normal`.

## Layout

Every page is built the same way, from Tailwind utilities on Tailwind's scales (see `docs/adr/0001-tailwind-with-a-strict-theme.md`):

- **The hero and navbar run the full width,** padded only by the gutter (`spacing.gutter`), which steps up at md, lg and xl. The gutter is set once in the global stylesheet, as `--gutter` (48px at md, 64px at lg, 80px from xl), and markup takes it through two utilities whose value is the phone step: `gutter-x-6` for side padding and `gutter-gap-7` for the gap between columns. The hero title's size model reads the same `--gutter`. Every hero has the same box (`HeroBox`), so the title starts at the same left edge on every page, and the stamp sits in the same slot: the right-hand column, 34% of the hero's inner width and at most 384px, flush with the right gutter. The slot is the `hero-slot` utility, used from md (`md:hero-slot`) by the stamp and by a recap's invite; the title's size model reads its width and cap from there. The words take the rest; the title's size is picked at build time so its longest line fits that room (see Display), so it never pushes the stamp around.
- **Everything below the hero sits in one column** at most `spacing.column` (`max-w-6xl`, 1152px) wide, centered. Each section's background still runs edge to edge; its content sits in that column, inside the gutter. Sections share the one column width, so headings, rows and photos share the same left and right edges on every page.

Two-column grids on wide screens use the gutter's steps as the gap between columns (`spacing.column-gap`). From md the home hero and the Halloween list hero are a full screen tall (`min-h-dvh`), with 96px of padding on top and 144px at the bottom, and the section under them is pulled up 80px over the hero's foot, so the edge and a strip of cream show on the first desktop screen. The hero's top padding (80px on phones) leaves room for the navbar, which sits over it.

**The Wave On Screen Rule.** At 1440x900 the wave between hero and welcome is visible without scrolling. The welcome's photo and words take equal columns. The members sit in four equal columns across the page column.

A party recap has a short hero with no stamp: the party name, the theme with the party's date under it, and the squiggle (its top padding is 96px on phones, then 128px at md, 144px at lg and 176px from xl). When the party file has an invite, the card takes the stamp's slot on the right, at most 384px wide and 512px tall, clipped by the soft mask shaped to the card (seeded by the year), so its corners round but its words stay whole; on phones it sits above the title like the stamp, fitted to a 256px square, so the drips still show on the first screen. A desktop Evite capture comes out as an unreadable banner, so invites are captured in a phone-sized view. Then the drips, then its sections in the page column: the intro (centered), our costumes (a large photo beside a small one set lower), the costume contest (heading, rule and result beside the winners as rows; with a photo of the winners and the trophy, the words and rows stack on the left and the photo stands on the right), the drinks (with a photo of the bar beside them when there is one), new this year (photo and words side by side, alternating sides; a highlight with no photo sits centered on its own; a highlight told in frames, like stills from a video, sits centered above a strip of its frames, four across at up to 240px and two across at up to 160px on phones, with 16px rounded corners (`rounded-2xl`), each captioned, never masked). A section the party file has nothing for is left out, so a party known only from its invite shows the hero with its invite, and the intro. Section headings sit on the left.

The Halloween list uses the home hero's box, with the stamp, then the drips, then the trophy (see Trophy), then one row per party, newest first: the year, the name over the theme and the short date ("Sat, Oct 17"), and a small circle photo. Rows are links, divided by hairlines.

Styles are written mobile-first: the phone layout is the base, and Tailwind's breakpoints (md 768px, lg 1024px, xl 1280px, 2xl 1536px) widen it. The layout switches at md; lg and xl only step sizes and gaps up. Below md every page is one centered column ("Stamp first"):

- The nav links fold into the menu button.
- The stamp, where a hero has one, comes first, then the title and the subtitle.
- The hero is short, so the edge and the cream middle start on the first screen.
- Side-by-side sections stack. The welcome words come before its photo; a highlight's photo comes before its words.
- The members become rows: an 80px circle on the left, the name and one-liner on the right.
- Rows (members on phones, contest winners, parties, the trophy's plates) have one hairline divider, mole at 18%, from the `divider` utility in the global stylesheet.
- The gutter is 24px (`spacing.gutter-phone`); the hero uses 20px (`spacing.gutter-phone-hero`).

**The First Screen Rule.** On a 390px-wide phone, the edge (wave or drips) and the start of the cream middle are visible without scrolling.

**The No Sideways Scroll Rule.** Nothing scrolls sideways at any width. The hero clips its turning ring horizontally to keep this true.

## Elevation & Depth

The page is flat: no shadows, no cards, no raised surfaces. Depth comes from the two color fields meeting at the edge, and from one fixed grain layer (fractal noise tinted mole, 22% opacity, multiply blend) over everything.

**The One Grain Rule.** One grain layer for the whole page. Sections don't add their own textures.

## Shapes

Shapes are organic and drawn, never boxy. The only hard geometry is the circle: member circles, their portraits and the Halloween list thumbnails. Every other shape comes from a seeded generator, so it's the same on every build:

- the wave between hero and welcome on household pages,
- the drip edge under the hero on Halloween pages,
- the brush squiggle under the subtitle,
- the soft mask that clips photos (each photo gets its own seed),
- the hand-pressed dots for cheeks and the ghost's eyes,
- the pebble behind every button,
- the ghost's body,
- the three brushed strokes of the menu button,
- the logo strokes.

The site has no rounded-rectangle boxes, cards or boxed borders; the one rounded rectangle is the soft photo mask, and it only ever clips a photo. Its controls are the phone menu button, drawn as three brushed strokes, and the stone button (see Button). The only lines are hairline dividers between rows.

**The Seeded Shape Rule.** A new organic shape comes from the shared seeded generators with a fixed seed, never from randomness at runtime or a stock icon.

**The No Tilt Rule.** Photos and cards sit straight. Tilted photos were tried, as scrapbook cuttings and as drama, and dropped everywhere; the only things that turn are the stamp's ring and the menu strokes becoming an X.

**The Hand-Pressed Dot Rule.** Cheeks (the Beso's three and the ghost's two) and the ghost's eyes are seeded dots whose edge wobbles about 7%: never perfect circles, never obviously lumpy. The Beso's closed eyes stay brushed strokes.

**The Restraint Rule.** One squiggle per hero and one edge where the hero meets the middle (the wave, or the drips on Halloween pages). No sparkles. A new shape has to replace one of these or earn a place the same way.

## Components

### Navbar

On every page, over the top of the hero, in cream; it scrolls away with the page. Links: "Casa" (`lang="es"`) and "Halloween"; a section joins only when it ships. "Halloween" is the current page on the list and on every recap. No logo: "Casa" is the way home. On wide screens the links sit inline at label size, the current page underlined in terracotta. Below md (768px) a menu button (three brushed strokes that turn into an X) opens a panel in the page's dark field that fills the screen under the bar, so no edge crosses the stamp, with the links at headline size, and the page stops scrolling while it is open. It is an HTML `popover` that follows its button, with CSS only, so it works with JavaScript off. The links are written twice, once inline and once in the panel, and CSS shows one list at each width.

### Stamp

The signature piece. A circle of words set in serif 700 caps with wide `tracking-widest` (0.1em) spacing, in cream on the dark field, around a center mark. On household pages the mark is the Beso sun-and-moon logo at 64%, and the ring reads "THE DnA CASA · DAN & ALEXIS · CON CARIÑO". On the Halloween list the mark is the ghost at 46%, and the ring reads "HALLOWEEN · THE DnA CASA · CON CARIÑO". The stamp belongs to Halloween as a whole: a party recap has no stamp (its invite takes the slot), and a party never gets its own mark or ring words. On desktop it takes the hero's side slot, at most 384px wide; on phones it is 288px wide (`w-72`), never wider than the screen.

### Ghost

The Halloween mark: a cream body drawn from a seeded outline with no outline stroke, like the Beso. Hand-pressed mole eyes and cheek-pink cheeks. It holds still. Each recap's 1200x630 link preview shows it too, 300px tall over "<NAME> · HALLOWEEN <year>" in cream serif 700 caps on Trona; a long name shrinks to fit the margins.

### Brush squiggle

One brush stroke under the hero subtitle, 128px wide (112px on phones): rosa mexicano on household pages, terracotta on Halloween pages.

### Drip edge

The Trona field hanging into the cream under a Halloween hero: 18 seeded drips (seed 66), each a neck with a round bulb, with no line along them. 160px tall from md and 96px on phones, sliced at 1:1 so the bulbs never squash; narrow screens see the middle of the edge. The content below starts under the longest drip.

### Member circle

- **Shape:** a full circle (`rounded.circle`), at most 208px on desktop (`max-w-52`), 80px on phones (`w-20`).
- **Fill:** the member's color, or their portrait cropped to the circle. Each portrait has one plain line of alt text, kept on the member's data: who it is and what they are doing or wearing.

### Photos

Photos take their shape from their role, the way the reference sites do (griefgroupsla.com rounds people into circles; tronaeast.com rounds every scene photo's corners):

- **People are circles:** the member portraits under "Who lives here".
- **Scenes are soft:** the welcome photo and every photo on a recap (costumes, contest, drinks, new this year) are 4:5 portraits clipped by the seeded soft mask: a rounded rectangle whose four corners each round by their own 7 to 13% and whose edges sag inward up to 1.5%, so it reads as trimmed by hand rather than drawn by a tool. Each photo gets its own seed from its file name. A large photo is at most 512px wide (288px on phones), a photo beside words 448px (288px), and a small one, like the pets' costume photo, 320px (224px). In a party file a photo is large unless it says `size: small`.
- **Thumbnails are circles:** the Halloween list thumbnails (80px, 96px at lg and 112px from xl), which show a party's first costume photo, or its invite when it has no photos yet.

The petal (scalloped) mask was replaced; circles, plain rectangles, tilted rectangles and blobs were tried for scene photos and lost to the soft mask. With no welcome photo, the soft shape itself shows, filled in cheek pink. Every photo ships at its desktop and phone widths and at twice each, so 2x screens get a sharp file, 1x screens a small one, and a phone never downloads the 2x desktop file.

### Kicker

A small serif-bold word in terracotta above a section heading ("Bienvenidos"). It's the only place a Spanish word sits above an English heading.

### Button

The one button for actions on every page (links stay words): a hand-pressed pebble ("Pebble slab"), seeded from its label so no two buttons share an outline, sitting on its own darker stone edge 6px below. The label is serif bold at label size, pressed into the stone with a dark lip above and a light one below. Terracotta stone with page-cream letters by default.

- **Hover:** the face lifts 2px and warms toward marigold.
- **Pressed:** a click, or a button that stays down (`aria-pressed` or `.is-down`, like Spin), presses the face flat onto its edge.
- **Focus:** a dashed 2px ring in mole, 8px out.
- **Disabled:** a pale, sunk stone and faded letters.
- **Recolor:** four variables, `--stone`, `--stone-edge`, `--stone-ink` and `--stone-hover`; setting `--stone` alone carries the edge and hover with it. The component is `src/components/Button.astro`.

### Trophy

The real Best Costume trophy, rebuilt as an old PlayStation model: a walnut base and plinth, studded gold rims, a holographic orange column, a ribbed neck and a low-poly pumpkin carved with a classic jack-o'-lantern face (triangle eyes and nose, a grin with two square teeth). Its textures are 32 to 64 pixel crops of Dan's photos of the trophy, drawn in hard pixels, and it keeps the PS1's look: vertices that snap to a 320x240 grid, texture warp on big faces, 15-bit color with ordered dither, and about 24 frames a second. The front plaque reads "BEST COSTUME / DnA's Halloween Party"; the other three sides hold six plates each, Trona black with a gold edge and gold serif lettering (year, names in caps, costume in italic), drawn sharp and unwarped so every name reads. It sits on the page cream with no background, 512px tall on phones and tablets, 672px at lg and 768px from xl (Tailwind's `container-lg`, `-2xl` and `-3xl` sizes, since the spacing steps stop at 384px). It turns once every 40s, and a visitor can drag or flick it, step face to face with the arrow keys (it is a slider that names the side facing them), or stop it with the Pause button, on its own line under the "Drag it" hint; stopped, the stone stays pressed down and reads Spin. Under reduced motion it starts still and the button reads Spin.

### Footer

One centered italic serif line at sign-off size in cream on the page's dark field: "Con cariño · © year The DnA Casa", with "Con cariño" marked as Spanish.

### Motion

Quiet and short: under about 0.5s (other than the ring and the squiggle), no bounce, all of it only under `prefers-reduced-motion: no-preference`. Durations are Tailwind's named steps (0 to 1000ms) and curves are Tailwind's eases (`--ease-out`, `--ease-in-out`); a build test fails on any other.

- The stamp ring turns once every 40s, linear and endless.
- The trophy turns once every 40s too, until a visitor pauses or turns it; a flick coasts and settles back.
- The squiggle paints on left to right once on load, over 1000ms after a 500ms delay, on `--ease-out`.
- The drips run down once on load, over 500ms after a 300ms delay, on the same curve.
- The menu panel fades and slides in (200ms), and its strokes turn into an X.
- On Halloween pages, sections, photos and rows fade up as they scroll into view (CSS scroll-driven animation behind `@supports`; browsers without it show them still).
- Links and Halloween photos react subtly on hover.
- Pages crossfade into each other with CSS `@view-transition`, with no client-side router.

The drips and the scroll fade-ups set each `animation-*` property in longhand, because the build's CSS minifier can fold an `animation` shorthand into a form Chrome drops as invalid.

## Do's and Don'ts

### Do:

- **Do** keep the dark field (mole, or Trona on Halloween pages) and page cream as the only large color fields.
- **Do** take every color from the palette: in CSS, from the Tailwind theme's `--color-*` variables; everywhere else (SVG fills, the theme-color meta, the favicon and the link previews), from the palette module, which a test keeps equal to the theme. The logo's petal oranges are the one exception.
- **Do** keep accents small: a stroke, a circle, a kicker, an underline.
- **Do** pick every text size from the type scale, and every space, size, radius, duration and breakpoint from Tailwind's scales and the allowed-step list in `src/tailwind-steps.ts`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`.
- **Do** check the phone layout at 390px in device emulation.

### Don't:

- **Don't** use pure black, drop shadows or cards.
- **Don't** add a third typeface or another weight without retiring one.
- **Don't** add an accent color for a page, a section or a party.
- **Don't** set body or caption text in terracotta or pink.
- **Don't** add a marquee, a literal house, arches, leaf shadows, sparkles or extra squiggles.
- **Don't** add motion that bounces, loops (other than the ring and the trophy) or runs longer than half a second (other than the ring, the trophy and the squiggle).
