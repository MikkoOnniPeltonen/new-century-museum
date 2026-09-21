import type { CSSProperties } from 'react'
import { useEffects, type Burst } from '../../store/effects'

const COLORS = [
  'var(--c-accent)',
  'var(--c-glow)',
  '#ffffff',
  'color-mix(in oklab, var(--c-accent) 55%, var(--c-sky))',
]

function particles(burst: Burst) {
  const confetti = burst.tone === 'confetti'
  const count = confetti ? 36 : 14

  return Array.from({ length: count }, (_, i) => {
    // Deterministic jitter so particles differ per burst without Math.random during render.
    const jitter = ((burst.id * 97 + i * 53) % 29) - 14
    const reach = confetti ? 140 : 48
    const style = {
      '--angle': `${(360 / count) * i + jitter}deg`,
      '--dist': `${(confetti ? 110 : 40) + ((i * 37 + burst.id * 13) % reach)}px`,
      '--size': `${confetti ? 6 + (i % 3) * 3 : 4 + (i % 3) * 2}px`,
      '--color': COLORS[i % COLORS.length],
      '--radius': confetti && i % 2 === 0 ? '2px' : '50%',
      '--life': confetti ? '1.3s' : '0.85s',
    } as CSSProperties
    return <i key={i} style={style} />
  })
}

export function BurstLayer() {
  const bursts = useEffects((state) => state.bursts)

  return (
    <div className="burst-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <div key={burst.id} className="burst" style={{ '--bx': `${burst.x}px`, '--by': `${burst.y}px` } as CSSProperties}>
          {particles(burst)}
        </div>
      ))}
    </div>
  )
}
