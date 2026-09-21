import { expect, test } from '@playwright/test'
import { skipIntro, trackPageErrors } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await skipIntro(page)
})

test('collect a figure, browse with the keyboard and flip their card in the room', async ({ page }) => {
  const errors = trackPageErrors(page)
  await page.goto('/room/1700s/collect')
  await expect(page.getByRole('heading', { level: 1, name: 'The Age of Enlightenment' })).toBeVisible()
  await expect(page.locator('.collect__bio')).toHaveCount(0)

  await page.getByRole('button', { name: 'Add Voltaire to room' }).click()
  await expect(page.getByText('Voltaire joined your 18th century room')).toBeVisible()
  await expect(page.locator('.collect-card.is-active .seal')).toHaveText('In your room')
  await expect(page.getByText('1 of 5 in your room')).toBeVisible()

  await page.getByLabel('Use the arrow keys to browse figures').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('button', { name: 'Add George to room' })).toBeVisible()

  await page.getByRole('link', { name: /View room/ }).click()
  await expect(page).toHaveURL(/\/room\/1700s$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Voltaire' })).toBeVisible()

  const card = page.getByRole('button', { name: "Turn Voltaire's card to see their notable work" })
  const biography = card.locator('.flip__bio-overlay')
  await expect(biography).toHaveCSS('opacity', '0')
  await card.hover()
  await expect(biography).toHaveCSS('opacity', '1')
  await card.focus()
  await page.keyboard.press('Enter')
  await expect(card).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('the room is saved across reloads and can be cleared', async ({ page }) => {
  await page.goto('/room/1800s/collect')
  await page.getByRole('button', { name: 'Add Napoleon to room' }).click()
  await page.reload()
  await expect(page.getByText('1 of 5 in your room')).toBeVisible()

  await page.getByRole('button', { name: 'Clear room' }).click()
  const dialog = page.getByRole('dialog', { name: 'Clear this room?' })
  await dialog.getByRole('button', { name: 'Clear room' }).click()
  await expect(page.getByText('0 of 5 in your room')).toBeVisible()
})

test('unknown centuries in the address bar lead back to the hall', async ({ page }) => {
  for (const path of ['/room/foo', '/room/%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E', '/map/2000s', '/room/1700s-and-more/game']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1, name: /Explore with us the/ })).toBeVisible()
  }
})
