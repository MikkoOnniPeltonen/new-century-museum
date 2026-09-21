import { imageEvidence } from '../../data/image-provenance'
import type { Person } from '../../data/types'

export function ImageNotes({ person }: { person: Person }) {
  return <details className="historical-sources">
    <summary>About these images</summary>
    {(['portraits', 'works'] as const).map((kind) => {
      const evidence = imageEvidence(person.id, kind)
      return <div key={kind}>
        <p><strong>{kind === 'portraits' ? 'Portrait' : 'Work / context'}: {evidence.label}</strong><br />{evidence.note}</p>
        {evidence.source && <a href={evidence.source.url} target="_blank" rel="noreferrer">{evidence.source.title} ↗</a>}
      </div>
    })}
    <p>Image review: <time dateTime="2026-09-17">17 September 2026</time>. Source identification does not establish permission to reproduce an image; rights review remains open.</p>
  </details>
}
