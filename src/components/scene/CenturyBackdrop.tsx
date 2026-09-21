import { useEffect, useRef, type CSSProperties } from 'react'
import { CENTURIES } from '../../data/centuries'

// Fixed positions keep the dust stable across renders; CSS does the animation.
const DUST = [
  { x: 8, y: 82, s: 3, d: 13, delay: 0, dx: 24 },
  { x: 18, y: 64, s: 2, d: 17, delay: -4, dx: -18 },
  { x: 27, y: 90, s: 4, d: 15, delay: -9, dx: 12 },
  { x: 36, y: 72, s: 2, d: 19, delay: -2, dx: 30 },
  { x: 44, y: 86, s: 3, d: 14, delay: -11, dx: -22 },
  { x: 53, y: 60, s: 2, d: 18, delay: -6, dx: 16 },
  { x: 61, y: 94, s: 4, d: 16, delay: -13, dx: -12 },
  { x: 69, y: 70, s: 3, d: 12, delay: -3, dx: 26 },
  { x: 77, y: 88, s: 2, d: 20, delay: -8, dx: -28 },
  { x: 85, y: 66, s: 3, d: 15, delay: -1, dx: 14 },
  { x: 92, y: 84, s: 2, d: 17, delay: -10, dx: -16 },
  { x: 13, y: 40, s: 2, d: 21, delay: -5, dx: 20 },
  { x: 48, y: 35, s: 2, d: 22, delay: -15, dx: -10 },
  { x: 81, y: 42, s: 3, d: 19, delay: -7, dx: 18 },
]

export function CenturyBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = ref.current
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!scene || !finePointer || reducedMotion) return

    let frame = 0
    let px = 0
    let py = 0
    const apply = () => {
      frame = 0
      scene.style.setProperty('--px', px.toFixed(3))
      scene.style.setProperty('--py', py.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      px = (event.clientX / window.innerWidth) * 2 - 1
      py = (event.clientY / window.innerHeight) * 2 - 1
      if (!frame) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="scene" aria-hidden="true">
      <div className="scene__layer scene__base" />
      {CENTURIES.map((century) => (
        <div key={century} className={`scene__layer scene__motif motif-${century}`} />
      ))}
      <div className="scene__rays" />
      <div className="scene__layer scene__glow" />
      <div className="scene__dust">
        {DUST.map((dust, i) => (
          <span
            key={i}
            style={
              {
                '--x': `${dust.x}%`,
                '--y': `${dust.y}%`,
                '--s': `${dust.s}px`,
                '--d': `${dust.d}s`,
                '--delay': `${dust.delay}s`,
                '--dx': `${dust.dx}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="scene__grain" />
      <div className="scene__vignette" />
    </div>
  )
}
