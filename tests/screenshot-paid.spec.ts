import { test } from '@playwright/test';

test('screenshot paid page', async ({ page }) => {
  await page.goto('http://localhost:3001/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/paid-page-current.png', fullPage: true });
  console.log('✅ Screenshot saved to test-results/paid-page-current.png');
});
