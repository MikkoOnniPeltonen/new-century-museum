import { CENTURIES, type Century } from '../../data/centuries'
import type { Person } from '../../data/types'
import { pick, shuffle, type Rng } from '../rng'

export const POINTS_PER_MATCH = 5

export interface PairingRound {
  /** Exactly one person per century, in random order */
  people: Person[]
}

export function createPairingRound(pool: readonly Person[], featured: readonly Person[], rng: Rng): PairingRound {
  const star = featured.length > 0 ? pick(featured, rng) : undefined
  const people = CENTURIES.map((century) =>
    star?.century === century ? star : pick(pool.filter((person) => person.century === century), rng),
  )
  return { people: shuffle(people, rng) }
}

export function scorePairing(round: PairingRound, assignments: Readonly<Record<string, Century | undefined>>) {
  const correct = round.people.filter((person) => assignments[person.id] === person.century).length
  return { correct, total: round.people.length, points: correct * POINTS_PER_MATCH }
}
