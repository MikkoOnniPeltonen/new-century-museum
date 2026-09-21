import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { IMAGE_WIDTHS, PERSONS, getPerson, isLiving, lifespan } from '../lib/persons'
import { CENTURIES, isCentury } from './centuries'
import { TRAITS } from './types'

describe('persons data', () => {
  it('has five people per century with unique ids', () => {
    expect(new Set(PERSONS.map((p) => p.id)).size).toBe(PERSONS.length)
    for (const century of CENTURIES) {
      expect(PERSONS.filter((p) => p.century === century)).toHaveLength(5)
    }
  })

  it.each(PERSONS)('$id has valid fields', (person) => {
    expect(isCentury(person.century)).toBe(true)
    if (person.died !== null) expect(person.born).toBeLessThan(person.died)
    expect(person.traits.length).toBeGreaterThan(0)
    for (const trait of person.traits) expect(TRAITS).toContain(trait)
    expect(Math.abs(person.location.lat)).toBeLessThanOrEqual(90)
    expect(Math.abs(person.location.lng)).toBeLessThanOrEqual(180)
    expect(person.bio.length).toBeGreaterThan(40)
    expect(person.work.title).not.toBe('')
    expect(person.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(person.sources.length).toBeGreaterThan(0)
    for (const source of person.sources) {
      expect(source.title.length).toBeGreaterThan(0)
      expect(new URL(source.url).protocol).toBe('https:')
    }
    if (person.deathUnknown) {
      expect(person.died).toBeNull()
      expect(person.lastKnownAlive).toBeGreaterThan(person.born)
      expect(person.lifespanLabel).toBeTruthy()
      expect(person.dateNote).toBeTruthy()
    }
  })

  it.each(PERSONS)('$id has optimized images', (person) => {
    for (const kind of ['portraits', 'works']) {
      for (const width of IMAGE_WIDTHS) {
        // Vitest runs from the project root.
        const file = resolve(process.cwd(), 'public/images', kind, `${person.id}-${width}.webp`)
        expect(existsSync(file), file).toBe(true)
      }
    }
  })
})

describe('reviewed historical data', () => {
  it('distinguishes uncertain death dates from living people', () => {
    const amo = getPerson('anton-amo')!
    expect(lifespan(amo)).toBe('c. 1703–after 1753')
    expect(isLiving(amo)).toBe(false)
    expect(isLiving(getPerson('lech-walesa')!)).toBe(true)
    expect(lifespan(getPerson('sor-juana')!)).toBe('1648 or 1651–1695')
  })
  it('keeps corrected classifications and dates', () => {
    expect(getPerson('liu-mingchuan')!.traits).not.toContain('head of state')
    expect(getPerson('tokugawa-ieyasu')!.traits).not.toContain('head of state')
    expect(getPerson('queen-nzinga')!.traits).not.toContain('activist')
    expect(getPerson('ibrahim-muteferrika')!.died).toBe(1747)
    expect(getPerson('fdr')!.work.description).toContain('1956')
  })
})

describe('isCentury', () => {
  it('rejects anything that is not a known century', () => {
    expect(isCentury('1700s')).toBe(true)
    expect(isCentury('2000s')).toBe(false)
    expect(isCentury('"><img src=x>')).toBe(false)
    expect(isCentury(undefined)).toBe(false)
  })
})
