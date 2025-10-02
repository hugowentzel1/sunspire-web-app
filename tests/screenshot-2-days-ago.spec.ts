import { test, expect } from '@playwright/test';

test.describe('Screenshots from 2 days ago', () => {
  test('Capture home page screenshot from 2 days ago', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'home-page-2-days-ago.png',
      fullPage: true 
    });
    
    console.log('✅ Home page screenshot saved as home-page-2-days-ago.png');
  });

  test('Capture report page screenshot from 2 days ago', async ({ page }) => {
    await page.goto('http://localhost:3003/report?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'report-page-2-days-ago.png',
      fullPage: true 
    });
    
    console.log('✅ Report page screenshot saved as report-page-2-days-ago.png');
  });
});
