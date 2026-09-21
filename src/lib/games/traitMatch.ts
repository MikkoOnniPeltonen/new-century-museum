import { TRAITS, type Person, type Trait } from '../../data/types'
import { pick, sample, shuffle, type Rng } from '../rng'

const GROUP_SIZE = 3

export interface TraitRound {
  trait: Trait
  options: Person[]
  answerIds: string[]
}

/** Picks `count` people from `group`, always including `star` when they belong to it. */
function fillGroup(group: readonly Person[], star: Person | undefined, count: number, rng: Rng): Person[] {
  if (star && group.some((person) => person.id === star.id)) {
    return [star, ...sample(group.filter((person) => person.id !== star.id), count - 1, rng)]
  }
  return sample(group, count, rng)
}

/**
 * Three people who share a trait plus three who don't. When the player has chosen
 * figures (`featured`), one of them always appears in the round.
 */
export function createTraitRound(pool: readonly Person[], featured: readonly Person[], rng: Rng): TraitRound {
  const playable = TRAITS.filter((trait) => {
    const holders = pool.filter((person) => person.traits.includes(trait)).length
    return holders >= GROUP_SIZE && pool.length - holders >= GROUP_SIZE
  })
  if (playable.length === 0) {
    throw new Error('Trait Matcher needs three people with and three without a shared trait')
  }

  const star = featured.length > 0 ? pick(featured, rng) : undefined
  const trait = pick(playable, rng)
  const correct = fillGroup(pool.filter((person) => person.traits.includes(trait)), star, GROUP_SIZE, rng)
  const incorrect = fillGroup(pool.filter((person) => !person.traits.includes(trait)), star, GROUP_SIZE, rng)

  return {
    trait,
    options: shuffle([...correct, ...incorrect], rng),
    answerIds: correct.map((person) => person.id),
  }
}
