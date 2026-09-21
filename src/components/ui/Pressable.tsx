import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Link, type LinkProps } from 'react-router'
import { playSfx } from '../../audio/sfx'
import { cn } from '../../lib/cn'
import { burstAt, type BurstTone } from '../../store/effects'

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'quiet'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface FeedbackOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Fire a particle burst from the press point on click */
  burst?: BurstTone | boolean
}

interface Ripple {
  id: number
  x: number
  y: number
  scale: number
}

const SPRING = { type: 'spring', stiffness: 520, damping: 15, mass: 0.6 } as const
let rippleId = 0

function usePressFeedback(burst: FeedbackOptions['burst']) {
  const reduceMotion = useReducedMotion()
  const [ripples, setRipples] = useState<Ripple[]>([])

  const pulse = (element: HTMLElement, x: number, y: number) => {
    element.classList.remove('is-pressed')
    const rect = element.getBoundingClientRect() // forces a reflow so the ring animation restarts
    element.classList.add('is-pressed')
    const scale = Math.hypot(rect.width, rect.height) / 8
    setRipples((current) => [...current.slice(-3), { id: ++rippleId, x, y, scale }])
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pulse(event.currentTarget, event.clientX - rect.left, event.clientY - rect.top)
    playSfx('tap')
    if (event.pointerType === 'touch') navigator.vibrate?.(8)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
    const rect = event.currentTarget.getBoundingClientRect()
    pulse(event.currentTarget, rect.width / 2, rect.height / 2)
    playSfx('tap')
  }

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (!burst) return
    const rect = event.currentTarget.getBoundingClientRect()
    // Keyboard-triggered clicks report 0,0; burst from the center instead.
    const fromKeyboard = event.clientX === 0 && event.clientY === 0
    burstAt(
      fromKeyboard ? rect.left + rect.width / 2 : event.clientX,
      fromKeyboard ? rect.top + rect.height / 2 : event.clientY,
      burst === true ? 'spark' : burst,
    )
  }

  const rippleNodes = ripples.map((ripple) => (
    <span
      key={ripple.id}
      aria-hidden="true"
      className="ripple"
      style={{ '--rx': `${ripple.x}px`, '--ry': `${ripple.y}px`, '--rs': ripple.scale } as CSSProperties}
      onAnimationEnd={() => setRipples((current) => current.filter((item) => item.id !== ripple.id))}
    />
  ))

  const motionProps = {
    whileHover: reduceMotion ? undefined : { y: -2, scale: 1.035 },
    whileTap: reduceMotion ? { opacity: 0.75 } : { scale: 0.9, y: 1 },
    transition: SPRING,
  }

  return { rippleNodes, onPointerDown, onKeyDown, onClick, motionProps }
}

type PressableButtonProps = Omit<HTMLMotionProps<'button'>, 'children' | 'ref'> &
  FeedbackOptions & {
    children?: ReactNode
    ref?: Ref<HTMLButtonElement>
  }

export function PressableButton({
  variant = 'primary',
  size = 'md',
  burst,
  className,
  children,
  type = 'button',
  ref,
  onPointerDown,
  onKeyDown,
  onClick,
  ...rest
}: PressableButtonProps) {
  const feedback = usePressFeedback(burst)

  return (
    <motion.button
      ref={ref}
      type={type}
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      {...feedback.motionProps}
      {...rest}
      onPointerDown={(event) => {
        feedback.onPointerDown(event)
        onPointerDown?.(event)
      }}
      onKeyDown={(event) => {
        feedback.onKeyDown(event)
        onKeyDown?.(event)
      }}
      onClick={(event) => {
        feedback.onClick(event)
        onClick?.(event)
      }}
    >
      {feedback.rippleNodes}
      <span className="btn__label">{children}</span>
    </motion.button>
  )
}

const MotionLink = motion.create(Link)

type PressableLinkProps = Omit<LinkProps, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> &
  FeedbackOptions

export function PressableLink({
  variant = 'ghost',
  size = 'md',
  burst,
  className,
  children,
  onPointerDown,
  onKeyDown,
  onClick,
  ...rest
}: PressableLinkProps) {
  const feedback = usePressFeedback(burst)

  return (
    <MotionLink
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      {...feedback.motionProps}
      {...rest}
      onPointerDown={(event: PointerEvent<HTMLAnchorElement>) => {
        feedback.onPointerDown(event)
        onPointerDown?.(event)
      }}
      onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) => {
        feedback.onKeyDown(event)
        onKeyDown?.(event)
      }}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        feedback.onClick(event)
        onClick?.(event)
      }}
    >
      {feedback.rippleNodes}
      <span className="btn__label">{children}</span>
    </MotionLink>
  )
}
