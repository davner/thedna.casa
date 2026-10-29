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
    fontSize: "min(clamp(3.4rem, 10vw, 9.5rem), 100cqi / var(--ems))"
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
    fontSize: "calc(clamp(3rem, 14vw, 4.2rem) * var(--fit, 1))"
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
  column: "1200px"
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
  button:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.cream-page}"
    typography: "{typography.label}"
  footer:
    backgroundColor: "{colors.mole}"
    textColor: "{colors.cream}"
    padding: "48px 20px 90px"
---

# Design System: The DnA Casa

## Overview

**Creative North Star: "Mole and Marigold"**

The page is two colors holding a household between them: a deep mole brown above and below, a cream middle, and a marigold sun at the top. Everything else is a small accent on those two fields. It should feel warm, restrained and hand-made: a person made it, and they stopped before it got busy.

Density is low. Each section does one thing: the hero names the page, the middle tells the story, and the footer signs off. The hand shows in a few seeded, drawn shapes (one squiggle, one edge between hero and middle, a petal mask, hand-pressed dots, the logo strokes), never in ornament spread across the page. One page-wide grain layer gives both fields a paper feel.

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
- **Cheek** (`cheek`): the cheeks on the Beso and the ghost, and the petal shape that stands in for the welcome photo.
- **Blush** (`blush`): the italic hero subtitle on the dark field.

### Neutral

- **Cream Ink** (`cream`): text and the stamp ring on the dark field, and the ghost's body.
- **Page Cream** (`cream-page`): the middle field on every page.
- **Trona Black** (`trona`): the hero, footer, drips and phone menu field on Halloween pages, and their theme color. A warm near-black, darker than mole.

### Named Rules

**The No Black Rule.** Mole is the darkest color on household pages and Trona black on Halloween pages. Nothing is pure black.

**The One Orange Rule.** Terracotta is the only orange outside the logo. A page or a party never adds its own accent color (pumpkin, lime and plum were tried for Halloween and rejected).

**The Large Terracotta Rule.** Terracotta is about 3.6:1 on page cream, 3.45:1 on mole and 4.26:1 on Trona. Use it for strokes and for text at label size (1.3rem bold) or larger, never for body or caption text.

**The Logo Exception.** The Beso logo's three petal oranges (#D9661A, #EC8A1E, #F5A623) are part of the fixed mark and live in its component, not the palette. They appear nowhere else.

**The Member Color Rule.** Each member owns one color, in order: Salamander (Dan), Rosa Mexicano (Alexis), Sage (Milly), Marigold (Penny). Don't reuse a member's color to mean something else on the same screen.

## Typography

**Display Font:** Averia Serif Libre (fallback serif)
**Body Font:** Schibsted Grotesk (fallback sans-serif)

**Character:** a soft, slightly irregular serif for every heading and the warm asides, and a plain grotesk for reading. Only three faces ship: serif 700, serif italic 400, grotesk 400. All are self-hosted through Fontsource.

### Hierarchy

- **Display:** the hero title, all caps: THE DnA CASA and a party's name, broken between words or after a hyphen wherever it would overflow a 360px phone (TRICK-R- / DRINK, LET'S GET / TIKI FREAKY), the same breaks on every screen; HALLOWEEN on one line. On phones it drops to `clamp(3rem, 14vw, 4.2rem)`, small enough that HALLOWEEN fits inside the 20px hero gutters from 360px up. A party name with a word too wide to break (HOMECOMING) sets `--fit` below 1, shrinking only that page's phone title just enough to fit; every other title keeps the full size.
- **Headline:** section headings on every page. On phones the clamp bottoms out at 2.2rem, which is also the size of the phone menu links.
- **Title:** names and short items: member names, contest winners, the drinks, the new-this-year titles, the year and name on the Halloween list. 1.5rem on phones.
- **Subtitle:** the hero subtitle ("Dan & Alexis", "Our tiki Halloween", "October at the casa"), a recap's date as the subtitle's second line ("Saturday, October 17, 2026"), and a party recap's intro, in italic. One fluid size at every width.
- **Label:** the "Bienvenidos" kicker, a recap's contest result and the desktop nav links. One size at every width.
- **Body:** running text, at most 38ch wide in the welcome. One fluid size at every width.
- **Caption:** member one-liners, photo captions, costume lines, the party theme on the list, "Made by" lines.
- **Ring:** the stamp ring text, 15px in the ring's 200-unit SVG, so it scales with the stamp. A longer ring tightens its spacing, never its size.
- **Sign-off:** the footer, italic at 16px.

### Named Rules

**The One Scale Rule.** Every text size on every page is one of the roles above, and a test fails the build on any `font-size` that is not in this file's front matter. A page never invents its own size; an element that feels too quiet moves up to an existing role instead. Only display and title have separate phone sizes.

**The Two Families Rule.** Averia Serif Libre and Schibsted Grotesk only. A new role picks a weight these two already ship before it adds one.

**The Tight Serif Rule.** Serif headings set tight, between -0.02em and -0.04em letter spacing with line height 1.1 or less. The italic voice resets letter spacing to 0.

## Layout

Every page is built the same way, like Bootstrap's `container-fluid` around a `container`:

- **The hero and navbar run the full width,** padded only by the fluid gutter (`spacing.gutter`). Every hero has the same box, so the title starts at the same left edge on every page, and the stamp sits in the same slot: the right-hand column, `min(380px, 34%)` wide, flush with the right gutter. The words take the rest (`minmax(0, 1fr)`); a title too wide for it, like HALLOWEEN, shrinks to fit (the display size is capped at `100cqi` divided by the title's widest line in ems) rather than pushing the stamp around.
- **Everything below the hero sits in one column** at most `spacing.column` (1200px) wide, centered. Each section's background still runs edge to edge; its content is padded in by `max(gutter, (100% - column) / 2)`, the `--inline` token in the base layout. A section never sets its own max width, so headings, rows and photos share the same left and right edges on every page.

Two-column grids on wide screens use a fluid gap between columns (`spacing.column-gap`). The hero is at least `min(92dvh, 880px)` tall with its padding counted inside (96px top, 150px bottom on every page), so the edge shows at the bottom of the first desktop screen. Its top padding (72px on phones) leaves room for the navbar, which sits over it.

**The Wave On Screen Rule.** At 1440x900 the wave between hero and welcome is visible without scrolling. The welcome is 1fr photo to 1.1fr words. The members sit in four equal columns across the page column.

A party recap has a short hero with no stamp: the party name, the theme with the party's date under it, and the squiggle (its top padding grows to 120 to 180px, 104px on phones). Then the drips, then its sections in the page column: the intro (centered), our costumes (a large petal photo beside a smaller circle photo set lower), the costume contest (heading, rule and result beside the winners as rows; with a photo of the winners and the trophy, the words and rows stack on the left and the photo stands on the right), the drinks (with a photo of the bar beside them when there is one), new this year (photo and words side by side, alternating sides; a highlight with no photo sits centered on its own; a highlight told in frames, like stills from a video, sits centered above a strip of its frames, four across at up to 240px and two across at 160px on phones, rounded 14px, tipped alternately ±1.5deg, each captioned, never masked), and, when the party file has one, the invite (the card shown whole, never masked, 420px wide, 280px on phones, tipped -2deg like a scrapbook cutting; a banner more than twice as wide as it is tall spans the page column, full width on phones, tipped -1deg so its words stay readable). A section the party file has nothing for is left out, so a party known only from its invite shows the hero, the intro and the invite. Section headings sit on the left.

The Halloween list uses the full hero, with the stamp, then the drips, then the trophy (see Trophy), then one row per party, newest first: the year, the name over the theme and the short date ("Sat, Oct 17"), and a small circle photo. Rows are links, divided by hairlines.

One breakpoint, at 760px. Below it every page is one centered column ("Stamp first"):

- The nav links fold into the menu button.
- The stamp, where a hero has one, comes first, then the title and the subtitle.
- The hero is short, so the edge and the cream middle start on the first screen.
- Side-by-side sections stack. The welcome words come before its photo; a highlight's photo comes before its words.
- The members become rows: an 84px circle on the left, the name and one-liner on the right.
- Rows (members, winners, parties) have hairline dividers in mole at 14 to 18%.
- The gutter is 24px (`spacing.gutter-phone`); the hero uses 20px (`spacing.gutter-phone-hero`).

**The First Screen Rule.** On a 390px-wide phone, the edge (wave or drips) and the start of the cream middle are visible without scrolling.

**The No Sideways Scroll Rule.** Nothing scrolls sideways at any width. The hero clips its turning ring horizontally to keep this true.

## Elevation & Depth

The page is flat: no shadows, no cards, no raised surfaces. Depth comes from the two color fields meeting at the edge, and from one fixed grain layer (fractal noise tinted mole, 22% opacity, multiply blend) over everything.

**The One Grain Rule.** One grain layer for the whole page. Sections don't add their own textures.

## Shapes

Shapes are organic and drawn, never boxy. The only hard geometry is the circle: member circles and circle photos. Every other shape comes from a seeded generator, so it's the same on every build:

- the wave between hero and welcome on household pages,
- the drip edge under the hero on Halloween pages,
- the brush squiggle under the subtitle,
- the petal mask that clips large photos (each photo gets its own seed),
- the hand-pressed dots for cheeks and the ghost's eyes,
- the pebble behind every button,
- the ghost's body,
- the three brushed strokes of the menu button,
- the logo strokes.

The site has no rounded rectangles or boxed borders. Its controls are the phone menu button, drawn as three brushed strokes, and the stone button (see Button). The only lines are hairline dividers between rows.

**The Seeded Shape Rule.** A new organic shape comes from the shared seeded generators with a fixed seed, never from randomness at runtime or a stock icon.

**The Hand-Pressed Dot Rule.** Cheeks (the Beso's three and the ghost's two) and the ghost's eyes are seeded dots whose edge wobbles about 7%: never perfect circles, never obviously lumpy. The Beso's closed eyes stay brushed strokes.

**The Restraint Rule.** One squiggle per hero and one edge where the hero meets the middle (the wave, or the drips on Halloween pages). No sparkles. A new shape has to replace one of these or earn a place the same way.

## Components

### Navbar

On every page, over the top of the hero, in cream; it scrolls away with the page. Links: "Casa" (`lang="es"`) and "Halloween"; a section joins only when it ships. "Halloween" is the current page on the list and on every recap. No logo: "Casa" is the way home. On wide screens the links sit inline at label size, the current page underlined in terracotta. At 760px and below a menu button (three brushed strokes that turn into an X) opens a panel in the page's dark field that fills the screen under the bar, so no edge crosses the stamp, with the links at headline size, and the page stops scrolling while it is open. It is an HTML `popover` that follows its button, with CSS only, so it works with JavaScript off. The links are written twice, once inline and once in the panel, and CSS shows one list at each width.

### Stamp

The signature piece. A circle of words set in serif 700 caps with wide 0.08em tracking, in cream on the dark field, around a center mark. On household pages the mark is the Beso sun-and-moon logo at 64%, and the ring reads "THE DnA CASA · DAN & ALEXIS · CON CARIÑO". On the Halloween list the mark is the ghost at 46%, and the ring reads "HALLOWEEN · THE DnA CASA · CON CARIÑO". The stamp belongs to Halloween as a whole: a party recap has no stamp, and a party never gets its own mark or ring words. It is at most 380px wide on desktop and `min(76vw, 300px)` on phones.

### Ghost

The Halloween mark: a cream body drawn from a seeded outline with no outline stroke, like the Beso. Hand-pressed mole eyes and cheek-pink cheeks. It holds still. Each recap's 1200x630 link preview shows it too, 300px tall over "<NAME> · HALLOWEEN <year>" in cream serif 700 caps on Trona; a long name shrinks to fit the margins.

### Brush squiggle

One brush stroke under the hero subtitle, 130px wide (112px on phones): rosa mexicano on household pages, terracotta on Halloween pages.

### Drip edge

The Trona field hanging into the cream under a Halloween hero: 18 seeded drips (seed 66), each a neck with a round bulb, with no line along them. 160px tall on desktop and 104px on phones, sliced at 1:1 so the bulbs never squash; narrow screens see the middle of the edge. The content below starts under the longest drip.

### Member circle

- **Shape:** a full circle (`rounded.circle`), at most 200px on desktop, 84px on phones.
- **Fill:** the member's color, or their portrait cropped to the circle. Each portrait has one plain line of alt text, kept on the member's data: who it is and what they are doing or wearing.

### Photos

Large photos (the welcome photo, a couple's costume photo, the contest, drinks and new-this-year photos) are clipped by the seeded petal mask, each with its own seed, 420 to 500px square at most (280 to 300px on phones). Smaller photos are circles: the pets' costume photo (340px, 220px on phones) and the Halloween list thumbnails (72 to 112px), which show a party's first costume photo, or its invite when it has no photos yet. In a party file a photo is a petal unless it says `shape: circle`. With no welcome photo, the petal shape itself shows, filled in cheek pink. Every photo ships at its largest shown width and at twice that, so 2x screens get a sharp file and 1x screens a small one.

### Kicker

A small serif-bold word in terracotta above a section heading ("Bienvenidos"). It's the only place a Spanish word sits above an English heading.

### Button

The one button for actions on every page (links stay words): a hand-pressed pebble ("Pebble slab"), seeded from its label so no two buttons share an outline, sitting on its own darker stone edge 6px below. The label is serif bold at label size, pressed into the stone with a dark lip above and a light one below. Terracotta stone with page-cream letters by default.

- **Hover:** the face lifts 2px and warms toward marigold.
- **Pressed:** a click, or a button that stays down (`aria-pressed` or `.is-down`, like Spin), presses the face flat onto its edge.
- **Focus:** a dashed 2px ring in mole, 6px out.
- **Disabled:** a pale, sunk stone and faded letters.
- **Recolor:** four variables, `--stone`, `--stone-edge`, `--stone-ink` and `--stone-hover`; setting `--stone` alone carries the edge and hover with it. The component is `src/components/Button.astro`.

### Trophy

The real Best Costume trophy, rebuilt as an old PlayStation model: a walnut base and plinth, studded gold rims, a holographic orange column, a ribbed neck and a low-poly pumpkin carved with a classic jack-o'-lantern face (triangle eyes and nose, a grin with two square teeth). Its textures are 32 to 64 pixel crops of Dan's photos of the trophy, drawn in hard pixels, and it keeps the PS1's look: vertices that snap to a 320x240 grid, texture warp on big faces, 15-bit color with ordered dither, and about 24 frames a second. The front plaque reads "BEST COSTUME / DnA's Halloween Party"; the other three sides hold six plates each, Trona black with a gold edge and gold serif lettering (year, names in caps, costume in italic), drawn sharp and unwarped so every name reads. It sits on the page cream with no background, up to 820px tall (480px on phones). It turns once every 40s, and a visitor can drag or flick it, step face to face with the arrow keys (it is a slider that names the side facing them), or stop it with the Pause button, on its own line under the "Drag it" hint; stopped, the stone stays pressed down and reads Spin. Under reduced motion it starts still and the button reads Spin.

### Footer

One centered italic serif line at sign-off size in cream on the page's dark field: "Con cariño · © year The DnA Casa", with "Con cariño" marked as Spanish.

### Motion

Quiet and short: under about 0.5s (other than the ring and the squiggle), no bounce, all of it only under `prefers-reduced-motion: no-preference`.

- The stamp ring turns once every 40s, linear and endless.
- The trophy turns once every 40s too, until a visitor pauses or turns it; a flick coasts and settles back.
- The squiggle paints on left to right once on load, over 1.6s after a 0.4s delay, with `cubic-bezier(0.16, 1, 0.3, 1)`.
- The drips run down once on load, over 0.5s after a 0.25s delay, with the same curve.
- The menu panel fades and slides in (about 200ms), and its strokes turn into an X.
- On Halloween pages, sections, photos and rows fade up as they scroll into view (CSS scroll-driven animation behind `@supports`; browsers without it show them still).
- Links and Halloween photos react subtly on hover.
- Pages crossfade into each other with CSS `@view-transition`, with no client-side router.

The drips and the scroll fade-ups set each `animation-*` property in longhand, because the build's CSS minifier can fold an `animation` shorthand into a form Chrome drops as invalid.

## Do's and Don'ts

### Do:

- **Do** keep the dark field (mole, or Trona on Halloween pages) and page cream as the only large color fields.
- **Do** take every color from the palette module, which feeds CSS, SVG fills, the theme-color meta, the favicon and the link previews. The logo's petal oranges are the one exception.
- **Do** keep accents small: a stroke, a circle, a kicker, an underline.
- **Do** pick every text size from the type scale.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`.
- **Do** check the phone layout at 390px in device emulation.

### Don't:

- **Don't** use pure black, drop shadows or cards.
- **Don't** add a third typeface or another weight without retiring one.
- **Don't** add an accent color for a page, a section or a party.
- **Don't** set body or caption text in terracotta or pink.
- **Don't** add a marquee, a literal house, arches, leaf shadows, sparkles or extra squiggles.
- **Don't** add motion that bounces, loops (other than the ring and the trophy) or runs longer than half a second (other than the ring, the trophy and the squiggle).
