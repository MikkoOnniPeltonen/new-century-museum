import { describe, expect, it } from 'vitest'
import { centuryTarget, sectionKey } from './navigation'

describe('centuryTarget', () => {
  it('keeps the current section when switching century', () => {
    expect(centuryTarget('/room/1700s', '1800s')).toBe('/room/1800s')
    expect(centuryTarget('/room/1700s/collect', '1600s')).toBe('/room/1600s/collect')
    expect(centuryTarget('/room/1700s/game', '1900s')).toBe('/room/1900s/game')
    expect(centuryTarget('/map/1700s', '1800s')).toBe('/map/1800s')
  })

  it('jumps within the timeline and opens rooms from elsewhere', () => {
    expect(centuryTarget('/timeline', '1700s')).toBe('/timeline?century=1700s')
    expect(centuryTarget('/', '1600s')).toBe('/room/1600s')
    expect(centuryTarget('/nowhere', '1900s')).toBe('/room/1900s')
  })
})

describe('sectionKey', () => {
  it('keeps map pages mounted across centuries', () => {
    expect(sectionKey('/map/1600s')).toBe(sectionKey('/map/1900s'))
    expect(sectionKey('/room/1600s')).not.toBe(sectionKey('/room/1700s'))
  })
})
