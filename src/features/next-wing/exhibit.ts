export interface Exhibit { name: string; title: string; challenge: string; choices: string[]; action: string }
const KEY = 'cm-next-wing-exhibit'
export function readExhibit(): Exhibit | null {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!data || typeof data !== 'object') return null
    const item = data as Exhibit
    return typeof item.name === 'string' && typeof item.title === 'string' && typeof item.challenge === 'string' && typeof item.action === 'string' && Array.isArray(item.choices) && item.choices.every((choice) => typeof choice === 'string') ? item : null
  } catch { return null }
}
export function saveExhibit(exhibit: Exhibit): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(exhibit)); return true } catch { return false }
}
