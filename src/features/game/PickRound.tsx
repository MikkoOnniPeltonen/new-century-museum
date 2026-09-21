import { useRef, useState, type ReactNode } from 'react'
import { playSfx } from '../../audio/sfx'
import { PressableButton } from '../../components/ui/Pressable'
import type { Person } from '../../data/types'
import { isExactSelection, POINTS_PER_ROUND } from '../../lib/games/scoring'
import { burstFrom } from '../../store/effects'
import { PersonTile, type TileState } from './PersonTile'

interface PickRoundProps {
  prompt: ReactNode
  options: Person[]
  answerIds: string[]
  revealed: boolean
  /** Badge shown on each tile once the answer is revealed */
  revealBadge: (person: Person, isAnswer: boolean) => string
  onReveal: (points: number) => void
}

/** Shared by Trait Matcher and Time Jumpers: pick every correct person, then reveal. */
export function PickRound({ prompt, options, answerIds, revealed, revealBadge, onReveal }: PickRoundProps) {
  const [selected, setSelected] = useState<string[]>([])
  const grid = useRef<HTMLUListElement>(null)

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const submit = () => {
    const correct = isExactSelection(answerIds, selected)
    if (correct) {
      playSfx('success')
      for (const id of answerIds) {
        const tile = grid.current?.querySelector(`[data-person="${id}"]`)
        if (tile) burstFrom(tile)
      }
    } else {
      playSfx('error')
    }
    onReveal(correct ? POINTS_PER_ROUND : 0)
  }

  const stateOf = (person: Person): TileState => {
    const isSelected = selected.includes(person.id)
    const isAnswer = answerIds.includes(person.id)
    if (!revealed) return isSelected ? 'selected' : 'idle'
    if (isAnswer) return isSelected ? 'correct' : 'missed'
    return isSelected ? 'wrong' : 'dimmed'
  }

  return (
    <div className="round">
      <p className="round__prompt">{prompt}</p>
      <ul ref={grid} className="tile-grid">
        {options.map((person, index) => (
          <li key={person.id}>
            <PersonTile
              person={person}
              index={index}
              state={stateOf(person)}
              aria-pressed={selected.includes(person.id)}
              disabled={revealed}
              badge={revealed ? revealBadge(person, answerIds.includes(person.id)) : undefined}
              onClick={() => toggle(person.id)}
            />
          </li>
        ))}
      </ul>
      {!revealed && (
        <PressableButton size="lg" className="round__submit" disabled={selected.length === 0} onClick={submit}>
          Check answer
        </PressableButton>
      )}
    </div>
  )
}
