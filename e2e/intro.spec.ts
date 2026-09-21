import { expect, test } from '@playwright/test'
import { skipIntro, trackPageErrors } from './helpers.ts'

const INTRO = { name: 'Welcome to the Century Museum' }
const HALL_HEADING = { level: 1, name: /Explore with us the/ } as const

test('the intro can be skipped at once and does not replay in the same session', async ({ page }) => {
  const errors = trackPageErrors(page)
  await page.goto('/')
  const intro = page.getByRole('dialog', INTRO)
  await expect(intro).toBeVisible()

  await page.getByRole('button', { name: /Skip intro/ }).click()
  await expect(intro).toBeHidden({ timeout: 1000 })
  await expect(page.getByRole('heading', HALL_HEADING)).toBeVisible()

  await page.getByRole('link', { name: 'Enter room' }).first().click()
  await expect(page).toHaveURL(/\/room\/1600s$/)
  await page.getByRole('link', { name: /back to the hall/i }).click()
  await expect(page.getByRole('heading', HALL_HEADING)).toBeVisible()
  await expect(page.getByRole('dialog', INTRO)).toHaveCount(0)
  expect(errors).toEqual([])
})

test('the full intro ends with an invitation that opens the curtains', async ({ page }) => {
  await page.goto('/')
  const enter = page.getByRole('button', { name: 'Enter the museum' })
  await expect(enter).toBeEnabled({ timeout: 12_000 })
  await enter.click()
  await expect(page.getByRole('dialog', INTRO)).toBeHidden({ timeout: 4000 })
  await expect(page.getByRole('heading', HALL_HEADING)).toBeVisible()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the intro is shortened', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Enter the museum' })).toBeEnabled({ timeout: 4000 })
  })
})

test('the skip link moves focus to the main content', async ({ page }) => {
  await skipIntro(page)
  await page.goto('/room/1700s')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})
