import { AnimatePresence, motion } from 'motion/react'
import { BrandMark } from '../../components/layout/NavBar'
import { PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO } from '../../data/centuries'
import type { Person } from '../../data/types'
import { getPerson, personsOf } from '../../lib/persons'
import { useCentury } from '../../lib/useCentury'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { showToast } from '../../store/effects'
import { useMuseum } from '../../store/museum'
import { ExhibitCard } from './ExhibitCard'

export function RoomPage() {
  const century = useCentury()
  const info = CENTURY_INFO[century]
  useDocumentTitle(`${info.title} room`)

  const ids = useMuseum((state) => state.rooms[century])
  const removeFromRoom = useMuseum((state) => state.removeFromRoom)
  const people = ids.map(getPerson).filter((person): person is Person => person !== undefined)
  const total = personsOf(century).length
  const isEmpty = people.length === 0

  return (
    <section className="room" aria-labelledby="room-title">
      <header className="room__header">
        <div>
          <p className="eyebrow">{info.title} · Your room</p>
          <h1 id="room-title" className="room__title">
            {info.epithet}
          </h1>
          <p className="room__tagline">
            {info.tagline}. {people.length} of {total} figures on display.
          </p>
        </div>
        <div className="room__actions">
          <PressableLink to={`/room/${century}/collect`} variant={isEmpty ? 'primary' : 'ghost'} burst={isEmpty}>
            Collect figures
          </PressableLink>
          <PressableLink to={`/room/${century}/game`} variant={isEmpty ? 'ghost' : 'primary'}>
            Play games
          </PressableLink>
          <PressableLink to={`/map/${century}`} variant="ghost">
            See on map
          </PressableLink>
        </div>
      </header>

      <div className="room__threshold" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {isEmpty ? (
        <motion.div
          className="room-empty panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        >
          <BrandMark />
          <h2 className="text-3xl font-semibold">Your {info.ordinal} century room is empty</h2>
          <p className="max-w-md text-ink-soft">
            Visit the collection to choose the people who shaped this age. They will be displayed here, on the world map
            and in your games.
          </p>
          <PressableLink to={`/room/${century}/collect`} variant="primary" size="lg" burst>
            Start collecting
          </PressableLink>
        </motion.div>
      ) : (
        <ul className="exhibit" aria-label={`Exhibits in the ${info.title} room`}>
          <AnimatePresence>
            {people.map((person, index) => (
              <ExhibitCard
                key={person.id}
                person={person}
                index={index}
                onRemove={() => {
                  removeFromRoom(century, person.id)
                  showToast(`${person.name} left your room`, 'info')
                }}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
