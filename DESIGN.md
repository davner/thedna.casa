---
name: The DnA Casa
description: A warm, restrained, hand-made home page for one household.
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
    fontSize: "clamp(3.4rem, 10vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "clamp(2.2rem, 4.4vw, 3.8rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "1.7rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)"
    fontWeight: 400
    letterSpacing: "0"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.03em"
  label:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "1.3rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  display-phone:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "clamp(3rem, 15vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 0.88
  title-phone:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "1.5rem"
    fontWeight: 700
  caption:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  ring:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.08em"
  signoff:
    fontFamily: "Averia Serif Libre, serif"
    fontSize: "1rem"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  circle: "50%"
spacing:
  gutter: "clamp(20px, 6vw, 96px)"
  column-gap: "clamp(32px, 6vw, 96px)"
  gutter-phone: "24px"
  gutter-phone-hero: "20px"
components:
  member-circle:
    backgroundColor: "{colors.salamander}"
    rounded: "{rounded.circle}"
    width: "200px"
  member-circle-phone:
    rounded: "{rounded.circle}"
    width: "84px"
  kicker:
    textColor: "{colors.terra}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.cream}"
    typography: "{typography.label}"
  menu-link:
    textColor: "{colors.cream}"
    typography: "{typography.headline}"
  footer:
    backgroundColor: "{colors.mole}"
    textColor: "{colors.cream}"
    padding: "48px 20px 90px"
---

# Design System: The DnA Casa

## Overview

**Creative North Star: "Mole and Marigold"**

The page is two colors holding a household between them: a deep mole brown above and below, a cream middle, and a marigold sun at the top. Everything else is a small accent on those two fields. It should feel warm, restrained and hand-made: a person made it, and they stopped before it got busy.

Density is low. Each section does one thing: the hero names the house, the welcome says hello, the members introduce the four of them, and the footer signs off. The hand shows in a few seeded, drawn shapes (one wave, one squiggle, a petal mask, the logo strokes), never in ornament spread across the page. One page-wide grain layer gives both fields a paper feel.

Rejected and settled: a literal house, many arches, leaf or dappled shadows, squiggles everywhere, heavy hand-drawn ornament, a scrolling word strip, sparkles.

**Key Characteristics:**
- Two big color fields, mole and cream, joined by one wave.
- Big, tight, all-caps serif wordmark; italic serif for the soft voice.
- Accents (pink, gold, terra) only in small doses.
- Flat surfaces; depth from grain, not shadows.
- Quiet motion, all of it off under reduced motion.

## Colors

A deep, warm brown and two creams carry the page; the saturated colors are accents and member identities.

### Primary
- **Mole** (`mole`): the hero and footer field, the ink on cream, the welcome heading and the ghost's eyes. The browser theme color. It stands in for black everywhere.
- **Marigold** (`gold`): the logo's sun, Penny's circle.

### Secondary
- **Rosa Mexicano** (`pink`): Alexis's color. The squiggle, Alexis's circle, the text selection highlight.
- **Terracotta** (`terra`): the one orange. Section headings and large text on cream ("Who lives here", "Bienvenidos", every Halloween heading, the contest result, the year on the Halloween list). On the dark fields: the Halloween squiggle, the nav's current-page underline and focus ring. Large or bold text only. The welcome heading stays mole.

### Tertiary
- **Salamander** (`salamander`): Dan's color, his member circle.
- **Sage** (`sage`): Milly's circle.
- **Cheek** (`cheek`): the cheeks on the Beso and the ghost, and the petal shape that stands in for the welcome photo.
- **Blush** (`blush`): the italic hero subtitle on the dark field.

### Neutral
- **Cream Ink** (`cream`): text and the stamp ring on the dark field, and the ghost's body.
- **Page Cream** (`cream-page`): the middle field on every page.
- **Trona Black** (`trona`): the hero, footer and phone menu field on Halloween pages, and their theme color. A warm near-black, darker than mole.

### Named Rules
**The No Black Rule.** Mole is the darkest color on household pages and Trona black on Halloween pages. Nothing is pure black.

**The Large Terracotta Rule.** Terracotta on page cream is about 3.6:1, which passes only as large text. Use it at 1.2rem bold or larger, never for body text.

**The Logo Exception.** The Beso logo's three petal oranges (#D9661A, #EC8A1E, #F5A623) are part of the fixed mark and live in its component, not the palette. They appear nowhere else.

**The Member Color Rule.** Each member owns one color, in order: Salamander (Dan), Rosa Mexicano (Alexis), Sage (Milly), Marigold (Penny). Don't reuse a member's color to mean something else on the same screen.

## Typography

**Display Font:** Averia Serif Libre (fallback serif)
**Body Font:** Schibsted Grotesk (fallback sans-serif)

**Character:** a soft, slightly irregular serif for every heading and the warm asides, and a plain grotesk for reading. Only three faces ship: serif 700, serif italic 400, grotesk 400. All are self-hosted through Fontsource.

### Hierarchy
- **Display:** the hero title, all caps on two lines: THE DnA CASA, a party's name (TRICK-R-DRINK), HALLOWEEN. On phones it drops to `clamp(3rem, 15vw, 4.2rem)`.
- **Headline:** section headings ("Hola, we're Dan & Alexis.", "Who lives here"). On phones the clamp bottoms out at 2.2rem, which is also the size of the phone menu links.
- **Title:** names and short items: member names, contest winners, the drinks, the new-this-year titles, the year and name on the Halloween list. 1.5rem on phones.
- **Subtitle:** the hero subtitle ("Dan & Alexis", "Our tiki Halloween", "October at the casa") and a party recap's intro, in italic. One fluid size at every width.
- **Sign-off:** the footer, italic at the 16px body size.
- **Body:** the welcome text, at most 38ch wide.
- **Caption:** member one-liners, photo captions, costume lines, the party theme on the list, "Made by" lines, at 1rem.
- **Ring:** the stamp ring text, 15px in the ring's 200-unit SVG, so it scales with the stamp.
- **Label:** the "Bienvenidos" kicker and a recap's contest result, in terracotta, and the desktop nav links in cream.

### Named Rules
**The One Scale Rule.** Every text size on every page is one of the roles above. A page never invents its own size; an element that feels too quiet moves up to an existing role instead. Only display and title have separate phone sizes.

**The Two Families Rule.** Averia Serif Libre and Schibsted Grotesk only. A new role picks a weight these two already ship before it adds one.

**The Tight Serif Rule.** Serif headings set tight, between -0.02em and -0.04em letter spacing with line height 1 or less. The italic voice resets letter spacing to 0.

## Layout

Two-column grids on wide screens, padded by a fluid gutter (`spacing.gutter`), with a fluid gap between columns (`spacing.column-gap`). The hero is 1.2fr words to 1fr stamp, at least `min(92dvh, 880px)` tall with its padding counted inside, so the wave shows at the bottom of the first desktop screen. Its top padding (96px, 72px on phones) leaves room for the navbar, which sits over it.

**The Wave On Screen Rule.** At 1440x900 the wave between hero and welcome is visible without scrolling. The welcome is 1fr photo to 1.1fr words. The members sit in four equal columns, at most 1000px wide and centered.

The Halloween list has a short hero with no stamp, then the drips, then one row per party, newest first: the year, the name over the theme, and a small circle photo. Rows are links, divided by hairlines.

One breakpoint, at 760px. Below it the page is one centered column ("Stamp first"):
- The nav links fold into the menu button.
- The stamp comes first, then the wordmark and the subtitle.
- The hero is short, so the wave and the cream welcome start on the first screen.
- The welcome words come before the petal photo.
- The members become rows: an 84px circle on the left, the name and one-liner on the right, with hairline dividers in mole at 14%.
- The gutter is 24px (`spacing.gutter-phone`); the hero uses 20px (`spacing.gutter-phone-hero`).

**The First Screen Rule.** On a 390px-wide phone, the edge (wave or drips) and the start of the cream middle are visible without scrolling.

**The No Sideways Scroll Rule.** Nothing scrolls sideways at any width. The hero clips its turning ring horizontally to keep this true.

## Elevation & Depth

The page is flat: no shadows, no cards, no raised surfaces. Depth comes from the two color fields meeting at the edge (the wave, or the drips on Halloween pages), and from one fixed grain layer (fractal noise tinted mole, 22% opacity, multiply blend) over everything.

**The One Grain Rule.** One grain layer for the whole page. Sections don't add their own textures.

## Shapes

Shapes are organic and drawn, never boxy. The only hard geometry is the member circle. Every other shape comes from a seeded generator, so it's the same on every build:
- the wave between hero and welcome on household pages,
- the drip edge under the hero on Halloween pages,
- the brush squiggle under the subtitle,
- the petal mask that clips the welcome photo,
- the hand-pressed dots for eyes and cheeks,
- the ghost's body,
- the logo strokes,
- the three brushed strokes of the menu button.

The site has no rounded rectangles, boxed borders or boxed buttons. The one control is the phone menu button, drawn as three brushed strokes. The only lines are the hairline dividers between member rows on phones.

**The Seeded Shape Rule.** A new organic shape comes from the shared seeded generators with a fixed seed, never from randomness at runtime or a stock icon.

**The Restraint Rule.** One squiggle per hero and one edge where the hero meets the middle (the wave, or the drips on Halloween pages). No sparkles. A new shape has to replace one of these or earn a place the same way.

## Components

### Navbar
On every page, over the top of the hero, in cream; it scrolls away with the page. Links: "Casa" (`lang="es"`) and "Halloween"; a section joins only when it ships. No logo: "Casa" is the way home. On wide screens the links sit inline at label size, the current page underlined in terracotta. At 760px and below a menu button (three brushed strokes that turn into an X) opens a full-width panel in the page's dark field, under the bar, with the links at headline size. It is an HTML `popover` with CSS only, so it works with JavaScript off.
- **Motion:** the panel fades and slides in (about 200ms) and the strokes turn into an X; links react on hover. Pages crossfade into each other with CSS `@view-transition`, with no client-side router. All of it runs only under `prefers-reduced-motion: no-preference`.

### Stamp
The signature piece. A circle of words set in serif 700 caps with wide 0.08em tracking, in cream on the dark field, around a center mark. On household pages the mark is the Beso sun-and-moon logo (marigold sun, thin moon) at 64%, and the ring reads "THE DnA CASA · DAN & ALEXIS · CON CARIÑO". On a party recap the mark is the ghost at 46%, and the ring reads the party's name, "HALLOWEEN" and the year, then "THE DnA CASA". A longer ring tightens its spacing, never its size. It is at most 380px wide on desktop and `min(76vw, 300px)` on phones.
- **Motion:** the ring turns once every 40s, linear and endless. It runs only under `prefers-reduced-motion: no-preference`.

### Ghost
The Halloween mark: a cream body drawn from a seeded outline with no outline stroke, like the Beso. Hand-pressed mole eyes and cheek-pink cheeks. It holds still.

### Brush squiggle
One brush stroke under the hero subtitle, 130px wide (112px on phones): rosa mexicano on household pages, terracotta on Halloween pages.
- **Motion:** it paints on left to right once on load, over 1.6s after a 0.4s delay, with `cubic-bezier(0.16, 1, 0.3, 1)`. It runs only under `prefers-reduced-motion: no-preference`.

### Drip edge
The Trona field hanging into the cream under a Halloween hero: 18 seeded drips (seed 66), each a neck with a round bulb. 160px tall on desktop and 104px on phones, sliced at 1:1 so the bulbs never squash; narrow screens see the middle of the edge. The content below starts under the longest drip.
- **Motion:** the drips run down once on load, over 0.5s after a 0.25s delay, with `cubic-bezier(0.16, 1, 0.3, 1)`. It runs only under `prefers-reduced-motion: no-preference`.

### Member circle
- **Shape:** a full circle (`rounded.circle`), at most 200px on desktop, 84px on phones.
- **Fill:** the member's color, or their portrait cropped to the circle. Portraits have empty alt text, because the name heading beside them says who it is.

### Photos
Large photos (the welcome photo, a couple's costume photo, new-this-year photos) are clipped by the seeded petal mask, each with its own seed, 420 to 500px square at most (280 to 300px on phones). Smaller photos are circles: the pets' costume photo (340px, 220px on phones) and the Halloween list thumbnails (72 to 112px). With no welcome photo, the petal shape itself shows, filled in cheek pink.

### Kicker
A small serif-bold word in terracotta above a section heading ("Bienvenidos"). It's the only place a Spanish word sits above an English heading.

### Footer
One centered italic serif line at body size in cream on the page's dark field: "Con cariño · © year The DnA Casa".

## Do's and Don'ts

### Do:
- **Do** keep mole and page cream as the only large color fields.
- **Do** take every color from the palette module, which feeds CSS, SVG fills, the theme-color meta and the favicon. The logo's petal oranges are the one exception.
- **Do** keep accents small: a stroke, a circle, a kicker.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`.
- **Do** check the phone layout at 390px in device emulation.

### Don't:
- **Don't** use pure black, drop shadows or cards.
- **Don't** add a third typeface or another weight without retiring one.
- **Don't** set body text in terracotta or pink on cream.
- **Don't** add a marquee, a literal house, arches, leaf shadows, sparkles or extra squiggles.
- **Don't** add motion that bounces, loops (other than the ring) or runs longer than half a second (other than the ring and the squiggle). Beyond those two, recap sections and photos fade up as they scroll into view (CSS scroll-driven animation behind `@supports`), photos and links react subtly on hover, the phone menu slides in, and pages crossfade.
