import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { playSfx } from '../../audio/sfx'
import { ChevronIcon } from '../../components/ui/Icons'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO } from '../../data/centuries'
import type { Person } from '../../data/types'
import { getPerson } from '../../lib/persons'
import { useCentury } from '../../lib/useCentury'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { useMuseum, type GameMode } from '../../store/museum'
import { MemoryGame } from './MemoryGame'
import { RoundGame } from './RoundGame'

type Mode = GameMode | 'memory'

const MODES: { id: Mode; icon: string; title: string; description: string; scope: string }[] = [
  {
    id: 'memory',
    icon: '🧠',
    title: 'Memory',
    description: 'Flip cards to pair each portrait with that person’s notable work.',
    scope: 'This century',
  },
  {
    id: 'trait',
    icon: '🎭',
    title: 'Trait Matcher',
    description: 'Find everyone who shares a role, such as writers or heads of state.',
    scope: 'All centuries',
  },
  {
    id: 'pairing',
    icon: '🕰️',
    title: 'Century Pairing',
    description: 'Place four famous figures in the century they belong to.',
    scope: 'All centuries',
  },
  {
    id: 'jumpers',
    icon: '⚡',
    title: 'Time Jumpers',
    description: 'Spot the two visitors who slipped in from another century.',
    scope: 'Your room’s century',
  },
]

function parseMode(value: string | null): Mode | null {
  return MODES.some((mode) => mode.id === value) ? (value as Mode) : null
}

export function GamePage() {
  const century = useCentury()
  const info = CENTURY_INFO[century]
  const [params, setParams] = useSearchParams()
  const mode = parseMode(params.get('mode'))
  const seedParam = params.get('seed')
  const seed = seedParam === null || Number.isNaN(Number(seedParam)) ? undefined : Number(seedParam)
  const current = MODES.find((item) => item.id === mode)
  useDocumentTitle(current ? `${current.title} · Games` : `Games · ${info.title}`)

  const roomIds = useMuseum((state) => state.rooms[century])
  const bestScores = useMuseum((state) => state.bestScores)
  const bestMemory = useMuseum((state) => state.bestMemoryMoves[century])
  const featured = useMemo(() => roomIds.map(getPerson).filter((person): person is Person => person !== undefined), [roomIds])

  const setMode = (next: Mode | null) => {
    setParams((previous) => {
      const updated = new URLSearchParams(previous)
      if (next) updated.set('mode', next)
      else updated.delete('mode')
      return updated
    })
  }

  const bestLabel = (id: Mode) => {
    if (id === 'memory') return bestMemory === undefined ? 'Not played yet' : `Best: ${bestMemory} moves`
    const best = bestScores[id]
    return best === undefined ? 'Not played yet' : `Best: ${best} points`
  }

  return (
    <section className="game" aria-labelledby="game-title">
      <header className="game__header">
        <div>
          <p className="eyebrow">{info.title} · Games</p>
          <h1 id="game-title" className="game__title">
            {current ? (
              <>
                <span aria-hidden="true">{current.icon}</span> {current.title}
              </>
            ) : (
              'Time Traveler’s Challenge'
            )}
          </h1>
          {!current && <p className="game__lede">Test what you have learned. Figures from your room star in every round.</p>}
        </div>
        {current ? (
          <PressableButton variant="ghost" onClick={() => setMode(null)}>
            <ChevronIcon direction="left" size={16} /> All games
          </PressableButton>
        ) : (
          <PressableLink to={`/room/${century}`} variant="ghost">
            <ChevronIcon direction="left" size={16} /> Back to room
          </PressableLink>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!mode && (
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}>
            {featured.length === 0 && (
              <p className="game__tip panel">
                Tip: <PressableLink to={`/room/${century}/collect`} variant="quiet" size="sm">collect figures</PressableLink> into
                your {info.ordinal} century room and they will appear in every round.
              </p>
            )}
            <motion.ul
              className="modes"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
              {MODES.map((item) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 40, rotate: -2 },
                    show: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
                  }}
                >
                  <motion.button
                    type="button"
                    className="mode-card"
                    whileHover={{ y: -8, rotate: -0.6 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onPointerDown={() => playSfx('tap')}
                    onClick={() => {
                      playSfx('whoosh')
                      setMode(item.id)
                    }}
                  >
                    <span className="mode-card__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="mode-card__scope">{item.scope}</span>
                    <span className="mode-card__title">{item.title}</span>
                    <span className="mode-card__description">{item.description}</span>
                    <span className="mode-card__footer">
                      <span className="mode-card__best">{bestLabel(item.id)}</span>
                      <span className="mode-card__cta">
                        Play <ChevronIcon direction="right" size={16} />
                      </span>
                    </span>
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {mode === 'memory' && (
          <motion.div key="memory" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <MemoryGame century={century} featuredIds={roomIds} seed={seed} onExit={() => setMode(null)} />
          </motion.div>
        )}

        {mode && mode !== 'memory' && (
          <motion.div key={mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoundGame mode={mode} century={century} featured={featured} seed={seed} onExit={() => setMode(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
