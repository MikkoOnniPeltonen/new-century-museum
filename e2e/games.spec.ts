import { expect, test } from '@playwright/test'
import { PERSONS, skipIntro } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await skipIntro(page)
})

test('the memory game can be completed with a perfect score', async ({ page }) => {
  await page.goto('/room/1700s/game?mode=memory&seed=7')
  const cards = page.locator('.mem-card')
  await expect(cards).toHaveCount(10)

  // Each card's (visually hidden) front label names a person or their notable work.
  const labels = await page.locator('.mem-card__label').allTextContents()
  const pairs = new Map<string, number[]>()
  labels.forEach((label, index) => {
    const person = PERSONS.find((p) => p.name === label || p.work.title === label)
    if (!person) throw new Error(`Unknown card label: ${label}`)
    pairs.set(person.id, [...(pairs.get(person.id) ?? []), index])
  })
  expect(pairs.size).toBe(5)

  for (const [first, second] of pairs.values()) {
    await cards.nth(first).click()
    await cards.nth(second).click()
    await expect(cards.nth(first)).toBeDisabled()
  }

  await expect(page.getByRole('dialog', { name: 'Perfect memory!' })).toBeVisible()
  await expect(page.getByText(/^5 moves in/)).toBeVisible()
})

test('trait matcher scores a round and reveals the answers', async ({ page }) => {
  await page.goto('/room/1700s/game?mode=trait&seed=11')
  const tiles = page.locator('.tile')
  await expect(tiles).toHaveCount(6)

  await tiles.first().click()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.locator('.verdict')).toBeVisible()
  await expect(page.locator('.tile__badge')).toHaveCount(6)

  await page.getByRole('button', { name: 'Next round' }).click()
  await expect(page.getByRole('button', { name: 'Check answer' })).toBeDisabled()
})

test('century pairing lets you take back a placement', async ({ page }) => {
  await page.goto('/room/1800s/game?mode=pairing&seed=3')
  const tiles = page.locator('.tile')
  await expect(tiles).toHaveCount(4)
  const name = (await tiles.first().locator('.tile__name').textContent())!

  await tiles.first().click()
  await page.getByRole('button', { name: `Place ${name} here` }).first().click()
  const chip = page.getByRole('button', { name: `Remove ${name} from the 17th Century` })
  await expect(chip).toBeVisible()

  await chip.click()
  await expect(page.getByRole('button', { name: new RegExp(`^Remove ${name}`) })).toHaveCount(0)
})
