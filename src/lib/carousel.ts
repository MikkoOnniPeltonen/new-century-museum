/**
 * Signed distance from the active slide on a circular carousel, so the slide
 * just before index 0 sits at -1 instead of count - 1.
 */
export function wrapOffset(index: number, active: number, count: number): number {
  const half = Math.floor(count / 2)
  let offset = index - active
  if (offset > half) offset -= count
  if (offset < -half) offset += count
  return offset
}
