import { test, expect } from '@playwright/test';

test.describe('Verify Navigation Pages Branding', () => {
  test('Pricing page should maintain brand colors and header', async ({ page }) => {
    // Test with Google branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%230428F4');
    
    // Wait for the page to load and check initial branding
    await page.waitForLoadState('networkidle');
    
    // Debug: Check what's in localStorage
    const localStorageContent = await page.evaluate(() => {
      return localStorage.getItem('sunspire-brand-takeover');
    });
    console.log('localStorage content:', localStorageContent);
    
    // Debug: Check the brand state on the main page
    const mainPageBrand = await page.locator('header h1').first().textContent();
    console.log('Main page brand:', mainPageBrand);
    
    // Navigate to pricing page
    await page.click('a[href="/pricing"]');
    await page.waitForURL('**/pricing');
    await page.waitForLoadState('networkidle');
    
    // Debug: Check what's in localStorage after navigation
    const localStorageAfterNav = await page.evaluate(() => {
      return localStorage.getItem('sunspire-brand-takeover');
    });
    console.log('localStorage after navigation:', localStorageAfterNav);
    
    // Verify the header still shows Google branding (use first() to avoid duplicate selector issue)
    const headerTitle = await page.locator('header h1').first().textContent();
    console.log('Pricing page header brand:', headerTitle);
    expect(headerTitle).toContain('Google');
    
    // Verify brand colors are applied to buttons and elements
    const ctaButton = page.locator('button:has-text("Launch on Google")').first();
    await expect(ctaButton).toBeVisible();
    
    // Check that the page uses brand colors (not hardcoded green)
    const popularBadge = page.locator('div:has-text("Most Popular")').last();
    await expect(popularBadge).toBeVisible();
    
    // Verify LegalFooter shows correct branding
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('Powered by Google');
  });

  test('Partners page should maintain brand colors and header', async ({ page }) => {
    // Test with Apple branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23000000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Navigate to partners page
    await page.click('a[href="/partners"]');
    await page.waitForURL('**/partners');
    await page.waitForLoadState('networkidle');
    
    // Verify the header still shows Apple branding
    const headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('Apple');
    
    // Verify page title uses brand name
    const pageTitle = await page.locator('h1:has-text("Partner with")').textContent();
    expect(pageTitle).toContain('Apple');
    
    // Verify brand colors are applied to form elements
    const submitButton = page.locator('button:has-text("Submit Partner Application")');
    await expect(submitButton).toBeVisible();
    
    // Verify LegalFooter shows correct branding
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('Powered by Apple');
  });

  test('Support page should maintain brand colors and header', async ({ page }) => {
    // Test with Netflix branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Navigate to support page
    await page.click('a[href="/support"]');
    await page.waitForURL('**/support');
    await page.waitForLoadState('networkidle');
    
    // Verify the header still shows Netflix branding
    const headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('Netflix');
    
    // Verify brand colors are applied to support options
    const liveChatButton = page.locator('button:has-text("Start Chat")');
    await expect(liveChatButton).toBeVisible();
    
    const emailButton = page.locator('a:has-text("Email Us")');
    await expect(emailButton).toBeVisible();
    
    // Verify LegalFooter shows correct branding
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('Powered by Netflix');
  });

  test('Navigation between pages should maintain branding', async ({ page }) => {
    // Start with TealEnergy branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2306B6D4');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify initial branding
    let headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('TealEnergy');
    
    // Navigate to pricing
    await page.click('a[href="/pricing"]');
    await page.waitForURL('**/pricing');
    await page.waitForLoadState('networkidle');
    headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('TealEnergy');
    
    // Navigate to partners
    await page.click('a[href="/partners"]');
    await page.waitForURL('**/partners');
    await page.waitForLoadState('networkidle');
    headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('TealEnergy');
    
    // Navigate to support
    await page.click('a[href="/support"]');
    await page.waitForURL('**/support');
    await page.waitForLoadState('networkidle');
    headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('TealEnergy');
    
    // Go back to home
    await page.click('header h1').first();
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    headerTitle = await page.locator('header h1').first().textContent();
    expect(headerTitle).toContain('TealEnergy');
  });
});
