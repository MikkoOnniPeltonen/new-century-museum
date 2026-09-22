/** Image evidence is separate from the references supporting a person's biography. */
export interface ImageEvidence {
  withheld?: boolean
  label: string
  note: string
  source?: { title: string; url: string }
}

type Kind = 'portraits' | 'works'
const source = (title: string, url: string) => ({ title, url })
const withheld = (note: string): ImageEvidence => ({ withheld: true, label: 'Image awaiting verification', note })

export const IMAGE_EVIDENCE: Record<string, Partial<Record<Kind, ImageEvidence>>> = {
  'olaudah-equiano': {
    portraits: { label: '1789 engraving · Daniel Orme after W. Denton', note: 'This documented portrait was published in 1789 and is held by the National Portrait Gallery as NPG D8546. It is a historical engraving, not a photograph.', source: source('National Portrait Gallery: Equiano portrait', 'https://www.npg.org.uk/collections/search/portrait?locid=1035&mkey=mw42525&rNo=18&wPage=0') },
    works: { label: '1789 autobiography · frontispiece and title page', note: 'The image shows the frontispiece and title page of The Interesting Narrative. The Library of Congress record identifies the scanned object and reports no known publication restrictions for the file.', source: source('Library of Congress: scanned title page', 'https://www.loc.gov/pictures/item/98501896/') },
  },
  bahaullah: {
    works: { ...withheld('The previous title page credited Horace Holley, not Bahá’u’lláh, and was not the Kitáb-i-Aqdas.'), source: source('Previous image: Horace Holley’s book', 'https://file.bahai.media/a/a6/Revelation_of_Baha%27u%27llah.pdf') },
  },
  'simon-bolivar': { works: withheld('The previous historical painting was not a reproduction of the Jamaica Letter. A sourced facsimile is still needed.') },
  'maria-merian': {
    portraits: { label: 'c.1717 engraving · Jacob Houbraken after Georg Gsell', note: 'The Rijksmuseum identifies this engraving as a portrait of Maria Sibylla Merian and marks the object public domain. The Commons scan records the c.1717 source edition.', source: source('Rijksmuseum: portrait record', 'https://id.rijksmuseum.nl/200206122') },
    works: { label: 'Hand-coloured plate · 1705', note: 'This plate comes from Merian’s Metamorphosis insectorum Surinamensium. It depicts an insect life cycle with its host plant; the original plate is public domain.', source: source('Harn Museum: Merian, Plate 8', 'https://harn.emuseum.com/objects/13939/plate-8') },
  },
  'ibrahim-muteferrika': { works: withheld('The pictured book could not be established as the Vankulu dictionary. Its image is withheld pending a matching library record.') },
  'ada-lovelace': {
    portraits: { label: 'Historical watercolour · attribution qualified', note: 'Corresponds to the Science Museum watercolour, catalogued as possibly Alfred Edward Chalon, c.1840. The precise reproduction source remains under review.', source: source('Science Museum: portrait record', 'https://collection.sciencemuseumgroup.org.uk/objects/co67823/portrait-of-ada-countess-of-lovelace') },
    works: withheld('The previous machine photograph was not established as the Analytical Engine. Lovelace wrote notes about that proposed machine; she did not build the pictured apparatus.'),
  },
  'liu-mingchuan': { works: withheld('The previous photograph showed an unidentified gate, not the railway or telegraph projects described here.') },
  'queen-nzinga': {
    portraits: { label: 'Later depiction · 1830s', note: 'Achille Devéria, after an unknown artist. A hand-coloured lithograph made long after Nzinga’s lifetime, not a contemporary likeness. Original file metadata identifies NPG D34632.', source: source('National Portrait Gallery: object record', 'https://www.npg.org.uk/collections/search/portrait/mw150782/Queen-Nzinga-Mbande-Anna-de-Sousa-Nzinga') },
    works: { label: 'Historical engraving · source unresolved', note: 'The panels depict a miraculous crucifix and a representation of Queen Zingha’s court. They are not a direct record of her diplomacy; publication and date remain unverified.' },
  },
  'nelson-mandela': { works: { label: 'Return visit · 1994', note: 'Jürgen Schadeberg’s photograph of Mandela revisiting his Robben Island cell in 1994, not a photograph taken during imprisonment. Copyright information is recorded by the archive.', source: source('Archive: 1994 revisit photograph', 'https://obama.artifacts.archives.gov/objects/36029/nelson-mandela-in-his-cell-on-robben-island-revisit-1994') } },
  'george-washington': { works: { label: 'Later history painting · 1851', note: 'Emanuel Leutze’s Washington Crossing the Delaware depicts the crossing in 1776. This is a later interpretation, not an eyewitness image.', source: source('Metropolitan Museum: painting study', 'https://www.metmuseum.org/de/met-publications/washington-crossing-the-delaware-restoring-an-american-masterpiece') } },
  'sor-juana': { works: { label: 'Printed book · edition unverified', note: 'Printed pages headed “Crisis sobre un sermon…”, with an engraved portrait. Not a handwritten manuscript; the exact edition remains unresolved.' } },
  'isaac-newton': { works: { label: 'Printed title page · edition unverified', note: 'The visible title is Principia Mathematica. The exact edition and source library copy have not been established.' } },
  voltaire: {
    portraits: { label: 'Painted portrait · metadata attribution', note: 'Embedded metadata identifies Nicolas de Largillière, Voltaire in 1718, Musée Carnavalet. The reproduction source and reuse terms still need documentation.' },
    works: { label: 'Printed title page · dated 1759', note: 'The visible title is Candide and the printed date is 1759. The exact edition and scan provenance remain unresolved.' },
  },
  'shah-abbas': { works: { label: 'Contextual city engraving', note: 'An engraved panorama labelled Ispahan. Engraver and publication date remain unresolved; it is not established as a view from Abbas’s reign.' } },
  'tokugawa-ieyasu': { works: { label: 'Contextual painted panorama', note: 'The screen’s exact identity and date remain unresolved. It must not be read as a record of buildings personally commissioned by Ieyasu.' } },
  napoleon: { works: { label: 'Later ceremonial painting', note: 'A reproduction of David’s coronation composition, depicting the 1804 ceremony. Exact version and reproduction source remain under review.' } },
  'albert-einstein': { works: { label: 'Popular exposition · edition unverified', note: 'Relativity: The Special and General Theory, translated by Robert W. Lawson. Not a reproduction of the original 1905 or 1915 scientific papers.' } },
  fdr: { works: { label: 'Social Security Act signing · 1935', note: 'Corresponds to the signing scene documented by the Social Security Administration. The exact frame and reproduction history remain under review.', source: source('SSA: signing photographs and context', 'https://www.ssa.gov/history/fdrsign.html') } },
}

export function imageEvidence(id: string, kind: Kind): ImageEvidence {
  return IMAGE_EVIDENCE[id]?.[kind] ?? {
    label: 'Image provenance under review',
    note: kind === 'portraits'
      ? 'The exact artwork or photographic source, date and attribution have not yet been verified. This image is not certified as an authenticated likeness.'
      : 'The exact image source, event date and attribution have not yet been verified. Treat this as contextual imagery, not an authenticated original work.',
  }
}
