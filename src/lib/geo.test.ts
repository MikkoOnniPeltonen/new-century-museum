import { describe, expect, it } from 'vitest'
import { createProjection, MAP_HEIGHT, MAP_WIDTH, spreadPins } from './geo'
import { PERSONS } from './persons'

describe('createProjection', () => {
  it('places every person inside the map', () => {
    const projection = createProjection()
    for (const person of PERSONS) {
      const point = projection([person.location.lng, person.location.lat])
      expect(point, person.id).not.toBeNull()
      const [x, y] = point!
      expect(x).toBeGreaterThan(0)
      expect(x).toBeLessThan(MAP_WIDTH)
      expect(y).toBeGreaterThan(0)
      expect(y).toBeLessThan(MAP_HEIGHT)
    }
  })

  it('puts the northern hemisphere above the south', () => {
    const projection = createProjection()
    const [, london] = projection([-0.13, 51.5])!
    const [, robbenIsland] = projection([18.37, -33.8])!
    expect(london).toBeLessThan(robbenIsland)
  })
})

describe('spreadPins', () => {
  it('fans out pins that share a spot and leaves lone pins alone', () => {
    const pins = spreadPins(
      [
        { id: 'london', x: 100, y: 100 },
        { id: 'paris', x: 104, y: 103 },
        { id: 'tokyo', x: 800, y: 200 },
      ],
      20,
    )
    const byId = Object.fromEntries(pins.map((pin) => [pin.id, pin]))
    const gap = Math.hypot(
      byId.london.x + byId.london.dx - (byId.paris.x + byId.paris.dx),
      byId.london.y + byId.london.dy - (byId.paris.y + byId.paris.dy),
    )
    expect(gap).toBeGreaterThanOrEqual(20)
    expect(byId.tokyo).toMatchObject({ dx: 0, dy: 0 })
  })
})
