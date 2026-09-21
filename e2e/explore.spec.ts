import { expect, test } from '@playwright/test'
import { seedRooms, skipIntro } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await skipIntro(page)
})

test('map pins follow the century chosen in the navbar', async ({ page }) => {
  await seedRooms(page, { '1700s': ['voltaire'], '1800s': ['ada-lovelace', 'napoleon'] })
  await page.goto('/map/1700s')
  await expect(page.getByRole('button', { name: 'Voltaire, Paris, France' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Centuries' }).getByRole('link', { name: '1800s' }).click()
  await expect(page).toHaveURL(/\/map\/1800s$/)
  await expect(page.getByRole('button', { name: 'Ada Lovelace, London, England' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Voltaire, Paris, France' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Napoleon Bonaparte, Paris, France' }).click()
  await expect(page.getByRole('dialog', { name: 'Napoleon Bonaparte' })).toBeVisible()
})

test('an empty century can show every figure as hollow pins', async ({ page }) => {
  await page.goto('/map/1900s')
  await expect(page.getByText('No pins in the 20th Century yet')).toBeVisible()
  await page.getByRole('button', { name: 'Show all figures' }).click()
  await expect(page.locator('.pin')).toHaveCount(5)
  await expect(page.locator('.pin--hollow')).toHaveCount(5)
})

test('selecting a life on the timeline opens its details', async ({ page }) => {
  await page.goto('/timeline')
  await page.getByRole('button', { name: /^Ada Lovelace\s*1815–1852/ }).click()
  const drawer = page.getByRole('dialog', { name: 'Ada Lovelace' })
  await expect(drawer).toBeVisible()

  await drawer.getByRole('button', { name: 'Add to room' }).click()
  await expect(drawer.getByRole('button', { name: 'Remove from room' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
})

test('timeline zoom and century jumps', async ({ page }) => {
  await page.goto('/timeline')
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect(page.locator('.timeline__zoom-value')).toHaveText('1.5×')

  await page.getByRole('navigation', { name: 'Centuries' }).getByRole('link', { name: '1800s' }).click()
  await expect(page).toHaveURL(/\/timeline\?century=1800s$/)
  await expect(page.locator('.timeline__band.is-focus')).toContainText('19th Century')
})

test('sound settings show the century track and can mute', async ({ page }) => {
  await page.goto('/room/1700s')
  await page.getByRole('button', { name: 'Sound settings' }).click()
  const panel = page.locator('.audio-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByText('Goldberg Variations, BWV 988: Aria')).toBeVisible()

  const toggle = panel.getByRole('switch', { name: 'Soundscape' })
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
})

test('every soundscape file is served', async ({ request }) => {
  for (const century of ['1600s', '1700s', '1800s', '1900s']) {
    const response = await request.get(`/audio/${century}.m4a`)
    expect(response.ok(), century).toBe(true)
  }
})

test('uncertain lifespans and historical sources are visible in the timeline and room', async ({ page }) => {
  await seedRooms(page, { '1700s': ['anton-amo'] })
  await page.goto('/timeline')
  const amo = page.getByRole('button', { name: /^Anton Wilhelm Amo\s*c\. 1703–after 1753/ })
  await expect(amo).not.toHaveClass(/is-living/)
  await expect(amo).toHaveClass(/is-approximate/)
  await amo.click()
  const drawer = page.getByRole('dialog', { name: 'Anton Wilhelm Amo' })
  await drawer.getByText('Sources & historical context', { exact: true }).click()
  await expect(drawer.getByText(/last documented living year/)).toBeVisible()
  await expect(drawer.getByRole('link', { name: /University of Halle/ })).toHaveAttribute('href', 'https://www.amo.uni-halle.de/?lang=en')
  await page.keyboard.press('Escape')
  await page.goto('/room/1700s')
  await expect(page.getByText('c. 1703–after 1753', { exact: false })).toBeVisible()
  await page.getByText('Sources & historical context', { exact: true }).click()
  await expect(page.getByRole('link', { name: /University of Halle/ })).toBeVisible()
  await expect(page.getByText(/do not authenticate the images/)).toBeVisible()
})
