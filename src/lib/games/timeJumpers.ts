import type { Century } from '../../data/centuries'
import type { Person } from '../../data/types'
import { pick, sample, shuffle, type Rng } from '../rng'

const RESIDENTS = 3
const JUMPERS = 2

export interface JumpersRound {
  homeCentury: Century
  options: Person[]
  answerIds: string[]
}

/**
 * Three residents of the room's century and two "time jumpers" from other centuries.
 * A chosen figure from the room is always one of the residents when available.
 */
export function createJumpersRound(
  pool: readonly Person[],
  homeCentury: Century,
  featured: readonly Person[],
  rng: Rng,
): JumpersRound {
  const locals = pool.filter((person) => person.century === homeCentury)
  const homeFeatured = featured.filter((person) => person.century === homeCentury)
  const star = homeFeatured.length > 0 ? pick(homeFeatured, rng) : undefined

  const residents = star
    ? [star, ...sample(locals.filter((person) => person.id !== star.id), RESIDENTS - 1, rng)]
    : sample(locals, RESIDENTS, rng)
  const jumpers = sample(
    pool.filter((person) => person.century !== homeCentury),
    JUMPERS,
    rng,
  )

  return {
    homeCentury,
    options: shuffle([...residents, ...jumpers], rng),
    answerIds: jumpers.map((person) => person.id),
  }
}
