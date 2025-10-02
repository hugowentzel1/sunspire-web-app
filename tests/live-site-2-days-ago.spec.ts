import { test, expect } from '@playwright/test';

test.describe('Live Site Screenshots from 2 Days Ago', () => {
  test('Capture home page as it was 2 days ago', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-home-page-2-days-ago.png',
      fullPage: true 
    });
    
    console.log('✅ Live home page screenshot (2 days ago state) saved as live-home-page-2-days-ago.png');
  });

  test('Capture report page as it was 2 days ago', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-report-page-2-days-ago.png',
      fullPage: true 
    });
    
    console.log('✅ Live report page screenshot (2 days ago state) saved as live-report-page-2-days-ago.png');
  });
});
