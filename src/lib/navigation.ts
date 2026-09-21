import type { Century } from '../data/centuries'

/**
 * Where a navbar century pill leads: stay in the same section (room subpage, map)
 * and swap the century; the timeline scrolls to it; everywhere else opens that room.
 */
export function centuryTarget(pathname: string, century: Century): string {
  const match = pathname.match(/^\/(room|map)\/[^/]+(\/[^?#]*)?/)
  if (match) return `/${match[1]}/${century}${match[2] ?? ''}`
  if (pathname.startsWith('/timeline')) return `/timeline?century=${century}`
  return `/room/${century}`
}

/** Pages keep the same key when only the century changes, so maps and timelines can animate in place. */
export function sectionKey(pathname: string): string {
  if (pathname.startsWith('/map/')) return 'map'
  return pathname
}
