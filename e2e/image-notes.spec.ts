import { expect, test } from '@playwright/test'
import { seedRooms, skipIntro, trackPageErrors } from './helpers.js'

test('withheld images stay out of room requests and notes explain the substitution', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  const errors = trackPageErrors(page)
  await skipIntro(page)
  await seedRooms(page, { '1700s': ['anton-amo'] })
  await page.goto('/room/1700s')
  const card = page.locator('.exhibit__item')
  await expect(card).toHaveCount(1)
  await expect(card.locator('img').first()).toHaveAttribute('src', /^data:image\/svg\+xml,/)
  await expect(card.locator('img').last()).toHaveAttribute('src', /^data:image\/svg\+xml,/)
  await card.getByText('About these images', { exact: true }).click()
  await expect(card.getByText(/not an authenticated likeness of Amo/)).toBeVisible()
  await expect(card.getByText(/1734 dissertation, not the featured 1738 treatise/)).toBeVisible()
  await expect(card.getByRole('link', { name: /Project Vox/ })).toBeVisible()
  await card.getByRole('button', { name: /Turn .*card/ }).click()
  await expect(card.locator('.image-caption')).toContainText('Work / context')
  await page.screenshot({ path: '/tmp/museum-image-notes-room.png', fullPage: true })
  expect(requests.filter((url) => /images\/(portraits|works)\/anton-amo-/.test(url))).toEqual([])
  expect(errors).toEqual([])
})
