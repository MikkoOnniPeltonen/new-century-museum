export const CENTURIES = ['1600s', '1700s', '1800s', '1900s'] as const

export type Century = (typeof CENTURIES)[number]

export interface CenturyInfo {
  id: Century
  /** e.g. "17th" */
  ordinal: string
  /** e.g. "17th Century" */
  title: string
  epithet: string
  tagline: string
  start: number
  end: number
}

export const CENTURY_INFO: Record<Century, CenturyInfo> = {
  '1600s': {
    id: '1600s',
    ordinal: '17th',
    title: '17th Century',
    epithet: 'The Baroque Age',
    tagline: 'Empires, faith and the first scientific revolution',
    start: 1600,
    end: 1699,
  },
  '1700s': {
    id: '1700s',
    ordinal: '18th',
    title: '18th Century',
    epithet: 'The Age of Enlightenment',
    tagline: 'Reason, revolution and the printed word',
    start: 1700,
    end: 1799,
  },
  '1800s': {
    id: '1800s',
    ordinal: '19th',
    title: '19th Century',
    epithet: 'The Age of Revolutions',
    tagline: 'Nations, machines and the fight for freedom',
    start: 1800,
    end: 1899,
  },
  '1900s': {
    id: '1900s',
    ordinal: '20th',
    title: '20th Century',
    epithet: 'The Modern Age',
    tagline: 'Rights, relativity and a connected world',
    start: 1900,
    end: 1999,
  },
}

export function isCentury(value: unknown): value is Century {
  return typeof value === 'string' && (CENTURIES as readonly string[]).includes(value)
}
