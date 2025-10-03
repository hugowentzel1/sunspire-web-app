import { test, expect } from '@playwright/test';

test.describe('Simple Live Site Check', () => {
  test('Check if live site is working', async ({ page }) => {
    console.log('Testing live site availability...');
    
    // Test home page first
    await page.goto('https://sunspire-web-app.vercel.app/?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot to see what's happening
    await page.screenshot({
      path: 'test-results/live-home-page.png',
      fullPage: true
    });
    
    // Check if we can navigate to report page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Spotify&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/live-report-page-check.png',
      fullPage: true
    });
    
    console.log('✓ Live site check completed');
  });
});
