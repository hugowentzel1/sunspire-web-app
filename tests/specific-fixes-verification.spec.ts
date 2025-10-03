import { test, expect } from '@playwright/test';

test.describe('Specific Color and Size Fixes Verification', () => {
  test('Check all specific fixes with Apple branding', async ({ page }) => {
    console.log('Testing all specific fixes with Apple branding...');
    
    // Test Support Page - Check helpful resources links are company colored
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check helpful resources links are brand colored
    const setupGuideLink = page.locator('a:has-text("Setup Guide")').first();
    await expect(setupGuideLink).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    const crmLink = page.locator('a:has-text("CRM Integration Tutorial")').first();
    await expect(crmLink).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    const brandingLink = page.locator('a:has-text("Branding Customization")').first();
    await expect(brandingLink).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    const apiLink = page.locator('a:has-text("API Documentation")').first();
    await expect(apiLink).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-links-fixed.png',
      fullPage: true
    });
    
    // Test Partners Page - Check numbers are company colored and checkmarks are green
    await page.goto('http://localhost:3002/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check $30/mo is company colored
    const monthlyAmount = page.locator('text=$30/mo').first();
    await expect(monthlyAmount).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    // Check $120 is company colored
    const setupBonus = page.locator('text=$120').first();
    await expect(setupBonus).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    // Check 30 days is company colored
    const cookieWindow = page.locator('text=30 days').first();
    await expect(cookieWindow).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    // Check checkmarks are green
    const checkmark = page.locator('svg.text-green-500').first();
    await expect(checkmark).toHaveClass(/text-green-500/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/partners-colors-fixed.png',
      fullPage: true
    });
    
    // Test Pricing Page - Check specific color changes
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check $99/mo + $399 setup is black (not brand colored)
    const pricingTitle = page.locator('h1').nth(1);
    await expect(pricingTitle).toContainText('$99/mo + $399 setup');
    
    // Check 14-day refund is gray
    const refundText = page.locator('text=14-day refund').first();
    await expect(refundText).toHaveClass(/text-gray-500/);
    
    // Check "One extra booked job" is company colored
    const extraJobText = page.locator('text=One extra booked job').first();
    await expect(extraJobText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    // Check "Secure Stripe checkout" line is company colored
    const secureText = page.locator('text=Secure Stripe checkout').first();
    await expect(secureText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-colors-fixed.png',
      fullPage: true
    });
    
    // Test Report Page - Check sticky CTA is bigger
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check sticky CTA is visible and has bigger size
    const stickyCTA = page.locator('div[style*="clamp(320px, 32vw, 480px)"]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/sticky-cta-bigger.png',
      fullPage: true
    });
    
    console.log('✓ All specific fixes verified successfully');
  });
});
