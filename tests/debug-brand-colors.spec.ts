import { test, expect } from '@playwright/test';

test.describe('Debug Brand Colors', () => {
  test('debug brand color injection', async ({ page }) => {
    // Listen to console logs
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('BrandProvider')) {
        logs.push(msg.text());
        console.log('Console:', msg.text());
      }
    });
    
    console.log('🔍 Testing brand color injection for Google...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for any async operations
    await page.waitForTimeout(2000);
    
    // Check what CSS variables are actually set
    const brandPrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
    });
    
    const brand = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand');
    });
    
    console.log('🔍 CSS Variables:');
    console.log('  --brand-primary:', brandPrimary);
    console.log('  --brand:', brand);
    
    // Check if the BrandProvider is actually running
    console.log('🔍 Console Logs:');
    logs.forEach(log => console.log('  ', log));
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/debug-brand-colors.png',
      fullPage: false 
    });
    
    console.log('📸 Debug screenshot saved');
  });
});
