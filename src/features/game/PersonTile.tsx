import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { Portrait } from '../../components/person/Portrait'
import type { Person } from '../../data/types'
import { cn } from '../../lib/cn'

export type TileState = 'idle' | 'selected' | 'placed' | 'correct' | 'wrong' | 'missed' | 'dimmed'

type PersonTileProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  person: Person
  state: TileState
  badge?: string
  index?: number
}

export function PersonTile({ person, state, badge, index = 0, disabled, className, ...rest }: PersonTileProps) {
  const reduceMotion = useReducedMotion()
  const interactive = !disabled && !reduceMotion

  return (
    <motion.button
      type="button"
      data-person={person.id}
      className={cn('tile', `tile--${state}`, state === 'wrong' && 'shake', className)}
      disabled={disabled}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.05 }}
      whileHover={interactive ? { y: -6 } : undefined}
      whileTap={interactive ? { scale: 0.93 } : undefined}
      {...rest}
    >
      <span className="tile__frame">
        <Portrait person={person} className="tile__img" sizes="200px" />
        {state === 'selected' && (
          <span className="tile__check" aria-hidden="true">
            ✓
          </span>
        )}
      </span>
      <span className="tile__name">{person.name}</span>
      <AnimatePresence>
        {badge && (
          <motion.span
            className="tile__badge"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
