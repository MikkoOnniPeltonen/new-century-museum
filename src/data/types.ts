import type { Century } from './centuries'

export const TRAITS = [
  'writer',
  'philosopher',
  'scientist',
  'mathematician',
  'head of state',
  'military leader',
  'activist',
  'innovator',
] as const

export type Trait = (typeof TRAITS)[number]

export interface Person {
  id: string
  century: Century
  name: string
  born: number
  /** null for living people OR an unknown death date; check deathUnknown. */
  died: number | null
  deathUnknown?: boolean
  /** Last documented living year, used only to plot an unknown death endpoint. */
  lastKnownAlive?: number
  lifespanLabel?: string
  dateNote?: string
  reviewedOn: string
  sources: { title: string; url: string }[]
  region: string
  profession: string
  traits: Trait[]
  bio: string
  work: { title: string; description: string }
  /** Where the person is best known for, used for the world map pin */
  location: { label: string; lat: number; lng: number }
}
