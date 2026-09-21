import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router'
import { playSfx } from '../../audio/sfx'
import { readExhibit } from './exhibit'

export function NextWingDoor({ enabled }: { enabled: boolean }) {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const pressure = useRef(0)
  const holding = useRef(false)
  const [charge, setCharge] = useState(0)
  const [opening, setOpening] = useState(false)
  const opened = useRef(false)
  const [exhibit] = useState(readExhibit)

  const enter = useCallback(() => {
    if (opened.current || !enabled) return
    opened.current = true
    holding.current = false
    setOpening(true)
    playSfx('whoosh')
  }, [enabled])

  useEffect(() => {
    if (!opening) return
    const timer = window.setTimeout(() => navigate('/next-wing'), reduced ? 250 : 1100)
    return () => window.clearTimeout(timer)
  }, [opening, navigate, reduced])

  useEffect(() => {
    if (!enabled || opening) return
    let frame = 0
    let previous = 0
    let impulse = 0
    const inView = () => {
      const box = section.current?.getBoundingClientRect()
      return box && box.top < window.innerHeight * 0.65 && box.bottom > window.innerHeight * 0.3
    }
    const wheel = (event: WheelEvent) => {
      if (event.deltaY > 0 && inView() && !event.ctrlKey) impulse = performance.now() + 180
    }
    const release = () => { holding.current = false }
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0
      previous = now
      if (inView() && (holding.current || impulse > now)) {
        pressure.current = Math.min(100, pressure.current + elapsed / 32)
        setCharge(Math.round(pressure.current))
        if (pressure.current >= 100) enter()
      }
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('pointerup', release)
    window.addEventListener('blur', release)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('blur', release)
    }
  }, [enabled, opening, enter])

  return (
    <section ref={section} className={`next-door${exhibit ? ' next-door--open' : ''}${charge > 0 ? ' next-door--charging' : ''}${opening ? ' next-door--opening' : ''}`} aria-labelledby="next-door-title" style={{ '--pressure': opening ? 1 : charge / 100 } as CSSProperties}>
      <div className="next-door__copy">
        <p className="eyebrow">2000s · The next wing</p>
        <h2 id="next-door-title">The future is open.<br /><em>Step into your story.</em></h2>
        <p>{exhibit ? 'Welcome back. Your next chapter is waiting inside.' : 'Beyond this portal is a century still being written. Push a little further.'}</p>
      </div>
      <button className="next-door__seal" aria-label="Hold to break the seal" disabled={!enabled || opening}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); holding.current = true }}
        onPointerUp={() => { holding.current = false }} onPointerCancel={() => { holding.current = false }}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); holding.current = true } }}
        onKeyUp={() => { holding.current = false }} onBlur={() => { holding.current = false }}>
        <span className="next-door__arch" aria-hidden="true">
          <span className="next-door__sky" />
          <span className="next-door__horizon" />
          <span className="next-door__floor" />
          <span className="next-door__passage">{Array.from({ length: 5 }, (_, index) => <i key={index} style={{ '--depth': index } as CSSProperties} />)}</span>
          <span className="next-door__particles">{Array.from({ length: 9 }, (_, index) => <i key={index} style={{ '--particle': index } as CSSProperties} />)}</span>
          <span className="next-door__shutter next-door__shutter--left" />
          <span className="next-door__shutter next-door__shutter--right" />
          <span className="next-door__invitation"><b>Step into<br /><em>tomorrow</em></b></span>
          <span className="next-door__readout"><strong>{opening ? '100' : String(charge).padStart(2, '0')}<small>%</small></strong></span>
          <span className="next-door__charge-track"><span /></span>
        </span>
        <span>{charge === 0 ? 'Scroll to build pressure, or press and hold' : charge < 70 ? 'The future is pushing back…' : 'Keep going. The seal is breaking.'}</span>
      </button>
      <progress aria-label="Door pressure" max={100} value={charge} />
      <button className="next-door__skip" onClick={enter} disabled={!enabled || opening}>{exhibit ? 'Return to your exhibit' : 'Enter the next wing'} <span aria-hidden="true">↗</span></button>
      {opening && createPortal(
        <motion.div className="wing-breakthrough" aria-label="Entering the next wing" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {!reduced && <motion.span className="wing-breakthrough__passage" initial={{ scale: .35, opacity: 0 }} animate={{ scale: 3, opacity: [0, 1, 0] }} transition={{ duration: 1.1, ease: 'easeIn' }} />}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.35 }}>Your century. Your story.</motion.p>
        </motion.div>, document.body)}
    </section>
  )
}
