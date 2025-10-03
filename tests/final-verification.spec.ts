import { test, expect } from '@playwright/test';

test.describe('Final Changes Verification', () => {
  test('Verify all requested changes on live site', async ({ page }) => {
    console.log('Testing all requested changes...');
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check that "10 clients → $300/mo recurring + $1200 setup" is grey
    const earningsText = page.locator('text=Earnings (example)').locator('..').locator('p').first();
    await expect(earningsText).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check that support@getsunspire.com is grey
    const supportEmail = page.locator('a:has-text("support@getsunspire.com")');
    await expect(supportEmail).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
    
    // Check that "View Documentation" is grey
    const viewDoc = page.locator('a:has-text("View Documentation")');
    await expect(viewDoc).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
    
    // Check that "All systems operational" is grey
    const systemStatus = page.locator('text=All systems operational');
    await expect(systemStatus).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check that "What You Get" header is company colored
    const whatYouGetHeader = page.locator('h2:has-text("What You Get")');
    await expect(whatYouGetHeader).toHaveCSS('color', 'rgb(0, 113, 227)'); // Apple blue
    
    // Check that "Why Installers Switch" header is company colored
    const whySwitchHeader = page.locator('h2:has-text("Why Installers Switch")');
    await expect(whySwitchHeader).toHaveCSS('color', 'rgb(0, 113, 227)'); // Apple blue
    
    // Check that highlighted words in features are grey
    const brandedText = page.locator('text=Branded').first();
    await expect(brandedText).toHaveCSS('color', 'rgb(107, 114, 128)'); // gray-500
    
    // Test Report Page - Sticky CTA
    await page.goto('https://sunspire-web-app.vercel.app/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check that sticky CTA is visible and has proper height
    const stickyCTA = page.locator('[data-sticky-cta-desktop]');
    await expect(stickyCTA).toBeVisible();
    
    const stickyButton = stickyCTA.locator('a').first();
    await expect(stickyButton).toHaveCSS('min-height', '50px');
    
    console.log('✓ All changes verified successfully!');
  });
});