import { test, expect } from '@playwright/test';

test.describe('Mobile Site - Keep Open', () => {
  test('Keep Mobile Demo Homepage Open', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    await page.goto('http://localhost:3002/?demo=1&company=Netflix&brandColor=%23E50914');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('📱 Mobile Demo Homepage is now open in Chromium');
    console.log('🔗 URL: http://localhost:3002/?demo=1&company=Netflix&brandColor=%23E50914');
    console.log('⏳ Keeping browser open for 60 seconds...');
    
    // Keep browser open for 60 seconds
    await page.waitForTimeout(60000);
    
    await context.close();
  });
  
  test('Keep Mobile Paid Homepage Open', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    await page.goto('http://localhost:3002/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('📱 Mobile Paid Homepage is now open in Chromium');
    console.log('🔗 URL: http://localhost:3002/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    console.log('⏳ Keeping browser open for 60 seconds...');
    
    // Keep browser open for 60 seconds
    await page.waitForTimeout(60000);
    
    await context.close();
  });
});
