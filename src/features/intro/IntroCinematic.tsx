import {
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationSequence,
  type MotionValue,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { unlockAudio } from '../../audio/context'
import { playSfx } from '../../audio/sfx'
import { PressableButton } from '../../components/ui/Pressable'
import type { Century } from '../../data/centuries'
import { cn } from '../../lib/cn'
import { markIntroSeen } from '../../lib/session'
import { useTheme } from '../../store/theme'

const ROLL: Century[] = ['1900s', '1800s', '1700s', '1600s']
const WELCOME = ['Welcome', 'to', 'the', 'Century', 'Museum']
const EXPLORE = [...'Explore']
// Where each letter of "Explore" flies in from: [x, y, rotate]
const SCATTER: [number, number, number][] = [
  [-160, -90, -50],
  [110, -130, 40],
  [-60, 120, 70],
  [180, 40, -30],
  [-200, 30, 25],
  [70, 140, -60],
  [150, -60, 35],
]
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

type Query = (selector: string) => HTMLElement[]

function titleSequence(query: Query, rollIndex: MotionValue<number>): AnimationSequence {
  const sequence: AnimationSequence = []

  query('.intro-word').forEach((word, i) => {
    sequence.push([
      word,
      { opacity: [0, 1], y: [30, 0], filter: ['blur(14px)', 'blur(0px)'] },
      { duration: 0.9, ease: EASE_OUT, at: 0.15 + i * 0.16 },
    ])
  })
  sequence.push(['.intro__line--welcome', { opacity: 0, y: -26, filter: 'blur(10px)' }, { duration: 0.55, ease: 'easeIn', at: 2.25 }])

  query('.intro-letter').forEach((letter, i) => {
    const [x, y, rotate] = SCATTER[i]
    sequence.push([
      letter,
      { opacity: [0, 1], x: [x, 0], y: [y, 0], rotate: [rotate, 0], scale: [1.8, 1] },
      { type: 'spring', stiffness: 170, damping: 13, at: 2.75 + i * 0.07 },
    ])
  })
  sequence.push(['.intro-with', { opacity: [0, 1], y: [14, 0] }, { duration: 0.6, ease: EASE_OUT, at: 3.5 }])
  sequence.push(['.intro__odometer', { opacity: [0, 1], scale: [0.6, 1] }, { type: 'spring', stiffness: 260, damping: 18, at: 3.9 }])

  // The year rolls back one century at a time; ThemeSync crossfades the whole scene with it.
  for (let step = 1; step < ROLL.length; step++) {
    const at = 4.6 + (step - 1) * 0.7
    sequence.push([rollIndex, step, { duration: 0.5, ease: [0.7, 0, 0.3, 1], at }])
    sequence.push(['.intro__odometer', { scale: [1, 1.14, 1] }, { duration: 0.5, at }])
  }

  sequence.push(['.intro-centuries', { opacity: [0, 1], x: [48, 0] }, { duration: 0.7, ease: EASE_OUT, at: 6.7 }])
  sequence.push(['.intro__invite', { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, ease: EASE_OUT, at: 7.2 }])
  return sequence
}

function reducedTitleSequence(rollIndex: MotionValue<number>): AnimationSequence {
  return [
    ['.intro-word', { opacity: 1 }, { duration: 0.4 }],
    ['.intro__line--welcome', { opacity: 0 }, { duration: 0.3, at: 1.2 }],
    [rollIndex, ROLL.length - 1, { duration: 0.01, at: 1.4 }],
    ['.intro-letter, .intro-with, .intro__odometer, .intro-centuries', { opacity: 1 }, { duration: 0.4, at: 1.5 }],
    ['.intro__invite', { opacity: 1 }, { duration: 0.4, at: 1.9 }],
  ]
}

interface IntroCinematicProps {
  onFinish: () => void
}

export function IntroCinematic({ onFinish }: IntroCinematicProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reduceMotion = useReducedMotion()
  const setPreview = useTheme((state) => state.setPreview)
  const setLast = useTheme((state) => state.setLast)

  const rollIndex = useMotionValue(0)
  const stripY = useTransform(rollIndex, (value) => `${(-value * 100) / ROLL.length}%`)
  const [phase, setPhase] = useState<'title' | 'invite' | 'opening'>('title')
  const [closing, setClosing] = useState(false)
  const titleControls = useRef<{ stop: () => void } | null>(null)
  const enterButton = useRef<HTMLButtonElement>(null)
  const finished = useRef(false)

  useMotionValueEvent(rollIndex, 'change', (value) => setPreview(ROLL[Math.round(value)]))

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    titleControls.current?.stop()
    markIntroSeen()
    setPreview(null)
    setLast('1600s')
    // The overlay fades out while unmounting; let clicks reach the hall straight away.
    setClosing(true)
    onFinish()
  }, [onFinish, setLast, setPreview])

  const skip = useCallback(() => {
    void unlockAudio()
    finish()
  }, [finish])

  // Title sequence: one timeline, started once fonts are ready so nothing jumps.
  useEffect(() => {
    let cancelled = false
    const root = scope.current
    const query: Query = (selector) => Array.from(root.querySelectorAll<HTMLElement>(selector))

    const run = async () => {
      // Fonts are preloaded from index.html; don't hold the curtain for long on slow connections.
      await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 800))])
      if (cancelled) return
      const controls = animate(reduceMotion ? reducedTitleSequence(rollIndex) : titleSequence(query, rollIndex))
      titleControls.current = controls
      await controls
      if (!cancelled) setPhase('invite')
    }

    void run()
    return () => {
      cancelled = true
      titleControls.current?.stop()
    }
  }, [animate, reduceMotion, rollIndex, scope])

  useEffect(() => {
    if (phase === 'invite') enterButton.current?.focus()
  }, [phase])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || (event.key === 'Enter' && phase === 'title')) {
        event.preventDefault()
        skip()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, skip])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      setPreview(null)
    }
  }, [setPreview])

  const enter = async () => {
    if (phase !== 'invite') return
    setPhase('opening')
    void unlockAudio()
    playSfx('whoosh')

    const controls = animate(
      reduceMotion
        ? [[scope.current, { opacity: 0 }, { duration: 0.5 }]]
        : [
            ['.intro__stage', { opacity: 0, scale: 1.08, filter: 'blur(10px)' }, { duration: 0.5, ease: 'easeIn' }],
            ['.intro__curtain--left', { rotateY: 78, x: '-35%' }, { duration: 1.2, ease: [0.7, 0, 0.2, 1], at: 0.1 }],
            ['.intro__curtain--right', { rotateY: -78, x: '35%' }, { duration: 1.2, ease: [0.7, 0, 0.2, 1], at: '<' }],
            [scope.current, { opacity: 0 }, { duration: 0.45, at: 0.85 }],
          ],
    )
    await controls
    finish()
  }

  return createPortal(
    <motion.div
      ref={scope}
      className={cn('intro', closing && 'is-closing')}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the Century Museum"
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="intro__curtains" aria-hidden="true">
        <div className="intro__curtain intro__curtain--left" />
        <div className="intro__curtain intro__curtain--right" />
      </div>

      <div className="intro__stage">
        <p className="sr-only">Welcome to the Century Museum. Explore with us four centuries of remarkable lives.</p>

        <div className="intro__lines" aria-hidden="true">
          <p className="intro__line intro__line--welcome">
            {WELCOME.map((word) => (
              <span key={word} className="intro-word">
                {word}
              </span>
            ))}
          </p>

          <div className="intro__line intro__line--explore">
            <p className="intro__explore-row">
              <span className="intro__explore">
                {EXPLORE.map((letter, i) => (
                  <span key={i} className="intro-letter">
                    {letter}
                  </span>
                ))}
              </span>
              <span className="intro-with">with us</span>
            </p>
            <span className="intro__odometer">
              <span className="intro__odometer-window">
                <motion.span className="intro__odometer-strip" style={{ y: stripY }}>
                  {ROLL.map((century) => (
                    <span key={century}>{century}</span>
                  ))}
                </motion.span>
              </span>
            </span>
            <span className="intro-centuries">four centuries of remarkable lives</span>
          </div>
        </div>

        <div className="intro__invite">
          <PressableButton ref={enterButton} size="lg" burst disabled={phase === 'title'} onClick={enter}>
            Enter the museum
          </PressableButton>
          <p className="intro__hint">Sound on for the full experience</p>
        </div>
      </div>

      <PressableButton variant="ghost" size="sm" className="intro__skip" onClick={skip}>
        Skip intro <kbd>Esc</kbd>
      </PressableButton>
    </motion.div>,
    document.body,
  )
}
