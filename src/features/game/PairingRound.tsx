import type { PanInfo } from 'motion/react'
import { useRef, useState } from 'react'
import { playSfx } from '../../audio/sfx'
import { Portrait } from '../../components/person/Portrait'
import { PressableButton } from '../../components/ui/Pressable'
import { CENTURIES, CENTURY_INFO, isCentury, type Century } from '../../data/centuries'
import type { Person } from '../../data/types'
import { scorePairing } from '../../lib/games/centuryPairing'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { burstFrom } from '../../store/effects'
import { PersonTile, type TileState } from './PersonTile'

interface PairingRoundProps {
  people: Person[]
  revealed: boolean
  onReveal: (points: number) => void
}

export function PairingRound({ people, revealed, onReveal }: PairingRoundProps) {
  const [assignments, setAssignments] = useState<Partial<Record<string, Century>>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const dragged = useRef(false)
  const slots = useRef<HTMLDivElement>(null)
  const canDrag = useMediaQuery('(pointer: fine)') && !revealed

  const pickedPerson = people.find((person) => person.id === picked)
  const allPlaced = people.every((person) => assignments[person.id])

  const assign = (personId: string, century: Century) => {
    setAssignments((current) => ({ ...current, [personId]: century }))
    setPicked(null)
    playSfx('tap')
  }

  const unassign = (personId: string) => {
    setAssignments((current) => {
      const next = { ...current }
      delete next[personId]
      return next
    })
    playSfx('flip')
  }

  const onDragEnd = (personId: string, info: PanInfo) => {
    // info.point is page-relative; elementsFromPoint wants viewport coordinates.
    const hit = document
      .elementsFromPoint(info.point.x - window.scrollX, info.point.y - window.scrollY)
      .find((element): element is HTMLElement => element instanceof HTMLElement && Boolean(element.dataset.dropCentury))
    const century = hit?.dataset.dropCentury
    if (isCentury(century)) assign(personId, century)
  }

  const submit = () => {
    const result = scorePairing({ people }, assignments)
    if (result.correct === result.total) {
      playSfx('success')
      slots.current?.querySelectorAll('.slot').forEach((slot) => burstFrom(slot))
    } else {
      playSfx(result.correct > 0 ? 'tap' : 'error')
    }
    onReveal(result.points)
  }

  const stateOf = (person: Person): TileState => {
    const placed = assignments[person.id]
    if (revealed) return placed === person.century ? 'correct' : 'wrong'
    if (picked === person.id) return 'selected'
    return placed ? 'placed' : 'idle'
  }

  return (
    <div className="round">
      <p className="round__prompt">
        {canDrag ? 'Drag' : 'Tap'} each person onto the century they belong to.
        {!canDrag && ' Tap a person, then a century.'}
      </p>

      <ul className="tile-grid tile-grid--four">
        {people.map((person, index) => (
          <li key={person.id}>
            <PersonTile
              person={person}
              index={index}
              state={stateOf(person)}
              disabled={revealed}
              aria-pressed={picked === person.id}
              badge={
                revealed
                  ? assignments[person.id] === person.century
                    ? `✓ ${person.century}`
                    : `It was ${person.century}`
                  : assignments[person.id]
              }
              drag={canDrag}
              dragSnapToOrigin
              whileDrag={{ scale: 1.08, zIndex: 20, rotate: -3 }}
              onDragStart={() => {
                dragged.current = true
                setPicked(person.id)
              }}
              onDragEnd={(_event, info) => onDragEnd(person.id, info)}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false
                  return
                }
                setPicked((current) => (current === person.id ? null : person.id))
              }}
            />
          </li>
        ))}
      </ul>

      <div ref={slots} className="slots">
        {CENTURIES.map((century) => {
          const placedHere = people.filter((person) => assignments[person.id] === century)
          return (
            <div key={century} data-theme={century} data-drop-century={century} className={cn('slot', pickedPerson && 'is-ready')}>
              <button
                type="button"
                className="slot__target"
                data-drop-century={century}
                disabled={revealed || !pickedPerson}
                onClick={() => pickedPerson && assign(pickedPerson.id, century)}
              >
                <span className="slot__title">{CENTURY_INFO[century].title}</span>
                <span className="slot__hint">{pickedPerson ? `Place ${pickedPerson.name} here` : CENTURY_INFO[century].epithet}</span>
              </button>
              <div className="slot__chips">
                {placedHere.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    className={cn('chip', revealed && (person.century === century ? 'chip--correct' : 'chip--wrong'))}
                    disabled={revealed}
                    aria-label={`Remove ${person.name} from the ${CENTURY_INFO[century].title}`}
                    onClick={() => unassign(person.id)}
                  >
                    <Portrait person={person} className="chip__img" sizes="40px" alt="" />
                    <span>{person.name}</span>
                    {!revealed && <span aria-hidden="true">×</span>}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {!revealed && (
        <PressableButton size="lg" className="round__submit" disabled={!allPlaced} onClick={submit}>
          Check answer
        </PressableButton>
      )}
    </div>
  )
}
