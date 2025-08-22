import { test } from '@playwright/test';

test('Quick Check - Statistics Boxes', async ({ page }) => {
  console.log('🔍 Quick check of statistics boxes...');

  // Go to home page
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for animations
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/current-stats.png', fullPage: true });
  console.log('✅ Screenshot saved!');
  
  // Keep open for 30 seconds
  await page.waitForTimeout(30000);
});
