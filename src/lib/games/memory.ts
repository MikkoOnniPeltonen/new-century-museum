import type { Person } from '../../data/types'
import { shuffle, type Rng } from '../rng'

export const MEMORY_PAIRS = 5

export type MemoryFace = 'portrait' | 'work'

export interface MemoryCard {
  key: string
  personId: string
  face: MemoryFace
}

/** Each chosen person contributes a portrait card and a notable-work card. Chosen figures go in first. */
export function createMemoryDeck(
  centuryPeople: readonly Person[],
  featuredIds: readonly string[],
  rng: Rng,
  pairs = MEMORY_PAIRS,
): MemoryCard[] {
  const featured = centuryPeople.filter((person) => featuredIds.includes(person.id))
  const others = centuryPeople.filter((person) => !featuredIds.includes(person.id))
  const chosen = [...shuffle(featured, rng), ...shuffle(others, rng)].slice(0, pairs)

  const cards = chosen.flatMap((person): MemoryCard[] => [
    { key: `${person.id}:portrait`, personId: person.id, face: 'portrait' },
    { key: `${person.id}:work`, personId: person.id, face: 'work' },
  ])
  return shuffle(cards, rng)
}

export function isPair(a: MemoryCard, b: MemoryCard): boolean {
  return a.personId === b.personId && a.face !== b.face
}

/** A "move" is one pair of flips. A perfect memory needs exactly `pairs` moves. */
export function memoryStars(moves: number, pairs = MEMORY_PAIRS): 1 | 2 | 3 {
  if (moves <= pairs + 3) return 3
  if (moves <= pairs * 2 + 2) return 2
  return 1
}
