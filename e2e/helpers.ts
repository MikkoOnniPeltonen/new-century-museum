import { readFileSync } from 'node:fs'
import type { Page } from '@playwright/test'

type Rooms = Record<'1600s' | '1700s' | '1800s' | '1900s', string[]>

export interface PersonData {
  id: string
  name: string
  work: { title: string }
}

export const PERSONS: PersonData[] = JSON.parse(
  readFileSync(new URL('../src/data/persons.json', import.meta.url), 'utf8'),
).persons

export async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('cm:intro-seen', '1'))
}

/** Seeds the saved rooms once; later reloads keep whatever the app saved. */
export async function seedRooms(page: Page, rooms: Partial<Rooms>) {
  const full: Rooms = { '1600s': [], '1700s': [], '1800s': [], '1900s': [], ...rooms }
  await page.addInitScript((value) => {
    if (!localStorage.getItem('cm-v2')) localStorage.setItem('cm-v2', JSON.stringify({ state: { rooms: value }, version: 1 }))
  }, full)
}

export function trackPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}
