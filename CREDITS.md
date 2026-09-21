# Credits and attribution

## Creative collaboration

**Mikko Peltonen — creator and creative director.** The museum's concept, project direction,
selection of historical figures and iterative design feedback come from Mikko.

**OpenAI Codex — AI-assisted development collaborator.** Assistance with the React/TypeScript
rebuild, page styling, animations, accessibility, games, next-wing illustrations, synthesized music,
testing and historical-source research. Creative and editorial decisions remain human-directed.
This credit describes the development process, not an AI API integration or an endorsement by OpenAI.

## Music

The century soundscapes are 80-second excerpts, trimmed, faded and re-encoded by
`scripts/build-soundscapes.mjs`, from openly licensed recordings on Wikimedia Commons.

| Century | Work | Performer | Licence | Source |
| --- | --- | --- | --- | --- |
| 17th | Marc-Antoine Charpentier, *Te Deum*, H. 146: Prelude | Ian Dollins | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Charpentier,_Te_Deum_(Prelude).ogg) |
| 18th | J. S. Bach, *Goldberg Variations*, BWV 988: Aria | Kimiko Ishizaka | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_J.S._Bach-_-Open-_Goldberg_Variations,_BWV_988_(Piano)_-_01_Aria.mp3) |
| 19th | Frédéric Chopin, Nocturne in E-flat major, Op. 9 No. 2 | Frank Lévy (Musopen) | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._2_in_E-flat_major,_Op._9_No._2_(Frank_Levy).flac) |
| 20th | Claude Debussy, *Clair de lune* from *Suite bergamasque* | Laurens Goedhart | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg) |

Interface sounds are synthesized in the browser with the Web Audio API.

The next wing uses *Tomorrow, Together*, an original 84 BPM ambient electronic
composition synthesized for this project without samples or external recordings.
Rebuild its stereo loop with `node scripts/build-next-wing-music.mjs` (macOS).

## Images

- **Portraits** in `assets-src/images/portraits/` were previously described as coming from public-domain
  archives and historical collections. The image audit found unresolved attributions and mismatches;
  this collection is not certified as fully authenticated or cleared for reuse. Findings are recorded
  in `IMAGE_REVIEW.md`, with available evidence in `src/data/image-provenance.ts` and the exhibit notes.
- **Notable works** in `assets-src/images/notableWorks/` illustrate events, achievements and works associated
  with each figure.
- Both sets are used for non-commercial, educational purposes. The optimized copies in `public/images/` are
  generated from these originals.
- Educational intent is not a substitute for recording each image's source and reuse terms.
- Nine misleading or insufficiently identified image pairings are withheld from display. Their
  replacements are explicitly labelled, code-drawn collection markers, not historical likenesses
  or facsimiles. Original files are preserved for provenance review, not endorsed for reuse.
- The century backgrounds, era patterns, door art and map decorations are drawn with CSS and SVG. No image
  files are used for them.
- The next-wing scenes are original code-drawn SVG illustrations developed in collaboration with Codex;
  they depict fictional community activities, not documentary historical events.
- Earlier versions used AI-generated decorative backgrounds. Those legacy assets and their original
  attribution remain in git history; they are not evidence of historical events.

## Public material and ownership notice

This project does not own the underlying historical portraits, artworks, music, documents, archive material,
or cultural heritage shown in the museum. Where the material could be identified as public-domain,
openly licensed or otherwise publicly accessible, it is presented for educational and non-commercial
exhibition purposes. Where rights, reproduction history or provenance remain uncertain, the project does
not present the asset as authenticated or cleared for reuse.

The museum is a public educational presentation, not a statement of copyright ownership, authorship or
formal rights clearance. If a visual or audio element lacks a clear source record, it should be treated as
public material under review rather than as verified property of the project or its contributors.

## Map data

Country outlines come from [world-atlas](https://github.com/topojson/world-atlas), which is derived from
[Natural Earth](https://www.naturalearthdata.com/) (public domain).

## Fonts

- [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) by Christian Thalmann, SIL Open Font License 1.1
- [Inter](https://github.com/rsms/inter) by Rasmus Andersson, SIL Open Font License 1.1

## Software

Built with React, React Router, Vite, Tailwind CSS, Motion, Zustand, d3-geo and topojson-client, all under
the MIT or ISC licences.

## Historical content

The original biographies were described as compiled from general educational sources, but did not
include per-person citations. A source-based review of all twenty text records is recorded in
[HISTORICAL_REVIEW.md](HISTORICAL_REVIEW.md). Approved text corrections were applied on 16 September
2026, with source links and review dates in each database record and visitor-facing detail views.
The review is not a guarantee that every statement or illustration is verified and does not establish
whether anyone deliberately altered the content. Historical sources, not the AI collaborator, should
be cited as evidence. The next wing's present-day scenarios and outcome titles are fictional.
