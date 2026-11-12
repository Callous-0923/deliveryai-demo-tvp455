import { test, expect } from '@playwright/test'

test.describe('REQ-008: 基础可访问性与多语言体验', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('i18nextLng')
      localStorage.removeItem('elderly-mode')
    })
  })

  test('REQ-008.1: 首页未绑定桌台时可切换语言和老人模式', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/#\/home$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
    await expect(page.getByRole('heading', { name: /热气升腾/ })).toBeVisible()
    await expect(page.getByRole('button', { name: '切换语言' })).toBeVisible()
    await expect(page.getByRole('button', { name: '切换至老人模式' })).toBeVisible()

    await page.getByRole('button', { name: '切换语言' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: /Steam rising/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch language' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch to elderly mode' })).toBeVisible()

    await page.getByRole('button', { name: 'Switch to elderly mode' }).click()
    await expect(page.locator('html')).toHaveClass(/elderly/)
    await expect(page.getByText('Switched to elderly mode')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch to regular mode' })).toBeVisible()
  })

  test('REQ-008.2: 欢迎页与菜单页保留可访问性切换状态并保持主流程可用', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: '切换至老人模式' }).click()
    await expect(page.locator('html')).toHaveClass(/elderly/)
    await page.getByRole('button', { name: /A08/ }).first().click()

    await expect(page).toHaveURL(/#\/welcome$/)
    await expect(page.getByRole('heading', { name: '欢迎光临沸点！' })).toBeVisible()
    await expect(page.getByRole('button', { name: '切换至常规模式' })).toBeVisible()

    await page.getByRole('button', { name: '切换语言' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: 'Welcome to Boiling Point!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch to regular mode' })).toBeVisible()

    await page.getByRole('button', { name: 'Start Ordering' }).click()
    await expect(page).toHaveURL(/#\/menu$/)
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch language' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Switch to regular mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'What shall we order together?' })).toBeVisible()
  })
})
