import { test } from '@playwright/test';

test.describe('Next.js App Router Tests', () => {
  test('Home page loads in Safari', async ({ page }) => {
    // Navigate to your local dev server
    await page.goto('http://localhost:3001');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if body has content
    const bodyText = await page.textContent('body');
    console.log('Body content length:', bodyText?.length);

    // Take screenshot to verify rendering
    await page.screenshot({
      path: `safari-screenshot-${Date.now()}.png`
    });

    // Keep browser open
    console.log('Browser is open for manual inspection...');
    await page.pause();
  });
});
