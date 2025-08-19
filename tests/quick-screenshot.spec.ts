import { test, expect } from '@playwright/test';

test('Quick Screenshot - Show Chart Area', async ({ page }) => {
  console.log('📸 Taking quick screenshot of chart area...');
  
  // Go to demo result page to see the chart
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=GreenFuture&primary=%2316A34A');
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ path: 'test-results/chart-full-page.png', fullPage: true });
  console.log('📸 Full page screenshot saved');
  
  // Take focused screenshot of just the chart area
  const chartSection = await page.locator('text=Your Solar Savings Over Time').first();
  await chartSection.scrollIntoViewIfNeeded();
  
  await page.screenshot({ path: 'test-results/chart-area-focused.png' });
  console.log('📸 Chart area screenshot saved');
  
  console.log('✅ Screenshots complete! Check test-results/ folder');
});
