# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro static site. No page ships JavaScript, and every page works with JavaScript off.

- Shapes (the wave, the drip edge, the brush squiggle, the petal mask, the hand-pressed dots for cheeks and the ghost's eyes, the ghost, the menu strokes and the logo strokes) are drawn at build time by seeded generators in `src/lib/shapes.ts`. A seed is a fixed number that makes a shape come out the same way every time, so every deploy looks the same. They use simplex-noise (smooth random wobble), perfect-freehand (brush strokes), d3-shape (curve smoothing) and a hand-written mulberry32 seeded random number generator.
- The favicon is the full Beso logo, saved as an SVG copied from the page's logo markup (a test fails if the two drift apart); its moon turns cream on dark tab bars. sharp renders the PNG favicon sizes and the site's 1200x630 link preview image (the Beso, dark green moon and all, on mole) from that SVG at build time. Each party recap gets its own 1200x630 preview instead, rendered with sharp from the party file: the ghost over "<NAME> · HALLOWEEN <year>" on Trona, with the words turned into Averia Serif Libre 700 outlines by fontkit (a font file reader), since sharp cannot load the web font.
- Halloween parties live in an Astro content collection: one Markdown file per party in `src/content/halloween/`, typed by a schema in `src/content.config.ts`. A party file missing a required field fails the build.
- Page-to-page crossfades use CSS `@view-transition`, not Astro's client router, so no JavaScript ships.
- roughjs and svgo are not used.
- Deploy: on every push to main a GitHub Actions workflow runs the tests, which build the site, and deploys that build to GitHub Pages; a failing test stops the deploy. Canonical domain thedna.casa; www redirects to the apex.

## Users

Friends and family of Dan and Alexis who were sent the link. They arrive curious and friendly, usually on a phone, and stay for a minute or two.

## Product Purpose

A personal home on the web for one household: Dan, Alexis, Milly (dog) and Penny (cat). It says hello warmly and introduces who lives here. Success is a visitor leaving having met all four.

It also keeps the household's parties: one page per Halloween party, so friends can look back at the costumes, the contest and what was new that year.

## Positioning

The site is the household itself. Nothing on it could belong to another family: the names, the pets, the couple's own colors and their sun-and-moon mark.

## Capabilities and Constraints

- Pages:
  - Home: hero, a welcome with one photo, the four members ("Who lives here"), footer with the year.
  - `/halloween/`: a hero with the ghost stamp, then every party, one row per year, newest first: year, party name, theme and a small photo.
  - `/halloween/<year>/`: one party's recap: hero with the party name and theme (no stamp), intro, our costumes, the costume contest, the drinks, new this year.
- A navbar on every page links "Casa" and "Halloween". A section joins the navbar only when it ships.
- Nothing to sell, no sign-up, no contact link, no CMS, no analytics, no search, no RSS, no dark mode.
- Copy and member data live in a TypeScript content module, `src/content.ts`, edited in the repo by Dan and Claude. Changing the words never means touching layout code.
- Each party file holds its year, name, theme, intro (the Markdown body), drinks and who made them, our costumes, the contest (rule, result, winners by first names and costume) and highlights. A photo sits on the costume or highlight it shows, and is a petal unless it says `shape: circle`.
- Photos go in `src/assets/photos/` (party photos in `src/assets/photos/halloween/<year>/`) and are imported in `src/content.ts` or a party file. They must be shown through Astro's `Image` or `Picture` component, which strips EXIF and GPS. Never link a photo's raw source URL: that ships the original file with its GPS.
- Without photos the welcome shows a pink petal shape and each member shows a solid color circle.
- Phone layout (760px and narrower, variant 1 "Stamp first"): one centered column that opens with the turning stamp above the wordmark and "Dan & Alexis", a short hero so the wave and the cream welcome start on the first screen, the welcome words before the petal photo, and the members as rows with a small circle on the left and the name and one-liner on the right.
- Design prototypes were built on the branches `prototype/landing` (all landing variants), `prototype/mobile` and `prototype/halloween` (the Halloween page variants). Nothing from them ships, and there is no `pnpm prototype` command.
- Privacy: public, first names only, photo EXIF/GPS stripped. The welcome names the cities Dan and Alexis have lived in and Alexis' employer, by Dan's choice; nothing narrower than a city (no neighborhood, street or home details). Friends may be named by first name and shown in party photos, by Dan's choice.
- Deferred: a Halloween announcement page, Christmas cards, trips, posts (see `.scratch/TODO.md`).

## Brand Commitments

- Name: "The DnA Casa", set in all caps as THE DnA CASA; subtitle "Dan & Alexis".
- English, with a few Spanish words ("Bienvenidos", "Hola", "Con cariño", the "Casa" nav link). Spanish phrases carry `lang="es"`, except "Hola", which sits inside an English sentence.
- Look (variant 23 "Mole"): a mole-brown (#43262A) hero and footer, a cream (#FAF4EC) middle, one wave between them, and one page-wide grain layer. No pure black anywhere.
- Halloween look: the same system with a Trona black (#201D1E) hero and footer in place of mole, and a drip edge in place of the wave.
- Logo: the Beso sun-and-moon mark (marigold sun, thin moon), set inside a stamp ring that reads "THE DnA CASA · DAN & ALEXIS · CON CARIÑO". On the Halloween list a still cream ghost takes its place, inside a ring that reads "HALLOWEEN · THE DnA CASA · CON CARIÑO". A party recap has no stamp; a party never gets its own mark or ring words.
- Palette: mole #43262A, cream ink #F6E7DA, page cream #FAF4EC, terracotta #C8643C, rosa mexicano #E4007C, marigold gold #F2B233, Salamander green #2F3E3E (Dan), sage #B9C9B4, cheek pink #F7C6D9, blush #F0C7B4, Trona black #201D1E (Halloween pages only). Terracotta is the only orange outside the logo; no page adds its own accent. Member circles, in order: Salamander, rosa mexicano, sage, marigold gold.
- Two fonts only: Averia Serif Libre (headings 700, subtitle and footer italic 400) and Schibsted Grotesk (body 400), self-hosted through Fontsource.
- Type: one shared scale for every page (see DESIGN.md); no page invents its own size.
- Restraint: one squiggle per hero, one edge (wave or drips), solid color fields, no sparkles.
- Motion: quiet and short. The stamp ring turns slowly (about 40s per turn), the squiggle paints on and the drips run once on load, Halloween sections and photos fade up on scroll, the menu slides in, links and photos react on hover, and pages crossfade. All of it runs only under `prefers-reduced-motion: no-preference`.
- Excluded: sugar skulls, sombreros, papel picado, serape stripes, saguaro, rainbow palettes, kitschy sun faces, a scrolling word strip (marquee).
- Rejected directions, settled; do not propose them again: a literal house, many arches (including the terracotta arch from the first brief), leaf or dappled shadows, squiggles everywhere, heavy hand-drawn ornament, house-sign or door metaphors.

## Evidence on Hand

- Photos are in: the welcome shows Dan and Alexis together, and each member has a portrait. The committed files are square crops made with sharp, which leaves out all metadata; the original phone photos stay out of the repo, since it is public.
- The welcome text and the members' lines are Dan's, written with Claude and approved by him. The meta description was written by an agent and waits for Dan's approval.
- The 2026 party (Trick-R-Drink, tiki) has four photos: Dan and Alexis's costumes, Milly and Penny's, the Wanted Wall before the notes went up, and the garage. Its facts are Dan's, and he approved its words.

## Product Principles

1. Meeting the four of them is the point; everything else frames it.
2. Personal over polished: hand-made marks beat stock components.
3. Privacy first: nothing that locates the home itself.
4. Small and finished beats large and partial.
