import { test, expect } from '@playwright/test';

test.describe('Debug Navigation Issue', () => {
  test('should debug navigation elements', async ({ page }) => {
    console.log('🔍 Debugging navigation elements...');
    
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenSolar&primary=%2316A34A');
    await page.waitForLoadState('networkidle');
    
    // Count all elements with "Pricing" text
    const pricingElements = page.locator('text=Pricing');
    const count = await pricingElements.count();
    console.log(`📊 Found ${count} elements with "Pricing" text`);
    
    // Log details of each element
    for (let i = 0; i < count; i++) {
      const element = pricingElements.nth(i);
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.evaluate(el => el.className);
      const href = await element.evaluate(el => el.getAttribute('href'));
      console.log(`  Element ${i + 1}: <${tagName}> class="${className}" href="${href}"`);
    }
    
    // Check if there are multiple nav elements
    const navElements = page.locator('nav');
    const navCount = await navElements.count();
    console.log(`📊 Found ${navCount} nav elements`);
    
    // Check if there are multiple headers
    const headerElements = page.locator('header');
    const headerCount = await headerElements.count();
    console.log(`📊 Found ${headerCount} header elements`);
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'debug-navigation.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-navigation.png');
  });
});
