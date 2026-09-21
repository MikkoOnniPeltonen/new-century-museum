import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { CENTURIES, type Century } from '../data/centuries'
import { getPerson, PERSONS } from '../lib/persons'

export const STORAGE_KEY = 'cm-v2'
const STORAGE_VERSION = 1

export type GameMode = 'trait' | 'pairing' | 'jumpers'
export type Rooms = Record<Century, string[]>

export interface AudioSettings {
  enabled: boolean
  volume: number
}

interface PersistedState {
  rooms: Rooms
  audio: AudioSettings
  bestScores: Partial<Record<GameMode, number>>
  bestMemoryMoves: Partial<Record<Century, number>>
}

interface MuseumState extends PersistedState {
  addToRoom: (century: Century, personId: string) => void
  removeFromRoom: (century: Century, personId: string) => void
  clearRoom: (century: Century) => void
  setAudio: (patch: Partial<AudioSettings>) => void
  /** Returns true when the score is a new best */
  recordScore: (mode: GameMode, score: number) => boolean
  /** Returns true when the move count is a new best (fewer is better) */
  recordMemory: (century: Century, moves: number) => boolean
}

export function emptyRooms(): Rooms {
  return { '1600s': [], '1700s': [], '1800s': [], '1900s': [] }
}

/** Keeps only known person ids that belong to the room's century, without duplicates. */
export function sanitizeRooms(value: unknown): Rooms {
  const rooms = emptyRooms()
  if (typeof value !== 'object' || value === null) return rooms
  for (const century of CENTURIES) {
    const ids: unknown = (value as Record<string, unknown>)[century]
    if (!Array.isArray(ids)) continue
    rooms[century] = [...new Set(ids)].filter(
      (id): id is string => typeof id === 'string' && getPerson(id)?.century === century,
    )
  }
  return rooms
}

/** Reads rooms saved by the original vanilla-JS site: `room_<century>` with full person objects. */
export function readLegacyRooms(storage: Storage): Rooms | null {
  const rooms = emptyRooms()
  let found = false
  for (const century of CENTURIES) {
    const raw = storage.getItem(`room_${century}`)
    if (raw === null) continue
    found = true
    try {
      const parsed = JSON.parse(raw) as { selectedPersons?: { name?: unknown }[] }
      for (const entry of parsed.selectedPersons ?? []) {
        const person = PERSONS.find((p) => p.century === century && p.name === entry.name)
        if (person && !rooms[century].includes(person.id)) rooms[century].push(person.id)
      }
    } catch {
      // Corrupt legacy entry: skip it.
    }
  }
  return found ? rooms : null
}

/** One-time import: writes legacy rooms into the new storage key, then removes the old keys. */
export function migrateLegacyStorage(storage: Storage): void {
  if (storage.getItem(STORAGE_KEY) !== null) return
  const legacy = readLegacyRooms(storage)
  if (!legacy) return
  storage.setItem(STORAGE_KEY, JSON.stringify({ state: { rooms: legacy }, version: STORAGE_VERSION }))
  for (const century of CENTURIES) storage.removeItem(`room_${century}`)
}

try {
  migrateLegacyStorage(localStorage)
} catch {
  // localStorage unavailable: nothing to migrate.
}

export const useMuseum = create<MuseumState>()(
  persist(
    (set, get) => ({
      rooms: emptyRooms(),
      audio: { enabled: true, volume: 0.6 },
      bestScores: {},
      bestMemoryMoves: {},

      addToRoom: (century, personId) =>
        set((state) =>
          state.rooms[century].includes(personId)
            ? state
            : { rooms: { ...state.rooms, [century]: [...state.rooms[century], personId] } },
        ),

      removeFromRoom: (century, personId) =>
        set((state) => ({
          rooms: { ...state.rooms, [century]: state.rooms[century].filter((id) => id !== personId) },
        })),

      clearRoom: (century) => set((state) => ({ rooms: { ...state.rooms, [century]: [] } })),

      setAudio: (patch) => set((state) => ({ audio: { ...state.audio, ...patch } })),

      recordScore: (mode, score) => {
        const best = get().bestScores[mode]
        if (best !== undefined && best >= score) return false
        set((state) => ({ bestScores: { ...state.bestScores, [mode]: score } }))
        return true
      },

      recordMemory: (century, moves) => {
        const best = get().bestMemoryMoves[century]
        if (best !== undefined && best <= moves) return false
        set((state) => ({ bestMemoryMoves: { ...state.bestMemoryMoves, [century]: moves } }))
        return true
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ rooms, audio, bestScores, bestMemoryMoves }): PersistedState => ({
        rooms,
        audio,
        bestScores,
        bestMemoryMoves,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PersistedState>
        return {
          ...current,
          ...saved,
          rooms: sanitizeRooms(saved.rooms),
          audio: { ...current.audio, ...saved.audio },
        }
      },
    },
  ),
)
