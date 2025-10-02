import { test, expect } from '@playwright/test';

test.describe('Test Launch Button', () => {
  test('Test launch button navigation', async ({ page }) => {
    console.log('🌐 Testing launch button on LIVE site...');
    
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
    await page.waitForTimeout(2000);
    
    // Find and click launch button
    const launchButton = page.locator('button').filter({ hasText: 'Launch on Netflix' });
    await expect(launchButton).toBeVisible();
    console.log('✅ Launch button visible');
    
    // Click launch button
    await launchButton.click();
    console.log('✅ Clicked launch button');
    
    // Wait for navigation
    await page.waitForTimeout(5000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page');
      
      // Check demo banner
      const demoBanner = page.locator('[data-testid="demo-banner"]');
      const bannerText = await demoBanner.textContent();
      console.log(`Demo banner: ${bannerText}`);
      
      // Check sidebar CTA
      const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
      const sidebarVisible = await sidebarCta.isVisible();
      console.log(`Sidebar CTA visible: ${sidebarVisible}`);
      
      // Check bottom CTA
      const bottomCta = page.locator('button').filter({ hasText: 'Activate on Your Domain' });
      const bottomCtaVisible = await bottomCta.isVisible();
      console.log(`Bottom CTA visible: ${bottomCtaVisible}`);
      
    } else {
      console.log('❌ Did not navigate to report page');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-launch-button.png' });
    console.log('📸 Screenshot saved: test-launch-button.png');
  });
});
