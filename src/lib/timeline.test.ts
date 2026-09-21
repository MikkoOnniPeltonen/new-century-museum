import { describe, expect, it } from 'vitest'
import { PERSONS } from './persons'
import { packLanes, spanOf, TIMELINE_END, TIMELINE_START, yearToPercent } from './timeline'

describe('yearToPercent', () => {
  it('maps the axis ends and clamps outside years', () => {
    expect(yearToPercent(TIMELINE_START)).toBe(0)
    expect(yearToPercent(TIMELINE_END)).toBe(100)
    expect(yearToPercent(1200)).toBe(0)
    expect(yearToPercent(2100)).toBe(100)
  })
})

describe('packLanes', () => {
  it('never lets two spans in the same lane overlap (including the label gap)', () => {
    const gap = 12
    const spans = PERSONS.map(spanOf)
    const lanes = packLanes(spans, gap)

    expect(lanes.size).toBe(PERSONS.length)
    for (const a of spans) {
      for (const b of spans) {
        if (a.id === b.id || lanes.get(a.id) !== lanes.get(b.id)) continue
        const separated = a.end + gap <= b.start || b.end + gap <= a.start
        expect(separated, `${a.id} vs ${b.id}`).toBe(true)
      }
    }
  })

  it('draws living people to the end of the axis', () => {
    const walesa = PERSONS.find((p) => p.id === 'lech-walesa')!
    expect(spanOf(walesa).end).toBe(TIMELINE_END)
  })
  it('plots an unknown death only to the last documented living year', () => {
    const amo = PERSONS.find((p) => p.id === 'anton-amo')!
    expect(spanOf(amo).end).toBe(1753)
  })
})
