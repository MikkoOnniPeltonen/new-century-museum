export type Rng = () => number

/**
 * Seeded PRNG (mulberry32) so tests and `?seed=` links replay identical rounds.
 * Without a seed it falls back to Math.random.
 */
export function createRng(seed?: number): Rng {
  if (seed === undefined || !Number.isFinite(seed)) return Math.random
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const swap = result[i]
    result[i] = result[j]
    result[j] = swap
  }
  return result
}

export function sample<T>(items: readonly T[], count: number, rng: Rng): T[] {
  return shuffle(items, rng).slice(0, count)
}

export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]
}
