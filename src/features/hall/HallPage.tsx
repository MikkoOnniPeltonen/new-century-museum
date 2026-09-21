import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { CENTURIES, CENTURY_INFO, type Century } from '../../data/centuries'
import { hasSeenIntro } from '../../lib/session'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { useTheme } from '../../store/theme'
import { IntroCinematic } from '../intro/IntroCinematic'
import { Door } from './Door'
import { NextWingDoor } from '../next-wing/NextWingDoor'

export function HallPage() {
  useDocumentTitle('')
  const location = useLocation()
  const [firstVisit, setFirstVisit] = useState(() => !hasSeenIntro())
  const [dismissedReplay, setDismissedReplay] = useState<number>()
  const [focused, setFocused] = useState<Century | null>(null)
  const last = useTheme((state) => state.last)
  const setPreview = useTheme((state) => state.setPreview)
  const headline = focused ?? last

  // "Replay intro" in the footer navigates here with a fresh token.
  const replayToken = (location.state as { replayIntro?: number } | null)?.replayIntro
  const showIntro = replayToken !== undefined ? replayToken !== dismissedReplay : firstVisit

  const finishIntro = () => {
    setFirstVisit(false)
    setDismissedReplay(replayToken)
  }

  useEffect(() => () => setPreview(null), [setPreview])

  return (
    <>
      <AnimatePresence>{showIntro && <IntroCinematic key="intro" onFinish={finishIntro} />}</AnimatePresence>

      <section className="hall" aria-labelledby="hall-title">
        <header className="hall__header">
          <p className="eyebrow">Four wings · Twenty lives</p>
          <h1 id="hall-title" className="hall__title">
            Explore with us the{' '}
            <span className="hall__century">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={headline}
                  initial={{ y: '55%', opacity: 0, rotateX: -70 }}
                  animate={{ y: '0%', opacity: 1, rotateX: 0 }}
                  exit={{ y: '-55%', opacity: 0, rotateX: 70 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                >
                  {CENTURY_INFO[headline].ordinal}
                </motion.span>
              </AnimatePresence>
            </span>{' '}
            century
          </h1>
          <p className="hall__lede">
            Step through a door to meet the people who shaped each age. Collect them into your room, find them on the
            world map, trace their lives on the timeline and test what you have learned.
          </p>
        </header>

        <motion.div
          className="hall__doors"
          initial="hidden"
          animate={showIntro ? 'hidden' : 'show'}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
        >
          {CENTURIES.map((century) => (
            <Door
              key={century}
              century={century}
              onPreview={(active) => {
                setFocused(active ? century : null)
                setPreview(active ? century : null)
              }}
            />
          ))}
        </motion.div>

        <NextWingDoor enabled={!showIntro} />
      </section>
    </>
  )
}
