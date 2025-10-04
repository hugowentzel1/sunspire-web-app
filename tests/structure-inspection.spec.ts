import { test, expect } from '@playwright/test';

test.describe('Page Structure Inspection', () => {
  test('Check what elements actually exist on the pages', async ({ page }) => {
    console.log('Inspecting page structure...');
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Get all text content to see what's actually there
    const partnersText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('Partners page contains:', partnersText.includes('Earnings') ? 'Earnings section found' : 'No Earnings section');
    console.log('Partners page contains:', partnersText.includes('clients') ? 'clients text found' : 'No clients text');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/partners-structure.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    const supportText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('Support page contains:', supportText.includes('Setup Guide') ? 'Setup Guide found' : 'No Setup Guide');
    console.log('Support page contains:', supportText.includes('Helpful Resources') ? 'Helpful Resources found' : 'No Helpful Resources');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-structure.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    const pricingText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('Pricing page contains:', pricingText.includes('Go live in under') ? 'Hero text found' : 'No hero text');
    console.log('Pricing page contains:', pricingText.includes('24 hours') ? '24 hours text found' : 'No 24 hours text');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-structure.png',
      fullPage: true
    });
    
    console.log('✓ Structure inspection complete');
  });
});
