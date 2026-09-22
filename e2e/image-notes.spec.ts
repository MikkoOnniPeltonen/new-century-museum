import { expect, test } from '@playwright/test'
import { seedRooms, skipIntro, trackPageErrors } from './helpers.js'

test('replacement images load from documented sources and notes explain their provenance', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  const errors = trackPageErrors(page)
  await skipIntro(page)
  await seedRooms(page, { '1700s': ['olaudah-equiano'] })
  await page.goto('/room/1700s')
  const card = page.locator('.exhibit__item')
  await expect(card).toHaveCount(1)
  await expect(card.locator('img').first()).toHaveAttribute('src', /olaudah-equiano-480\.webp/)
  await expect(card.locator('img').last()).toHaveAttribute('src', /olaudah-equiano-480\.webp/)
  await card.getByText('About these images', { exact: true }).click()
  await expect(card.getByText(/1789 engraving/).first()).toBeVisible()
  await expect(card.getByText(/frontispiece and title page/).first()).toBeVisible()
  await expect(card.getByRole('link', { name: /National Portrait Gallery/ })).toBeVisible()
  await card.getByRole('button', { name: /Turn .*card/ }).click()
  await expect(card.locator('.image-caption')).toContainText('Work / context')
  await page.screenshot({ path: '/tmp/museum-image-notes-room.png', fullPage: true })
  expect(requests.filter((url) => /images\/(portraits|works)\/olaudah-equiano-/.test(url))).toHaveLength(2)
  expect(errors).toEqual([])
})
