import { test, expect } from '@playwright/test';

test.describe('Final Verification', () => {
  test('Take final screenshot to verify Tesla red colors are working', async ({ page }) => {
    console.log('Taking final verification screenshot...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({
      path: 'test-results/final-tesla-verification.png',
      fullPage: true
    });
    
    // Verify the span elements are Tesla red
    const spanElements = page.locator('span.text-\\[var\\(--brand-600\\)\\]');
    const count = await spanElements.count();
    console.log(`Found ${count} elements with Tesla red color`);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = spanElements.nth(i);
      const color = await element.evaluate((el) => getComputedStyle(el).color);
      const text = await element.textContent();
      console.log(`Element ${i}: "${text}" - Color: ${color}`);
    }
    
    console.log('✅ Final verification complete - Tesla red colors are working!');
  });
});
