import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { playSfx } from '../../audio/sfx'
import { BrandMark } from '../../components/layout/NavBar'
import { Portrait } from '../../components/person/Portrait'
import { Modal } from '../../components/ui/Modal'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import type { Century } from '../../data/centuries'
import { createMemoryDeck, isPair, memoryStars, type MemoryCard } from '../../lib/games/memory'
import { cn } from '../../lib/cn'
import { getPerson, personsOf } from '../../lib/persons'
import { createRng } from '../../lib/rng'
import { burstAt, burstFrom } from '../../store/effects'
import { useMuseum } from '../../store/museum'

const MATCH_DELAY_MS = 420
const MISMATCH_SHAKE_MS = 550
const MISMATCH_HIDE_MS = 1150

interface MemoryGameProps {
  century: Century
  featuredIds: string[]
  seed?: number
  onExit: () => void
}

interface MemoryResult {
  moves: number
  seconds: number
  stars: 1 | 2 | 3
  newBest: boolean
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function MemoryGame({ century, featuredIds, seed, onExit }: MemoryGameProps) {
  const reduceMotion = useReducedMotion()
  const recordMemory = useMuseum((state) => state.recordMemory)
  const best = useMuseum((state) => state.bestMemoryMoves[century])

  const [game, setGame] = useState(0)
  const deck = useMemo(
    () => createMemoryDeck(personsOf(century), featuredIds, createRng(seed === undefined ? undefined : seed + game)),
    [century, featuredIds, seed, game],
  )
  const pairs = deck.length / 2

  const [faceUp, setFaceUp] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [mismatched, setMismatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  // Timestamps use the event clock (performance.now), not Date.now.
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState<MemoryResult | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (startedAt === null || result) return
    const id = window.setInterval(() => setElapsed(Math.floor((performance.now() - startedAt) / 1000)), 500)
    return () => clearInterval(id)
  }, [startedAt, result])

  const later = (callback: () => void, ms: number) => {
    timers.current.push(window.setTimeout(callback, ms))
  }

  const finish = (finalMoves: number, started: number, finishedAt: number) => {
    setResult({
      moves: finalMoves,
      seconds: Math.round((finishedAt - started) / 1000),
      stars: memoryStars(finalMoves, pairs),
      newBest: recordMemory(century, finalMoves),
    })
    burstAt(window.innerWidth / 2, window.innerHeight / 3, 'confetti')
  }

  const flip = (card: MemoryCard, element: HTMLElement, timeStamp: number) => {
    if (faceUp.length === 2 || faceUp.includes(card.key) || matched.includes(card.personId)) return
    const started = startedAt ?? timeStamp
    if (startedAt === null) setStartedAt(started)
    playSfx('flip')

    const nextFaceUp = [...faceUp, card.key]
    setFaceUp(nextFaceUp)
    if (nextFaceUp.length < 2) return

    const [first, second] = nextFaceUp.map((key) => deck.find((item) => item.key === key)!)
    const nextMoves = moves + 1
    setMoves(nextMoves)

    if (isPair(first, second)) {
      const person = getPerson(first.personId)
      const nextMatched = [...matched, first.personId]
      later(() => {
        setMatched(nextMatched)
        setFaceUp([])
        setAnnouncement(`Match: ${person?.name} and ${person?.work.title}`)
        playSfx('success')
        burstFrom(element)
        if (nextMatched.length === pairs) finish(nextMoves, started, timeStamp + MATCH_DELAY_MS)
      }, MATCH_DELAY_MS)
    } else {
      later(() => {
        setMismatched(nextFaceUp)
        setAnnouncement('Not a pair')
        playSfx('error')
      }, MISMATCH_SHAKE_MS)
      later(() => {
        setFaceUp([])
        setMismatched([])
      }, MISMATCH_HIDE_MS)
    }
  }

  const replay = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setGame((current) => current + 1)
    setFaceUp([])
    setMatched([])
    setMismatched([])
    setMoves(0)
    setStartedAt(null)
    setElapsed(0)
    setResult(null)
  }

  return (
    <div className="game-play">
      <div className="game-status memory-status">
        <p>
          <span className="memory-status__label">Moves</span>
          <strong>{moves}</strong>
        </p>
        <p>
          <span className="memory-status__label">Pairs</span>
          <strong>
            {matched.length}/{pairs}
          </strong>
        </p>
        <p>
          <span className="memory-status__label">Time</span>
          <strong>{formatTime(elapsed)}</strong>
        </p>
        {best !== undefined && (
          <p>
            <span className="memory-status__label">Best</span>
            <strong>{best} moves</strong>
          </p>
        )}
      </div>

      <p className="round__prompt">Pair each portrait with that person’s notable work.</p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <ul key={game} className="memory-grid">
        {deck.map((card, index) => {
          const person = getPerson(card.personId)!
          const isMatched = matched.includes(card.personId)
          const isUp = isMatched || faceUp.includes(card.key)
          const label = card.face === 'portrait' ? person.name : person.work.title

          return (
            <motion.li
              key={card.key}
              initial={{ opacity: 0, y: 30, rotate: index % 2 ? 4 : -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: index * 0.035 }}
            >
              <motion.button
                type="button"
                className={cn('mem-card', isUp && 'is-up', isMatched && 'is-matched', mismatched.includes(card.key) && 'shake')}
                aria-label={isUp ? `${label}${isMatched ? ', matched' : ''}` : `Card ${index + 1}, face down`}
                disabled={isMatched}
                whileTap={reduceMotion ? undefined : { scale: 0.93 }}
                onClick={(event) => flip(card, event.currentTarget, event.timeStamp)}
              >
                <motion.span
                  className="mem-card__inner"
                  initial={false}
                  animate={{ rotateY: isUp ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <span className={`mem-card__face mem-card__back motif-${century}`} aria-hidden="true">
                    <BrandMark />
                  </span>
                  <span className="mem-card__face mem-card__front" aria-hidden="true">
                    <Portrait person={person} kind={card.face === 'portrait' ? 'portraits' : 'works'} sizes="220px" alt="" eager />
                    <span className="mem-card__label">{label}</span>
                  </span>
                </motion.span>
              </motion.button>
            </motion.li>
          )
        })}
      </ul>

      <Modal
        open={result !== null}
        onClose={onExit}
        title={result?.stars === 3 ? 'Perfect memory!' : 'All pairs found'}
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
        {result && (
          <div className="results">
            <p className="results__stars" aria-label={`${result.stars} of 3 stars`}>
              {[1, 2, 3].map((star) => (
                <motion.span
                  key={star}
                  className={cn('results__star', star <= result.stars && 'is-lit')}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.2 + star * 0.18 }}
                >
                  ★
                </motion.span>
              ))}
            </p>
            <p>
              {result.moves} moves in {formatTime(result.seconds)}
            </p>
            {result.newBest && <p className="results__best">New personal best</p>}
          </div>
        )}
      </Modal>
    </div>
  )
}
