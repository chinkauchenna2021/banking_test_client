import { test, expect } from '@playwright/test'

test.describe('Next.js App Router Tests', () => {
  // Test basic page navigation
  test('Home page loads', async ({ page }) => {
    await page.goto('http://localhost:3001')
    
    // Basic assertions
    await expect(page).toHaveTitle(/Next.js|Home/)
    
    // Check for hydration
    await expect(page.locator('body')).not.toBeEmpty()
    
    // Keep browser open for manual inspection
    await page.pause()
  })

  // Test app router specific features
  test('Client-side navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Click on a link (adjust selector to your app)
    await page.click('a[href*="/about"]')
    
    // Wait for navigation
    await page.waitForURL('**/about')
    
    // Verify new page loaded
    await expect(page.locator('h1')).toBeVisible()
  })

  // Test loading states
  test('Loading states display correctly', async ({ page }) => {
    await page.goto('http://localhost:3001/slow-page') // if you have one
    
    // Check for loading indicator
    await expect(page.locator('[data-loading]')).toBeVisible()
    
    // Wait for content to load
    await expect(page.locator('[data-loaded]')).toBeVisible({
      timeout: 10000
    })
  })
})