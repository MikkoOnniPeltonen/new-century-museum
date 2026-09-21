import { geoNaturalEarth1, type GeoProjection } from 'd3-geo'

export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 520
const MAP_MARGIN = 12

export function createProjection(): GeoProjection {
  return geoNaturalEarth1().fitExtent(
    [
      [MAP_MARGIN, MAP_MARGIN],
      [MAP_WIDTH - MAP_MARGIN, MAP_HEIGHT - MAP_MARGIN],
    ],
    { type: 'Sphere' },
  )
}

export interface MapPoint {
  id: string
  x: number
  y: number
}

/**
 * Pins closer than `minDistance` (in map units) are grouped and fanned out on a
 * small ring, so e.g. London and Paris in the same century stay clickable.
 */
export function spreadPins<T extends MapPoint>(points: readonly T[], minDistance = 22): (T & { dx: number; dy: number })[] {
  const clusters: T[][] = []
  for (const point of points) {
    const cluster = clusters.find((group) => Math.hypot(group[0].x - point.x, group[0].y - point.y) < minDistance)
    if (cluster) cluster.push(point)
    else clusters.push([point])
  }

  return clusters.flatMap((group) =>
    group.map((point, i) => {
      if (group.length === 1) return { ...point, dx: 0, dy: 0 }
      const angle = (i / group.length) * Math.PI * 2 - Math.PI / 2
      const radius = minDistance * 0.75
      return { ...point, dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius }
    }),
  )
}
