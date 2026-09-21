import { describe, expect, it } from 'vitest'
import { wrapOffset } from './carousel'

describe('wrapOffset', () => {
  it('places neighbours on both sides of the active slide, wrapping around', () => {
    expect([0, 1, 2, 3, 4].map((i) => wrapOffset(i, 0, 5))).toEqual([0, 1, 2, -2, -1])
    expect([0, 1, 2, 3, 4].map((i) => wrapOffset(i, 4, 5))).toEqual([1, 2, -2, -1, 0])
  })
})
