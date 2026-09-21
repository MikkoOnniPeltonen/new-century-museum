import { expect, test } from '@playwright/test'
import { skipIntro } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await skipIntro(page)
})

test('pages fit the screen without sideways scrolling', async ({ page }) => {
  for (const path of ['/', '/room/1600s/collect', '/room/1700s', '/timeline', '/map/1800s', '/room/1900s/game', '/next-wing']) {
    await page.goto(path)
    await expect(page.locator('#main')).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('the menu drawer navigates', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('dialog', { name: 'Explore' }).getByRole('link', { name: 'Timeline' }).click()
  await expect(page).toHaveURL(/\/timeline$/)
})

test('the collect carousel can be swiped', async ({ page }) => {
  await page.goto('/room/1600s/collect')
  const stage = page.locator('.carousel__stage')
  const box = (await stage.boundingBox())!
  const y = box.y + box.height / 2

  await page.mouse.move(box.x + box.width * 0.85, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.15, y, { steps: 10 })
  await page.mouse.up()

  await expect(page.getByRole('button', { name: 'Add Isaac to room' })).toBeVisible()
})
