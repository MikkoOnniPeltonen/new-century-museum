import type { Person } from '../../data/types'
import { imageEvidence } from '../../data/image-provenance'
import { imageSrc, imageSrcSet, type ImageKind } from '../../lib/persons'

interface PortraitProps {
  person: Person
  kind?: ImageKind
  sizes?: string
  className?: string
  alt?: string
  eager?: boolean
}

export function Portrait({ person, kind = 'portraits', sizes = '(min-width: 768px) 380px, 90vw', className, alt, eager }: PortraitProps) {
  const evidence = imageEvidence(person.id, kind)
  return (
    <img
      src={imageSrc(kind, person.id)}
      srcSet={imageSrcSet(kind, person.id)}
      sizes={sizes}
      alt={alt ?? (evidence.withheld ? `Collection marker for ${person.name}; ${kind === 'portraits' ? 'portrait' : 'work image'} awaiting verification` : `${kind === 'portraits' ? `Image associated with ${person.name}` : `Image accompanying ${person.work.title}`} — ${evidence.label}`)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={className}
    />
  )
}
