import { motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { useSearchParams } from 'react-router'
import { playSfx } from '../../audio/sfx'
import { PersonDrawer } from '../../components/person/PersonDrawer'
import { Portrait } from '../../components/person/Portrait'
import { PressableButton } from '../../components/ui/Pressable'
import { CENTURIES, CENTURY_INFO, isCentury } from '../../data/centuries'
import type { Person } from '../../data/types'
import { cn } from '../../lib/cn'
import { isLiving, lifespan, PERSONS } from '../../lib/persons'
import { packLanes, spanOf, TIMELINE_END, TIMELINE_START, yearToPercent } from '../../lib/timeline'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { useMuseum } from '../../store/museum'

const ZOOMS = [1, 1.5, 2, 3, 4]
const LANE_HEIGHT_REM = 4
const LABEL_GAP_YEARS = 12
const TICKS = Array.from({ length: (TIMELINE_END - TIMELINE_START) / 10 + 1 }, (_, i) => TIMELINE_START + i * 10)
const PEOPLE = [...PERSONS].sort((a, b) => a.born - b.born)
const LANES = packLanes(PEOPLE.map(spanOf), LABEL_GAP_YEARS)
const LANE_COUNT = Math.max(...LANES.values()) + 1

export function TimelinePage() {
  useDocumentTitle('Timeline')
  const [params] = useSearchParams()
  const centuryParam = params.get('century')
  const focusCentury = isCentury(centuryParam) ? centuryParam : undefined
  const rooms = useMuseum((state) => state.rooms)
  const chosen = useMemo(() => new Set(Object.values(rooms).flat()), [rooms])
  const reduceMotion = useReducedMotion()

  const [zoomIndex, setZoomIndex] = useState(0)
  const [highlight, setHighlight] = useState(true)
  const [selected, setSelected] = useState<Person | null>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const zoomAnchor = useRef<number | null>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const zoom = ZOOMS[zoomIndex]

  const changeZoom = useCallback((delta: number) => {
    const element = viewport.current
    // Remember which part of the timeline is centred so zooming keeps it in view.
    if (element) zoomAnchor.current = (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth
    setZoomIndex((current) => Math.min(Math.max(current + delta, 0), ZOOMS.length - 1))
  }, [])

  useLayoutEffect(() => {
    const element = viewport.current
    if (!element || zoomAnchor.current === null) return
    element.scrollLeft = zoomAnchor.current * element.scrollWidth - element.clientWidth / 2
    zoomAnchor.current = null
  }, [zoom])

  // Ctrl/⌘ + wheel and trackpad pinch (which browsers report as ctrl + wheel) zoom in steps.
  useEffect(() => {
    const element = viewport.current
    if (!element) return
    let lastStep = 0
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      if (event.timeStamp - lastStep < 160) return
      lastStep = event.timeStamp
      changeZoom(event.deltaY < 0 ? 1 : -1)
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [changeZoom])

  // The navbar century pills link here with ?century=, which slides that band into view.
  useEffect(() => {
    const element = viewport.current
    if (!element || !focusCentury) return
    const left = (yearToPercent(CENTURY_INFO[focusCentury].start) / 100) * element.scrollWidth
    element.scrollTo({ left: Math.max(0, left - 24), behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [focusCentury, reduceMotion])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || (event.target as Element).closest('button')) return
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('is-dragging')
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null
    event.currentTarget.classList.remove('is-dragging')
  }

  const onBarKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const target = viewport.current?.querySelector<HTMLButtonElement>(
      `[data-bar-index="${index + (event.key === 'ArrowRight' ? 1 : -1)}"]`,
    )
    target?.focus()
    target?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const percent = (year: number) => `${yearToPercent(year)}%`

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <header className="timeline__header">
        <div>
          <p className="eyebrow">
            {TIMELINE_START} – {TIMELINE_END}
          </p>
          <h1 id="timeline-title" className="timeline__title">
            Timeline of lives
          </h1>
          <p className="timeline__lede">
            Twenty lifetimes across four centuries. Select a life to read more
            {chosen.size > 0 ? '; the figures in your rooms glow.' : '.'}
          </p>
          <p className="timeline__lede">Dashed outlines indicate date qualifications. Select a life for sources and image notes; dates and century placement are editorially explained where they need context.</p>
        </div>
        <div className="timeline__controls">
          {chosen.size > 0 && (
            <PressableButton
              variant={highlight ? 'primary' : 'ghost'}
              size="sm"
              aria-pressed={highlight}
              onClick={() => setHighlight((value) => !value)}
            >
              Highlight my figures
            </PressableButton>
          )}
          <div className="timeline__zoom" role="group" aria-label="Zoom">
            <PressableButton variant="quiet" size="icon" aria-label="Zoom out" disabled={zoomIndex === 0} onClick={() => changeZoom(-1)}>
              <span aria-hidden="true">−</span>
            </PressableButton>
            <motion.span
              key={zoom}
              className="timeline__zoom-value"
              aria-live="polite"
              initial={{ scale: 1.4, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              {zoom}×
            </motion.span>
            <PressableButton
              variant="quiet"
              size="icon"
              aria-label="Zoom in"
              disabled={zoomIndex === ZOOMS.length - 1}
              onClick={() => changeZoom(1)}
            >
              <span aria-hidden="true">+</span>
            </PressableButton>
          </div>
        </div>
      </header>

      <div
        ref={viewport}
        className="timeline__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="timeline__track"
          style={{ width: `${zoom * 100}%`, minWidth: `${zoom * 56}rem`, '--lanes': LANE_COUNT } as CSSProperties}
        >
          <div className="timeline__band timeline__band--before" style={{ left: 0, width: percent(1600) }}>
            <span className="timeline__band-label">1500s</span>
          </div>
          {CENTURIES.map((century) => {
            const info = CENTURY_INFO[century]
            return (
              <div
                key={century}
                data-theme={century}
                className={cn('timeline__band', century === focusCentury && 'is-focus')}
                style={{ left: percent(info.start), width: `${yearToPercent(info.end + 1) - yearToPercent(info.start)}%` }}
              >
                <span className="timeline__band-label">{info.title}</span>
              </div>
            )
          })}

          <ol className="timeline__lanes" aria-label="Lifetimes, ordered by year of birth">
            {PEOPLE.map((person, index) => {
              const span = spanOf(person)
              const isChosen = chosen.has(person.id)
              return (
                <li
                  key={person.id}
                  className="timeline__slot"
                  style={{
                    left: percent(span.start),
                    width: `${yearToPercent(span.end) - yearToPercent(span.start)}%`,
                    top: `${(LANES.get(person.id) ?? 0) * LANE_HEIGHT_REM}rem`,
                  }}
                >
                  <motion.button
                    type="button"
                    data-theme={person.century}
                    data-bar-index={index}
                    title={`${person.name} (${lifespan(person)})${person.dateNote ? ` — ${person.dateNote}` : ''}`}
                    className={cn(
                      'timeline__bar',
                      isChosen && 'is-chosen',
                      highlight && chosen.size > 0 && !isChosen && 'is-dimmed',
                      isLiving(person) && 'is-living',
                      person.dateNote && 'is-approximate',
                    )}
                    initial={{ clipPath: 'inset(0% 100% 0% 0% round 999px)' }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px)' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : 0.15 + index * 0.04 }}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    onClick={() => {
                      playSfx('tap')
                      setSelected(person)
                    }}
                    onKeyDown={(event) => onBarKeyDown(event, index)}
                  >
                    <Portrait person={person} sizes="48px" alt="" className="timeline__avatar" />
                    {/* The visible text is the accessible name, so speech-input users can say what they see. */}
                    <span className="timeline__bar-text">
                      <span className="timeline__bar-name">{person.name}</span>
                      <span className="timeline__bar-years">
                        {lifespan(person)}
                        <span className="sr-only">, {CENTURY_INFO[person.century].title}</span>
                      </span>
                    </span>
                  </motion.button>
                </li>
              )
            })}
          </ol>

          <div className="timeline__axis" aria-hidden="true">
            {TICKS.map((year) => (
              <span key={year} className={cn('timeline__tick', year % 50 === 0 && 'is-major')} style={{ left: percent(year) }}>
                {(year % 50 === 0 || zoom >= 3) && <span>{year}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="timeline__hint">Drag to pan. Hold Ctrl or ⌘ and scroll to zoom. Use the arrow keys to move between lives.</p>

      <PersonDrawer person={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
