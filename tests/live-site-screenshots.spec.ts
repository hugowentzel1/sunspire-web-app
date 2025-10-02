import { test, expect } from '@playwright/test';

test.describe('Live Site Screenshots', () => {
  test('Capture live home page screenshot', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-home-page.png',
      fullPage: true 
    });
    
    console.log('✅ Live home page screenshot saved as live-home-page.png');
  });

  test('Capture live report page screenshot', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'live-report-page-netflix.png',
      fullPage: true 
    });
    
    console.log('✅ Live report page screenshot saved as live-report-page-netflix.png');
  });
});
