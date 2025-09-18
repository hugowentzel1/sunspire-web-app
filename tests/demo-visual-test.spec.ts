import { test, expect } from '@playwright/test';

test.describe('Demo Version Visual Verification', () => {
  test('Demo version should show Apple logo in hero section', async ({ page }) => {
    // Navigate to demo version with Apple company
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page shows demo content
    await expect(page.locator('text=Demo for Apple — Powered by Sunspire')).toBeVisible();
    
    // Check if the hero section shows the Apple logo (HeroBrand component)
    // The hero section should contain the company logo, not the sun icon
    const heroSection = page.locator('[data-paid-hero]').first();
    await expect(heroSection).toBeVisible();
    
    // Check if there's a logo image in the hero section
    const logoImage = page.locator('img[src*="logo.clearbit.com"]').first();
    await expect(logoImage).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'demo-apple-logo.png', fullPage: true });
  });

  test('Demo version should have correct URL parameter preservation', async ({ page }) => {
    // Navigate to demo version
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click on pricing link
    await page.click('text=Pricing');
    
    // Check that URL parameters are preserved
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    
    // Check that demo banner is still visible on pricing page
    await expect(page.locator('h2:has-text("Demo for Apple — Powered by Sunspire")')).toBeVisible();
    
    // Click back to home
    await page.click('text=Back to Home');
    
    // Check that we're back on the home page with correct URL
    expect(page.url()).toContain('company=Apple');
    expect(page.url()).toContain('demo=1');
    expect(page.url()).toMatch(/^https:\/\/sunspire-web-app\.vercel\.app\/\?/);
  });

  test('Demo version should show correct footer', async ({ page }) => {
    // Navigate to demo version
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that footer shows marketing links (not hidden for demo)
    await expect(page.locator('footer a:has-text("Pricing")')).toBeVisible();
    await expect(page.locator('footer a:has-text("Partners")')).toBeVisible();
    await expect(page.locator('footer a:has-text("Support")')).toBeVisible();
    
    // Check that footer shows "Powered by Sunspire"
    await expect(page.locator('text=Powered by Sunspire')).toBeVisible();
  });
});
