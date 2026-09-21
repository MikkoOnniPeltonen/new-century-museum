import { describe, expect, it } from 'vitest'
import { CENTURIES } from '../../data/centuries'
import { getPerson, PERSONS, personsOf } from '../persons'
import { createRng } from '../rng'
import { createPairingRound, scorePairing } from './centuryPairing'
import { createMemoryDeck, isPair, memoryStars } from './memory'
import { isExactSelection } from './scoring'
import { createJumpersRound } from './timeJumpers'
import { createTraitRound } from './traitMatch'

const SEEDS = Array.from({ length: 60 }, (_, i) => i + 1)
const ids = (people: { id: string }[]) => people.map((p) => p.id)

describe('Trait Matcher', () => {
  it.each(SEEDS)('seed %i builds a valid round that features a chosen figure', (seed) => {
    const star = getPerson('wang-zhenyi')!
    const round = createTraitRound(PERSONS, [star], createRng(seed))

    expect(new Set(ids(round.options)).size).toBe(6)
    expect(round.answerIds).toHaveLength(3)
    expect(ids(round.options)).toContain(star.id)
    for (const person of round.options) {
      expect(person.traits.includes(round.trait)).toBe(round.answerIds.includes(person.id))
    }
  })
})

describe('Century Pairing', () => {
  it.each(SEEDS)('seed %i has one person per century including the chosen figure', (seed) => {
    const star = getPerson('ada-lovelace')!
    const round = createPairingRound(PERSONS, [star], createRng(seed))

    expect(round.people.map((p) => p.century).sort()).toEqual([...CENTURIES])
    expect(ids(round.people)).toContain(star.id)
  })

  it('scores five points per correct match', () => {
    const round = createPairingRound(PERSONS, [], createRng(9))
    const [first, second] = round.people
    const result = scorePairing(round, { [first.id]: first.century, [second.id]: '1600s' === second.century ? '1900s' : '1600s' })
    expect(result).toEqual({ correct: 1, total: 4, points: 5 })
  })
})

describe('Time Jumpers', () => {
  it.each(SEEDS)('seed %i has three residents and two jumpers', (seed) => {
    const star = getPerson('voltaire')!
    const round = createJumpersRound(PERSONS, '1700s', [star], createRng(seed))

    expect(new Set(ids(round.options)).size).toBe(5)
    expect(ids(round.options)).toContain(star.id)
    const residents = round.options.filter((p) => p.century === '1700s')
    expect(residents).toHaveLength(3)
    expect([...round.answerIds].sort()).toEqual(ids(round.options.filter((p) => p.century !== '1700s')).sort())
  })
})

describe('Memory', () => {
  it.each(SEEDS)('seed %i deals five pairs with chosen figures first', (seed) => {
    const deck = createMemoryDeck(personsOf('1800s'), ['napoleon'], createRng(seed))

    expect(deck).toHaveLength(10)
    expect(new Set(deck.map((c) => c.key)).size).toBe(10)
    expect(deck.filter((c) => c.personId === 'napoleon')).toHaveLength(2)
  })

  it('matches only portrait with work of the same person', () => {
    const portrait = { key: 'a:portrait', personId: 'a', face: 'portrait' as const }
    expect(isPair(portrait, { key: 'a:work', personId: 'a', face: 'work' })).toBe(true)
    expect(isPair(portrait, { key: 'b:work', personId: 'b', face: 'work' })).toBe(false)
    expect(isPair(portrait, portrait)).toBe(false)
  })

  it('awards stars by move count', () => {
    expect(memoryStars(5)).toBe(3)
    expect(memoryStars(12)).toBe(2)
    expect(memoryStars(20)).toBe(1)
  })
})

describe('isExactSelection', () => {
  it('ignores order and rejects extra or missing picks', () => {
    expect(isExactSelection(['a', 'b'], ['b', 'a'])).toBe(true)
    expect(isExactSelection(['a', 'b'], ['a'])).toBe(false)
    expect(isExactSelection(['a', 'b'], ['a', 'b', 'c'])).toBe(false)
  })
})
