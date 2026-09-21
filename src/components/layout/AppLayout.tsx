import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { ScrollRestoration, useLocation, useOutlet } from 'react-router'
import { sectionKey } from '../../lib/navigation'
import { CenturyBackdrop } from '../scene/CenturyBackdrop'
import { BurstLayer } from '../ui/BurstLayer'
import { ToastViewport } from '../ui/ToastViewport'
import { Footer } from './Footer'
import { NavBar } from './NavBar'
import { SoundscapeController } from './SoundscapeController'
import { ThemeSync } from './ThemeSync'

export function AppLayout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()

  return (
    <MotionConfig reducedMotion="user">
      <ThemeSync />
      <CenturyBackdrop />
      <div className="app">
        <NavBar />
        <AnimatePresence mode="wait">
          <motion.main
            key={sectionKey(pathname)}
            id="main"
            tabIndex={-1}
            className="app__main"
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            // filter/transform would create a containing block for fixed children, so clear them afterwards.
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {outlet}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
      <ToastViewport />
      <BurstLayer />
      <SoundscapeController />
      <ScrollRestoration />
    </MotionConfig>
  )
}

export function PageFallback() {
  return (
    <div className="grid min-h-[60dvh] place-items-center" role="status" aria-label="Loading">
      <span className="size-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  )
}
