import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { Modal } from '../../components/ui/Modal'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO, type Century } from '../../data/centuries'
import type { Person } from '../../data/types'
import { createPairingRound } from '../../lib/games/centuryPairing'
import { MAX_SCORE, POINTS_PER_ROUND, ROUNDS_PER_GAME } from '../../lib/games/scoring'
import { createJumpersRound } from '../../lib/games/timeJumpers'
import { createTraitRound } from '../../lib/games/traitMatch'
import { cn } from '../../lib/cn'
import { PERSONS, traitPlural } from '../../lib/persons'
import { createRng } from '../../lib/rng'
import { burstAt } from '../../store/effects'
import { useMuseum, type GameMode } from '../../store/museum'
import { PairingRound } from './PairingRound'
import { PickRound } from './PickRound'

interface RoundGameProps {
  mode: GameMode
  century: Century
  featured: Person[]
  seed?: number
  onExit: () => void
}

function performanceMessage(score: number) {
  const ratio = score / MAX_SCORE
  if (ratio === 1) return 'Flawless. The curators would like a word about a job offer.'
  if (ratio >= 0.8) return 'Outstanding! You are a true historian.'
  if (ratio >= 0.6) return 'Great work, you know your history.'
  if (ratio >= 0.4) return 'Good effort. Keep exploring the centuries.'
  return 'Nice try! Visit the rooms to learn more, then come back.'
}

export function RoundGame({ mode, century, featured, seed, onExit }: RoundGameProps) {
  const info = CENTURY_INFO[century]
  const recordScore = useMuseum((state) => state.recordScore)

  const [game, setGame] = useState(0)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'playing' | 'revealed' | 'finished'>('playing')
  const [lastPoints, setLastPoints] = useState(0)
  const [newBest, setNewBest] = useState(false)

  const data = useMemo(() => {
    // A fixed ?seed= replays identical rounds (used by the end-to-end tests).
    const rng = createRng(seed === undefined ? undefined : seed + game * 101 + round)
    if (mode === 'trait') return { mode, round: createTraitRound(PERSONS, featured, rng) } as const
    if (mode === 'pairing') return { mode, round: createPairingRound(PERSONS, featured, rng) } as const
    return { mode, round: createJumpersRound(PERSONS, century, featured, rng) } as const
  }, [mode, century, featured, seed, game, round])

  const revealed = phase !== 'playing'
  const isLastRound = round + 1 >= ROUNDS_PER_GAME

  const reveal = (points: number) => {
    setScore((current) => current + points)
    setLastPoints(points)
    setPhase('revealed')
  }

  const next = () => {
    if (!isLastRound) {
      setRound((current) => current + 1)
      setPhase('playing')
      return
    }
    setNewBest(recordScore(mode, score))
    setPhase('finished')
    if (score === MAX_SCORE) burstAt(window.innerWidth / 2, window.innerHeight / 3, 'confetti')
  }

  const replay = () => {
    setGame((current) => current + 1)
    setRound(0)
    setScore(0)
    setPhase('playing')
  }

  const verdict =
    lastPoints === POINTS_PER_ROUND ? 'Correct!' : lastPoints > 0 ? 'Partly right' : 'Not quite, see the answers above'

  return (
    <div className="game-play">
      <div className="game-status" aria-label="Game progress">
        <ol className="rounds" aria-label={`Round ${round + 1} of ${ROUNDS_PER_GAME}`}>
          {Array.from({ length: ROUNDS_PER_GAME }, (_, i) => (
            <li key={i} className={cn('rounds__step', i < round && 'is-done', i === round && 'is-current')} />
          ))}
        </ol>
        <p className="game-score">
          <span className="sr-only">Score </span>
          <AnimatedNumber value={score} className="game-score__value" />
          <span className="game-score__max">/ {MAX_SCORE}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${game}-${round}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {data.mode === 'trait' && (
            <PickRound
              prompt={
                <>
                  Select all the <strong>{traitPlural(data.round.trait)}</strong>
                </>
              }
              options={data.round.options}
              answerIds={data.round.answerIds}
              revealed={revealed}
              revealBadge={(_person, isAnswer) => (isAnswer ? '✓ Yes' : '✗ No')}
              onReveal={reveal}
            />
          )}
          {data.mode === 'jumpers' && (
            <PickRound
              prompt={
                <>
                  Most of these people lived in the <strong>{info.title}</strong>. Find the two time jumpers.
                </>
              }
              options={data.round.options}
              answerIds={data.round.answerIds}
              revealed={revealed}
              revealBadge={(person) => person.century}
              onReveal={reveal}
            />
          )}
          {data.mode === 'pairing' && <PairingRound people={data.round.people} revealed={revealed} onReveal={reveal} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            className={cn('verdict', lastPoints === POINTS_PER_ROUND ? 'verdict--win' : lastPoints > 0 ? 'verdict--partial' : 'verdict--miss')}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          >
            <div>
              <strong className="verdict__title">{verdict}</strong>
              <span className="verdict__points">+{lastPoints} points</span>
            </div>
            <PressableButton size="lg" burst={lastPoints === POINTS_PER_ROUND} onClick={next}>
              {isLastRound ? 'See results' : 'Next round'}
            </PressableButton>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={phase === 'finished'}
        onClose={onExit}
        title={score === MAX_SCORE ? 'A perfect score!' : 'Game complete'}
        footer={
          <>
            <PressableLink to={`/room/${century}`} variant="quiet">
              Back to room
            </PressableLink>
            <PressableButton variant="ghost" onClick={onExit}>
              All games
            </PressableButton>
            <PressableButton burst onClick={replay}>
              Play again
            </PressableButton>
          </>
        }
      >
        <div className="results">
          <p className="results__score">
            <AnimatedNumber value={phase === 'finished' ? score : 0} />
            <span> / {MAX_SCORE}</span>
          </p>
          {newBest && <p className="results__best">New personal best</p>}
          <p>{performanceMessage(score)}</p>
        </div>
      </Modal>
    </div>
  )
}
