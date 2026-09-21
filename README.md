# Century Museum

An interactive museum of twenty people who shaped the 17th to 20th centuries. Walk through a cinematic
entrance, open a wing for each century, collect figures into your own rooms, find them on an antique world
map, trace their lives on a timeline and test yourself in four games, with a soundscape for every age.

Created by **Mikko Peltonen in collaboration with OpenAI Codex**. Mikko provides the concept,
creative direction and feedback; Codex assists with implementation, visual design, animation,
testing and research. This is a human-directed creative project, not an AI API demo.
The current app does not require an AI API key.

## Features

- **The next wing — 2000s.** Scroll below the historical wings to build pressure in a sealed doorway,
  or press and hold it with a pointer or Enter. The seal breaks into `/next-wing`; a direct entrance
  and reduced-motion transition are also available. Four fictional present-day challenges offer
  three decisions each, consequences, and a personalised exhibit saved locally in this browser.
- **Cinematic entrance.** A single, skippable animation timeline (Esc or the Skip button). It plays once per
  session and has a short version for reduced motion.
- **Four century wings.** Each century has its own CSS-drawn scene: animated gradients, era patterns, light
  rays, drifting dust, film grain and pointer parallax. The whole scene crossfades when the century changes.
- **Collect and exhibit.** A swipeable carousel with a wax-seal stamp for chosen figures. Rooms show gilded
  flip cards with biographies and notable works.
- **Games.** Memory, Trait Matcher, Century Pairing and Time Jumpers. Figures from your room appear in every
  round, and best scores are saved.
- **Timeline.** Lifespans from 1540 to 2000 with zoom, drag-to-pan and keyboard navigation.
- **World map.** Pins for the figures in each century's room. Modern borders appear only on the 20th-century map.
- **Soundscapes.** A looping, crossfading track per century, plus interface sounds generated in code.
- **Feedback.** Spring-animated buttons with ripples, glow rings and particle bursts.
- **Accessible by default.** Real buttons and links, native dialogs, keyboard support throughout, a skip link,
  screen-reader announcements and reduced-motion support.

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | Browser tests (Playwright) against the production build. Run `npx playwright install chromium` once first |
| `npm run lint` | Lint with oxlint |
| `npm run images` | Regenerate the WebP images in `public/images` from `assets-src/images` |
| `npm run soundscapes` | Rebuild `public/audio` from Wikimedia Commons (macOS, needs `afconvert`) |

## Tech stack

React 19, TypeScript, Vite, React Router, Tailwind CSS 4, Motion, Zustand, d3-geo with world-atlas,
Vitest and Playwright.

## Project structure

```
src/
  data/          persons.json (the single source of content), century info, types
  lib/           pure logic: games, timeline layout, map projection, helpers (unit-tested)
  store/         saved rooms, audio settings and scores (zustand, localStorage)
  audio/         soundscape engine, synthesized interface sounds, track credits
  components/    layout (navbar, backdrop), UI (buttons, modal, toasts), person views
  features/      pages: intro, hall, collect, room, game, timeline, map
  styles/        theme tokens, CSS scenes and per-feature styles
e2e/             Playwright tests
scripts/         image and soundscape build scripts
assets-src/      original images (not shipped)
public/          optimized images and audio
```

## How the theming works

The current century is written to `<html data-century="…">`. Each century defines a handful of colour
tokens (`--c-deep`, `--c-mid`, `--c-sky`, `--c-accent`, `--c-glow`). They are registered with `@property`,
so the browser can animate between them. Every scene layer, button and card reads those tokens, which is
why the entire museum crossfades when you hover a door or switch centuries. Any element can take on another
century's palette with `data-theme="1700s"`.

## Adding a person

1. Add an entry to `src/data/persons.json`, including `born`, `died`, `traits` and `location`.
2. Put the portrait and notable-work images in `assets-src/images/` and add them to `scripts/optimize-images.mjs`.
3. Run `npm run images` and `npm test`. The data tests check every field and image.

## Historical accuracy

The figures are real historical people; the four present-day stories in the next wing are fictional.
Century placement is an exhibition choice, not a claim that someone lived only in that century.
Map pins identify associated places, not necessarily birthplaces or exact historical boundaries.

See [HISTORICAL_REVIEW.md](HISTORICAL_REVIEW.md) for the September 2026 review of all twenty records,
supporting sources, corrections and unresolved dates. The approved text corrections, qualified date
labels and per-person references were applied on 16 September 2026. Open **Sources & historical context**
in an exhibit or the map/timeline detail panel to read the references. Image provenance remains unverified.
Structural tests do not establish historical accuracy,
and AI assistance is not a historical source. New entries should include documented references and
image provenance; disputed facts should be clearly qualified.

## Rights, provenance and public material

This project does not claim ownership of the historical figures, events, artworks, documents, music,
or other materials presented in the museum. The content is built from public material and public-facing
source records, including publicly accessible archives, museum catalogues, Wikimedia Commons and other
openly distributed educational references when those sources could be identified.

Where a work's rights or provenance are uncertain, the project does not present it as authenticated or
personally owned material. Unresolved or weakly attributed images are withheld or replaced with explicit
collection markers rather than being passed off as historical facsimiles. This is an educational,
non-commercial exhibition project, not a claim of copyright ownership or a substitute for formal rights
clearance.

If a source is not clearly documented, the app should be treated as a presentation of public material under
review rather than as a certified legal source. The project authors do not claim to own the underlying
historical or cultural material shown here.

## Deployment

`.github/workflows/deploy.yml` builds the site with the correct base path and publishes it to GitHub Pages
on every push to `main`. To use it, set **Settings → Pages → Source** to "GitHub Actions". A `404.html`
copy of the app makes direct links to any page work.

## Credits

See [CREDITS.md](CREDITS.md). The original vanilla-JavaScript version of the project remains in the git
history.
