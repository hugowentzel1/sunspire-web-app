import { test, expect } from '@playwright/test';

test.describe('Partners Page Specific Check', () => {
  test('Check partners page earnings text specifically', async ({ page }) => {
    console.log('Checking partners page earnings text...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Try different selectors for the earnings text
    const selectors = [
      'h3:has-text("Earnings (example)")',
      'text=Earnings (example)',
      '[data-testid="earnings"]',
      '.earnings',
      'h3',
      'p'
    ];
    
    for (const selector of selectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      console.log(`Selector "${selector}": ${count} elements found`);
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);
          const text = await element.textContent();
          const color = await element.evaluate((el) => getComputedStyle(el).color);
          console.log(`  Element ${i}: "${text?.substring(0, 50)}..." - Color: ${color}`);
        }
      }
    }
    
    // Take a screenshot to see what's there
    await page.screenshot({
      path: 'test-results/partners-detailed.png',
      fullPage: true
    });
    
    console.log('✓ Partners page inspection complete');
  });
});
