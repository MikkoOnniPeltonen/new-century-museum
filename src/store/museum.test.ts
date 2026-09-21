import { beforeEach, describe, expect, it } from 'vitest'
import { migrateLegacyStorage, readLegacyRooms, sanitizeRooms, STORAGE_KEY, useMuseum } from './museum'

const legacyRoom = (names: string[]) =>
  JSON.stringify({ century: 'x', selectedPersons: names.map((name) => ({ name, bio: '...' })), color: 'red' })

describe('legacy migration', () => {
  beforeEach(() => localStorage.clear())

  it('maps saved names from the old site to person ids', () => {
    localStorage.setItem('room_1700s', legacyRoom(['Voltaire', 'Wang Zhenyi', 'Voltaire']))
    localStorage.setItem('room_1900s', legacyRoom(['Lech Wałęsa', 'Nobody']))

    const rooms = readLegacyRooms(localStorage)
    expect(rooms?.['1700s']).toEqual(['voltaire', 'wang-zhenyi'])
    expect(rooms?.['1900s']).toEqual(['lech-walesa'])
    expect(rooms?.['1600s']).toEqual([])
  })

  it('writes the new key before removing old keys, and only once', () => {
    localStorage.setItem('room_1800s', legacyRoom(['Ada Lovelace']))
    migrateLegacyStorage(localStorage)

    expect(localStorage.getItem('room_1800s')).toBeNull()
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.state.rooms['1800s']).toEqual(['ada-lovelace'])

    localStorage.setItem('room_1800s', legacyRoom(['Napoleon Bonaparte']))
    migrateLegacyStorage(localStorage)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).state.rooms['1800s']).toEqual(['ada-lovelace'])
  })

  it('returns null when there is nothing to import', () => {
    expect(readLegacyRooms(localStorage)).toBeNull()
  })
})

describe('sanitizeRooms', () => {
  it('drops unknown ids, wrong-century ids and duplicates', () => {
    expect(
      sanitizeRooms({ '1600s': ['isaac-newton', 'voltaire', 'isaac-newton', 42, 'ghost'], '1700s': 'nope' }),
    ).toEqual({ '1600s': ['isaac-newton'], '1700s': [], '1800s': [], '1900s': [] })
    expect(sanitizeRooms(null)['1900s']).toEqual([])
  })
})

describe('museum store', () => {
  beforeEach(() => useMuseum.setState({ rooms: sanitizeRooms({}), bestScores: {}, bestMemoryMoves: {} }))

  it('adds, removes and clears room figures without duplicates', () => {
    const { addToRoom, removeFromRoom, clearRoom } = useMuseum.getState()
    addToRoom('1600s', 'queen-nzinga')
    addToRoom('1600s', 'queen-nzinga')
    addToRoom('1600s', 'tokugawa-ieyasu')
    expect(useMuseum.getState().rooms['1600s']).toEqual(['queen-nzinga', 'tokugawa-ieyasu'])

    removeFromRoom('1600s', 'queen-nzinga')
    expect(useMuseum.getState().rooms['1600s']).toEqual(['tokugawa-ieyasu'])

    clearRoom('1600s')
    expect(useMuseum.getState().rooms['1600s']).toEqual([])
  })

  it('records only improving scores', () => {
    const { recordScore, recordMemory } = useMuseum.getState()
    expect(recordScore('trait', 60)).toBe(true)
    expect(recordScore('trait', 40)).toBe(false)
    expect(recordScore('trait', 80)).toBe(true)
    expect(useMuseum.getState().bestScores.trait).toBe(80)

    expect(recordMemory('1700s', 9)).toBe(true)
    expect(recordMemory('1700s', 11)).toBe(false)
    expect(recordMemory('1700s', 6)).toBe(true)
  })
})
