export const ROUNDS_PER_GAME = 5
export const POINTS_PER_ROUND = 20
export const MAX_SCORE = ROUNDS_PER_GAME * POINTS_PER_ROUND

/** True when the player picked exactly the answer set, in any order. */
export function isExactSelection(answerIds: readonly string[], selectedIds: readonly string[]): boolean {
  const answer = new Set(answerIds)
  const selected = new Set(selectedIds)
  return answer.size === selected.size && [...answer].every((id) => selected.has(id))
}
