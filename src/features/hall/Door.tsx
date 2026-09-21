import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { FocusEvent, PointerEvent } from 'react'
import { PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO, type Century } from '../../data/centuries'
import { cn } from '../../lib/cn'
import { personsOf } from '../../lib/persons'
import { useMuseum } from '../../store/museum'

const TILT = { stiffness: 180, damping: 18 }

const doorVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 19 } },
} as const

interface DoorProps {
  century: Century
  onPreview: (active: boolean) => void
}

export function Door({ century, onPreview }: DoorProps) {
  const info = CENTURY_INFO[century]
  const collected = useMuseum((state) => state.rooms[century].length)
  const total = personsOf(century).length
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(0, TILT)
  const rotateY = useSpring(0, TILT)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 14)
    rotateX.set((0.5 - py) * 10)
    event.currentTarget.style.setProperty('--mx', `${px * 100}%`)
    event.currentTarget.style.setProperty('--my', `${py * 100}%`)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    onPreview(false)
  }

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onPreview(false)
  }

  return (
    <motion.article
      data-theme={century}
      className="door"
      aria-labelledby={`door-${century}`}
      variants={doorVariants}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerEnter={() => onPreview(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onFocus={() => onPreview(true)}
      onBlur={onBlur}
    >
      <div className={`door__scene motif-${century}`} aria-hidden="true" />
      <div className="door__glow" aria-hidden="true" />
      <div className="door__sheen" aria-hidden="true" />
      <div className="door__frame" aria-hidden="true" />

      <div className="door__content">
        <p className="eyebrow">{info.title}</p>
        <h2 id={`door-${century}`} className="door__title">
          {info.epithet}
        </h2>
        <p className="door__tagline">{info.tagline}</p>
        <p className="door__progress">
          <span className="sr-only">
            {collected} of {total} figures in your room
          </span>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} aria-hidden="true" className={cn('door__dot', i < collected && 'is-filled')} />
          ))}
        </p>
        <div className="door__actions">
          <PressableLink to={`/room/${century}`} variant="primary" size="sm">
            Enter room
          </PressableLink>
          <PressableLink to={`/room/${century}/collect`} variant="ghost" size="sm">
            Collect figures
          </PressableLink>
        </div>
      </div>
    </motion.article>
  )
}
