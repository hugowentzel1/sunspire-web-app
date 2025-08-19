import { test, expect } from '@playwright/test';

test.describe('Debug Brand Takeover', () => {
  test('debug why brand takeover is not working', async ({ page }) => {
    console.log('🔍 Testing brand takeover for Google...');
    
    // Listen to console logs
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(msg.text());
      console.log('Console:', msg.text());
    });
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any async operations
    await page.waitForTimeout(3000);
    
    // Check what text is actually displayed
    const pageTitle = await page.locator('h1').first().textContent();
    const builtForText = await page.locator('h2').filter({ hasText: 'Built for' }).first().textContent();
    const buttonText = await page.locator('button').filter({ hasText: /Generate|Launch/ }).first().textContent();
    
    console.log('🔍 Actual Page Content:');
    console.log('  Page Title:', pageTitle);
    console.log('  Built for:', builtForText);
    console.log('  Button Text:', buttonText);
    
    // Check if the brand takeover is enabled
    const isBrandEnabled = await page.evaluate(() => {
      // Check if any element contains "Google" instead of "Sunspire"
      const hasGoogle = document.body.textContent?.includes('Google');
      const hasSunspire = document.body.textContent?.includes('Sunspire');
      return { hasGoogle, hasSunspire };
    });
    
    console.log('🔍 Brand Detection:');
    console.log('  Has Google:', isBrandEnabled.hasGoogle);
    console.log('  Has Sunspire:', isBrandEnabled.hasSunspire);
    
    // Check console logs
    console.log('🔍 Console Logs:');
    logs.forEach(log => console.log('  ', log));
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/debug-brand-takeover.png',
      fullPage: true 
    });
    
    console.log('📸 Debug screenshot saved');
  });
});
