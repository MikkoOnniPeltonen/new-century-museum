import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { playSfx } from '../../audio/sfx'
import { Portrait } from '../../components/person/Portrait'
import { HistoricalSources } from '../../components/person/HistoricalSources'
import { PinIcon } from '../../components/ui/Icons'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import type { Person } from '../../data/types'
import { imageEvidence } from '../../data/image-provenance'
import { lifespan } from '../../lib/persons'

const SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw'

interface ExhibitCardProps {
  person: Person
  index: number
  onRemove: () => void
}

export function ExhibitCard({ person, index, onRemove }: ExhibitCardProps) {
  const [flipped, setFlipped] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <motion.li
      layout
      className="exhibit__item"
      // Each card runs its own entrance so it never depends on a parent's variant orchestration.
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{
        default: { type: 'spring', stiffness: 170, damping: 20, delay: index * 0.08 },
        layout: { type: 'spring', stiffness: 300, damping: 30 },
      }}
    >
      <div className="exhibit__spotlight" aria-hidden="true" />

      <motion.button
        type="button"
        className="flip"
        aria-pressed={flipped}
        aria-label={`Turn ${person.name}'s card to see their notable work`}
        whileHover={reduceMotion ? undefined : { y: -6 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        onClick={() => {
          setFlipped((value) => !value)
          playSfx('flip')
        }}
      >
        <motion.span
          className="flip__inner"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 15 }}
        >
          <span className="flip__face flip__face--front gilt">
            <Portrait person={person} className="flip__img" sizes={SIZES} />
            <span className="flip__bio-overlay" aria-hidden="true">
              <span className="eyebrow">In their own time</span>
              <span>{person.bio}</span>
            </span>
            <span className="flip__hint" aria-hidden="true">
              Hover to discover · click for their work
            </span>
          </span>
          <span className="flip__face flip__face--back">
            <Portrait person={person} kind="works" className="flip__img flip__img--work" sizes={SIZES} />
            <span className="flip__work" aria-hidden="true">
              <span className="eyebrow">Notable work</span>
              <strong>{person.work.title}</strong>
              <span>{person.work.description}</span>
            </span>
          </span>
        </motion.span>
      </motion.button>

      <div className="plaque">
        <h2 className="plaque__name">{person.name}</h2>
        <p className="plaque__meta">
          {lifespan(person)} · {person.profession}
        </p>
        <p className="plaque__work">
          <span className="sr-only">Notable work: </span>
          {person.work.title}
        </p>
        <details className="plaque__bio">
          <summary>Biography</summary>
          <p>{person.bio}</p>
          <p className="sr-only">{person.work.description}</p>
        </details>
        <p className="image-caption">{flipped ? 'Work / context' : 'Portrait'} · {imageEvidence(person.id, flipped ? 'works' : 'portraits').label}</p>
        <HistoricalSources person={person} />
        <div className="plaque__actions">
          <PressableLink to={`/map/${person.century}`} variant="quiet" size="sm">
            <PinIcon /> {person.location.label}
          </PressableLink>
          <PressableButton variant="quiet" size="sm" onClick={onRemove}>
            Remove
          </PressableButton>
        </div>
      </div>
    </motion.li>
  )
}
