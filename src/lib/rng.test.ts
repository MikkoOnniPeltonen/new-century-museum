import { describe, expect, it } from 'vitest'
import { createRng, sample, shuffle } from './rng'

describe('createRng', () => {
  it('replays the same sequence for the same seed', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = Array.from({ length: 5 }, a)
    expect(Array.from({ length: 5 }, b)).toEqual(seqA)
    expect(seqA.every((n) => n >= 0 && n < 1)).toBe(true)
  })

  it('differs between seeds', () => {
    expect(createRng(1)()).not.toEqual(createRng(2)())
  })
})

describe('shuffle and sample', () => {
  it('shuffle returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const result = shuffle(input, createRng(7))
    expect(input).toEqual([1, 2, 3, 4, 5, 6])
    expect([...result].sort()).toEqual(input)
  })

  it('sample returns unique items', () => {
    const result = sample(['a', 'b', 'c', 'd'], 3, createRng(3))
    expect(new Set(result).size).toBe(3)
  })
})
