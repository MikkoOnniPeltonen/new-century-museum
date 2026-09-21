import type { Person } from '../../data/types'
import { ImageNotes } from './ImageNotes'

export function HistoricalSources({ person }: { person: Person }) {
  return <><details className="historical-sources">
    <summary>Sources & historical context</summary>
    {person.dateNote && <p>{person.dateNote}</p>}
    <p>Text reviewed <time dateTime={person.reviewedOn}>{person.reviewedOn}</time>. These references support the biography; they do not authenticate the images.</p>
    <ul>{person.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></li>)}</ul>
    <p>Century placement highlights a period of activity. Map pins mark associated places, not necessarily birthplaces; modern borders are not historical boundaries. Game categories describe roles, not moral endorsements.</p>
  </details><ImageNotes person={person} /></>
}
