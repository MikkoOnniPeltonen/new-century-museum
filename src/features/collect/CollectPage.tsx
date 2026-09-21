import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { playSfx } from '../../audio/sfx'
import { Portrait } from '../../components/person/Portrait'
import { ChevronIcon, PlusIcon } from '../../components/ui/Icons'
import { Modal } from '../../components/ui/Modal'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO } from '../../data/centuries'
import { wrapOffset } from '../../lib/carousel'
import { cn } from '../../lib/cn'
import { lifespan, personsOf } from '../../lib/persons'
import { useCentury } from '../../lib/useCentury'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { burstAt, showToast } from '../../store/effects'
import { useMuseum } from '../../store/museum'

const SWIPE_DISTANCE = 70
const SWIPE_VELOCITY = 400

export function CollectPage() {
  const century = useCentury()
  const info = CENTURY_INFO[century]
  useDocumentTitle(`Collect · ${info.title}`)

  const people = useMemo(() => personsOf(century), [century])
  const room = useMuseum((state) => state.rooms[century])
  const addToRoom = useMuseum((state) => state.addToRoom)
  const removeFromRoom = useMuseum((state) => state.removeFromRoom)
  const clearRoom = useMuseum((state) => state.clearRoom)
  const reduceMotion = useReducedMotion()

  const [index, setIndex] = useState(0)
  const [confirmClear, setConfirmClear] = useState(false)
  const active = people[index]
  const inRoom = room.includes(active.id)

  const go = (delta: number) => {
    setIndex((current) => (current + delta + people.length) % people.length)
    playSfx('flip')
  }

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') go(1)
    else if (event.key === 'ArrowLeft') go(-1)
    else return
    event.preventDefault()
  }

  const onPanEnd = (_event: PointerEvent, pan: PanInfo) => {
    if (pan.offset.x < -SWIPE_DISTANCE || pan.velocity.x < -SWIPE_VELOCITY) go(1)
    else if (pan.offset.x > SWIPE_DISTANCE || pan.velocity.x > SWIPE_VELOCITY) go(-1)
  }

  const add = () => {
    addToRoom(century, active.id)
    playSfx('success')
    if (room.length + 1 === people.length) {
      showToast(`Your ${info.ordinal} century room is complete!`)
      burstAt(window.innerWidth / 2, window.innerHeight / 2, 'confetti')
    } else {
      showToast(`${active.name} joined your ${info.ordinal} century room`)
    }
  }

  const remove = () => {
    removeFromRoom(century, active.id)
    showToast(`${active.name} left your room`, 'info')
  }

  return (
    <section className="collect" aria-labelledby="collect-title">
      <header className="collect__header">
        <div>
          <p className="eyebrow">{info.title} · Collect figures</p>
          <h1 id="collect-title" className="collect__title">
            {info.epithet}
          </h1>
          <p className="collect__lede">Choose who belongs in your {info.ordinal} century room.</p>
        </div>
        <div className="collect__status">
          <p className="room-counter">
            <span className="room-counter__dots" aria-hidden="true">
              {people.map((person) => (
                <span key={person.id} className={cn('room-counter__dot', room.includes(person.id) && 'is-filled')} />
              ))}
            </span>
            <span>
              {room.length} of {people.length} in your room
            </span>
          </p>
          <PressableLink to={`/room/${century}`} variant="ghost" size="sm">
            View room <ChevronIcon direction="right" size={16} />
          </PressableLink>
        </div>
      </header>

      <div className="carousel" role="region" aria-roledescription="carousel" aria-label={`${info.title} figures`}>
        <motion.div
          className="carousel__stage"
          tabIndex={0}
          aria-label="Use the arrow keys to browse figures"
          onKeyDown={onStageKeyDown}
          onPanEnd={onPanEnd}
        >
          {people.map((person, i) => {
            const offset = wrapOffset(i, index, people.length)
            const isActive = offset === 0
            const visible = Math.abs(offset) <= 1
            const collected = room.includes(person.id)

            return (
              <motion.article
                key={person.id}
                className={cn('collect-card', isActive && 'is-active', !visible && 'is-hidden')}
                aria-hidden={!isActive}
                style={{ zIndex: 10 - Math.abs(offset) }}
                initial={false}
                animate={{
                  x: `${offset * (reduceMotion ? 110 : 66)}%`,
                  scale: isActive ? 1 : 0.8,
                  rotateY: reduceMotion ? 0 : offset * -18,
                  opacity: visible ? (isActive ? 1 : 0.5) : 0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={!isActive && visible ? () => go(offset) : undefined}
              >
                <div className="collect-card__frame gilt">
                  <Portrait person={person} className="collect-card__img" sizes="(min-width: 768px) 360px, 75vw" eager={visible} />
                  <AnimatePresence>
                    {collected && (
                      <motion.span
                        className="seal"
                        initial={{ scale: 2.4, rotate: -35, opacity: 0 }}
                        animate={{ scale: 1, rotate: -12, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 380, damping: 15 }}
                      >
                        In your room
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="collect-card__caption">
                  <h2>{person.name}</h2>
                  <p>
                    {lifespan(person)} · {person.profession}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <div className="carousel__controls">
          <PressableButton variant="ghost" size="icon" aria-label="Previous figure" onClick={() => go(-1)}>
            <ChevronIcon direction="left" />
          </PressableButton>
          <div className="carousel__dots">
            {people.map((person, i) => (
              <button
                key={person.id}
                type="button"
                className={cn('carousel__dot', i === index && 'is-active', room.includes(person.id) && 'is-collected')}
                aria-label={`Show ${person.name}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => {
                  setIndex(i)
                  playSfx('flip')
                }}
              />
            ))}
          </div>
          <PressableButton variant="ghost" size="icon" aria-label="Next figure" onClick={() => go(1)}>
            <ChevronIcon direction="right" />
          </PressableButton>
        </div>
        <p className="sr-only" aria-live="polite">
          {active.name}, {index + 1} of {people.length}
          {inRoom ? ', in your room' : ''}
        </p>
      </div>

      <div className="collect__actions">
        <AnimatePresence mode="popLayout" initial={false}>
          {inRoom ? (
            <motion.div key="remove" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <PressableButton variant="ghost" size="lg" onClick={remove}>
                Remove from room
              </PressableButton>
            </motion.div>
          ) : (
            <motion.div key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <PressableButton size="lg" burst onClick={add}>
                <PlusIcon /> Add {active.name.split(' ')[0]} to room
              </PressableButton>
            </motion.div>
          )}
        </AnimatePresence>
        <PressableButton variant="quiet" disabled={room.length === 0} onClick={() => setConfirmClear(true)}>
          Clear room
        </PressableButton>
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear this room?"
        footer={
          <>
            <PressableButton variant="ghost" onClick={() => setConfirmClear(false)}>
              Keep them
            </PressableButton>
            <PressableButton
              variant="danger"
              onClick={() => {
                clearRoom(century)
                setConfirmClear(false)
                showToast(`Your ${info.ordinal} century room is empty again`, 'info')
              }}
            >
              Clear room
            </PressableButton>
          </>
        }
      >
        <p>
          All {room.length} figures will leave your {info.ordinal} century room. You can collect them again at any time.
        </p>
      </Modal>
    </section>
  )
}
