import { test, expect } from '@playwright/test';

test.describe('Test Live Address Navigation', () => {
  test('Test address autocomplete navigation on live site', async ({ page }) => {
    console.log('🌐 Testing address autocomplete navigation on LIVE site...');
    
    // Go to live demo site
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find address input and type address
    const addressInput = page.locator('input[placeholder*="address"]');
    await addressInput.fill('123 Main St San Francisco CA');
    await page.waitForTimeout(2000);
    
    // Click first autocomplete suggestion
    const autocomplete = page.locator('[data-autosuggest]');
    const suggestions = autocomplete.locator('div');
    await suggestions.first().click();
    console.log('✅ Clicked first suggestion');
    
    // Wait for form to update
    await page.waitForTimeout(3000);
    
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
    
    // Check current URL to see if we navigated
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page!');
      
      // Check demo banner
      const demoBanner = page.locator('[data-testid="demo-banner"]');
      const bannerText = await demoBanner.textContent();
      console.log(`Demo banner: ${bannerText}`);
      
      // Check sidebar CTA
      const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
      const sidebarVisible = await sidebarCta.isVisible();
      console.log(`Sidebar CTA visible: ${sidebarVisible}`);
      
    } else {
      console.log('❌ Did not navigate to report page');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-live-navigation.png' });
    console.log('📸 Screenshot saved: test-live-navigation.png');
  });
});
