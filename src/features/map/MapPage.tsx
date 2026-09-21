import { geoGraticule10, geoPath } from 'd3-geo'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { feature, mesh } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import worldUrl from 'world-atlas/countries-110m.json?url'
import { playSfx } from '../../audio/sfx'
import { PersonDrawer } from '../../components/person/PersonDrawer'
import { Portrait } from '../../components/person/Portrait'
import { PinIcon } from '../../components/ui/Icons'
import { PressableButton, PressableLink } from '../../components/ui/Pressable'
import { CENTURY_INFO } from '../../data/centuries'
import type { Person } from '../../data/types'
import { cn } from '../../lib/cn'
import { createProjection, MAP_HEIGHT, MAP_WIDTH, spreadPins } from '../../lib/geo'
import { personsOf } from '../../lib/persons'
import { useCentury } from '../../lib/useCentury'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { useMuseum } from '../../store/museum'

/** Pins closer than this (in map units) fan out; roughly one pin head on a desktop-sized map. */
const PIN_SPREAD = 36

interface WorldShapes {
  land: string
  coast: string
  borders: string
}

export function MapPage() {
  const century = useCentury()
  const info = CENTURY_INFO[century]
  useDocumentTitle(`World map · ${info.title}`)

  const roomIds = useMuseum((state) => state.rooms[century])
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<Person | null>(null)
  const [world, setWorld] = useState<WorldShapes | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const projection = useMemo(() => createProjection(), [])
  const path = useMemo(() => geoPath(projection), [projection])
  const sphere = useMemo(() => path({ type: 'Sphere' }) ?? '', [path])
  const graticule = useMemo(() => path(geoGraticule10()) ?? '', [path])

  // The world outline is a static asset, fetched once so it stays out of the JS bundle.
  useEffect(() => {
    const controller = new AbortController()
    fetch(worldUrl, { signal: controller.signal })
      .then((response) => response.json() as Promise<Topology>)
      .then((topology) => {
        const countries = topology.objects.countries as GeometryCollection
        setWorld({
          land: path(feature(topology, countries)) ?? '',
          coast: path(mesh(topology, countries, (a, b) => a === b)) ?? '',
          borders: path(mesh(topology, countries, (a, b) => a !== b)) ?? '',
        })
      })
      .catch(() => {})
    return () => controller.abort()
  }, [path])

  const people = useMemo(() => personsOf(century), [century])
  const visible = people.filter((person) => showAll || roomIds.includes(person.id))
  const pins = spreadPins(
    visible.map((person) => {
      const [x, y] = projection([person.location.lng, person.location.lat]) ?? [0, 0]
      return { id: person.id, x, y, person }
    }),
    PIN_SPREAD,
  )
  const pinsCenter = pins.length > 0 ? pins.reduce((sum, pin) => sum + pin.x, 0) / pins.length / MAP_WIDTH : null

  // On narrow screens the map scrolls sideways: bring the pins into view.
  useEffect(() => {
    const element = scroller.current
    if (!element || pinsCenter === null || element.scrollWidth <= element.clientWidth) return
    element.scrollTo({
      left: pinsCenter * element.scrollWidth - element.clientWidth / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [pinsCenter, reduceMotion])

  const open = (person: Person) => {
    playSfx('tap')
    setSelected(person)
  }

  return (
    <section className="map-page" aria-labelledby="map-title">
      <header className="map-page__header">
        <div>
          <p className="eyebrow">{info.title} · World map</p>
          <h1 id="map-title" className="map-page__title">
            Where they made history
          </h1>
          <p className="map-page__lede">
            {roomIds.length} of {people.length} {info.ordinal} century figures collected. Pick another century in the
            navigation bar to travel.
          </p>
        </div>
        <PressableButton variant={showAll ? 'primary' : 'ghost'} size="sm" aria-pressed={showAll} onClick={() => setShowAll((value) => !value)}>
          Show all {century} figures
        </PressableButton>
      </header>

      <AnimatePresence>
        {visible.length === 0 && (
          <motion.div
            className="map-page__empty panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div>
              <h2 className="text-2xl font-semibold">No pins in the {info.title} yet</h2>
              <p className="text-ink-soft">Collect figures into your room to see where they made history.</p>
            </div>
            <div className="map-page__empty-actions">
              <PressableLink to={`/room/${century}/collect`} variant="primary" size="sm" burst>
                Collect figures
              </PressableLink>
              <PressableButton variant="ghost" size="sm" onClick={() => setShowAll(true)}>
                Show all figures
              </PressableButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scroller} className="map-scroll">
        <div className="map" data-theme={century}>
          <svg
            className="map__svg"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label={`Antique world map of the ${info.title} with ${pins.length} figures marked`}
          >
            <path d={sphere} className="map__sphere" />
            <path d={graticule} className="map__graticule" />
            {world && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                <path d={world.land} className="map__land" />
                <path d={world.borders} className="map__borders" />
                <path d={world.coast} className="map__coast" />
              </motion.g>
            )}
            <path d={sphere} className="map__edge" />
            <g transform="translate(84 432)">
              <motion.g
                key={century}
                className="map__compass"
                initial={{ rotate: reduceMotion ? 0 : -140, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 11 }}
              >
                <circle r="34" />
                <circle r="25" strokeDasharray="2 3" />
                <path className="map__compass-star" d="M0-42 7-7 42 0 7 7 0 42-7 7-42 0-7-7Z" />
                <path className="map__compass-shade" d="M0-42 7-7 0 0ZM42 0 7 7 0 0ZM0 42-7 7 0 0ZM-42 0-7-7 0 0Z" />
                <text y="-48" textAnchor="middle">
                  N
                </text>
              </motion.g>
            </g>
          </svg>

          <p className="map__cartouche" aria-hidden="true">
            <strong>Orbis Terrarum</strong>
            <span>{info.title}</span>
          </p>

          {!world && (
            <p className="map__loading" role="status">
              Unrolling the map…
            </p>
          )}

          <ul className="map__pins">
            <AnimatePresence>
              {pins.map((pin, index) => {
                const chosen = roomIds.includes(pin.id)
                return (
                  <motion.li
                    key={pin.id}
                    className="map__pin-slot"
                    style={{
                      left: `${((pin.x + pin.dx) / MAP_WIDTH) * 100}%`,
                      top: `${((pin.y + pin.dy) / MAP_HEIGHT) * 100}%`,
                    }}
                    initial={{ y: reduceMotion ? 0 : -90, opacity: 0, scale: 0.6 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -40, opacity: 0, scale: 0.5, transition: { duration: 0.25 } }}
                    transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.1 + index * 0.08 }}
                  >
                    <button
                      type="button"
                      className={cn('pin', !chosen && 'pin--hollow')}
                      aria-label={`${pin.person.name}, ${pin.person.location.label}${chosen ? '' : ', not in your room'}`}
                      onClick={() => open(pin.person)}
                    >
                      <span className="pin__pulse" aria-hidden="true" />
                      <span className="pin__head">
                        <Portrait person={pin.person} sizes="64px" alt="" />
                      </span>
                      <span className="pin__label" aria-hidden="true">
                        {pin.person.name}
                        <small>{pin.person.location.label}</small>
                      </span>
                    </button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      {visible.length > 0 && (
        <ul className="map__legend" aria-label="Figures on the map">
          {visible.map((person) => (
            <li key={person.id}>
              <motion.button
                type="button"
                className={cn('legend-item', !roomIds.includes(person.id) && 'is-hollow')}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                onClick={() => open(person)}
              >
                <Portrait person={person} sizes="48px" alt="" className="legend-item__img" />
                <span>
                  <strong>{person.name}</strong>
                  <small>
                    <PinIcon size={12} /> {person.location.label}
                  </small>
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      )}

      <PersonDrawer person={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
