import { expect, test } from '@playwright/test'
import { skipIntro } from './helpers.ts'

test.beforeEach(async ({ page }) => { await skipIntro(page) })

test('holding the sealed doorway breaks through to the next wing', async ({ page }) => {
  await page.goto('/')
  const door = page.getByRole('button', { name: 'Hold to break the seal' })
  await door.scrollIntoViewIfNeeded()
  await door.focus()
  await page.keyboard.down('Enter')
  await expect(page).toHaveURL(/next-wing$/, { timeout: 10000 })
  await page.keyboard.up('Enter')
  await expect(page.getByRole('heading', { name: 'History is still being written.' })).toBeVisible()
})

test('portal shows progressive opening and supports reduced motion on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const door = page.getByRole('button', { name: 'Hold to break the seal' })
  await door.scrollIntoViewIfNeeded()
  await page.locator('.next-door__arch').screenshot({ path: '/tmp/tomorrow-portal-idle.png' })
  await door.focus()
  await page.keyboard.down('Space')
  await expect.poll(async () => Number(await page.getByRole('progressbar', { name: 'Door pressure' }).getAttribute('value'))).toBeGreaterThan(35)
  await page.keyboard.up('Space')
  await expect(page.locator('.next-door')).toHaveClass(/next-door--charging/)
  await expect(page.locator('.next-door__readout')).toHaveText(/^\d+%$/)
  await expect(page.locator('.next-door__arch')).toHaveText(/^Step intotomorrow\d+%$/)
  await expect(page.locator('.next-door__sky')).toHaveCSS('animation-name', 'none')
  await page.locator('.next-door__arch').screenshot({ path: '/tmp/tomorrow-portal-progress.png' })
  await page.getByRole('button', { name: 'Enter the next wing' }).click()
  await expect(page).toHaveURL(/next-wing$/)
})

test('scroll pressure keeps the page scrollable and the direct entrance remains available', async ({ page }) => {
  await page.goto('/')
  const door = page.getByRole('button', { name: 'Hold to break the seal' })
  await door.scrollIntoViewIfNeeded()
  await page.mouse.wheel(0, 180)
  await expect.poll(async () => Number(await page.getByRole('progressbar', { name: 'Door pressure' }).getAttribute('value'))).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Enter the next wing' }).click()
  await expect(page).toHaveURL(/next-wing$/)
})

test('all four challenges produce an exhibit and remember the latest story', async ({ page }) => {
  await page.goto('/next-wing')
  const illustrations = new Set<string>()
  const roles = new Set<string>()
  for (const title of ['A cooler neighbourhood', 'A rumour travels fast', 'A place at the table', 'Who does the tool serve?']) {
    await page.getByRole('button', { name: new RegExp(title.replace('?', '\\?')) }).click()
    for (let step = 0; step < 3; step++) {
      await page.getByRole('group', { name: 'Choose your action' }).getByRole('button').first().click()
      await expect(page.locator('.future-story').getByRole('status')).toContainText('What happens next')
      if (step === 2) await page.getByLabel('Name on your exhibit (optional)').fill('Alex')
      await page.getByRole('button', { name: step === 2 ? 'Reveal my exhibit' : 'Continue the story' }).click()
    }
    await expect(page.getByRole('heading', { name: 'Alex', exact: true })).toBeVisible()
    await expect(page.getByText('One small step beyond this museum')).toBeVisible()
    const art = page.locator('.future-exhibit').getByRole('img')
    await expect(art).toBeVisible()
    illustrations.add((await art.getAttribute('aria-label'))!)
    roles.add((await page.locator('.future-exhibit h3').textContent())!)
    await page.locator('.future-exhibit').screenshot({ path: test.info().outputPath(`${roles.size}-exhibit.png`) })
    await page.getByRole('button', { name: 'Write another chapter' }).click()
  }
  expect(illustrations.size).toBe(4)
  expect(roles.size).toBe(4)
  await page.reload()
  await page.getByRole('button', { name: 'View your exhibit' }).click()
  await expect(page.getByRole('heading', { name: 'Alex', exact: true })).toBeVisible()
  await expect(page.locator('.future-exhibit').getByRole('img')).toHaveAttribute('aria-label', /inclusive design workshop/)
})

test('next wing has its own decodable soundtrack and sound settings', async ({ page }) => {
  await page.goto('/next-wing')
  await page.getByRole('button', { name: 'Sound settings' }).click()
  await expect(page.getByText('Tomorrow, Together')).toBeVisible()
  const sound = page.getByRole('switch', { name: 'Soundscape' })
  if (await sound.getAttribute('aria-checked') !== 'true') await sound.click()
  const duration = await page.evaluate(async () => {
    const audio = new Audio('/audio/next-wing.m4a')
    try {
      await audio.play()
      return audio.duration
    } finally { audio.pause() }
  })
  expect(duration).toBeGreaterThan(90)
  expect(duration).toBeLessThan(93)
  await sound.click()
  await expect(sound).toHaveAttribute('aria-checked', 'false')
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Back to the museum' }).click()
  await page.getByRole('button', { name: 'Sound settings' }).click()
  await expect(page.locator('.audio-panel__now strong')).not.toHaveText('Tomorrow, Together')
})
