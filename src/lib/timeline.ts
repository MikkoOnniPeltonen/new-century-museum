import type { Person } from '../data/types'

export const TIMELINE_START = 1540
export const TIMELINE_END = 2000

export interface Span {
  id: string
  start: number
  end: number
}

export function yearToPercent(year: number): number {
  const clamped = Math.min(Math.max(year, TIMELINE_START), TIMELINE_END)
  return ((clamped - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100
}

export function spanOf(person: Person): Span {
  const end = person.deathUnknown ? person.lastKnownAlive ?? person.born : person.died ?? TIMELINE_END
  return { id: person.id, start: person.born, end: Math.min(end, TIMELINE_END) }
}

/**
 * Greedy interval packing: each span goes into the first lane whose previous span
 * ended at least `gap` years earlier, leaving room for the name label.
 */
export function packLanes(spans: readonly Span[], gap = 12): Map<string, number> {
  const laneEnds: number[] = []
  const lanes = new Map<string, number>()
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end)

  for (const span of sorted) {
    let lane = laneEnds.findIndex((end) => end + gap <= span.start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(span.end)
    } else {
      laneEnds[lane] = span.end
    }
    lanes.set(span.id, lane)
  }

  return lanes
}
