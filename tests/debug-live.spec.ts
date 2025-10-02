import { test, expect } from '@playwright/test';

test.describe('Debug Live Site', () => {
  test('Debug live site structure', async ({ page }) => {
    console.log('🌐 Debugging LIVE site...');
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check all buttons on the page
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Total buttons found: ${buttonCount}`);
    
    for (let i = 0; i < buttonCount; i++) {
      const button = allButtons.nth(i);
      const text = await button.textContent();
      const dataCta = await button.getAttribute('data-cta-button');
      console.log(`Button ${i}: "${text}" (data-cta-button: ${dataCta})`);
    }
    
    // Check for any elements with data-cta-button
    const ctaButtons = page.locator('[data-cta-button]');
    const ctaCount = await ctaButtons.count();
    console.log(`CTA buttons found: ${ctaCount}`);
    
    for (let i = 0; i < ctaCount; i++) {
      const button = ctaButtons.nth(i);
      const text = await button.textContent();
      console.log(`CTA Button ${i}: "${text}"`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-live.png' });
    console.log('📸 Screenshot saved: debug-live.png');
  });
});
