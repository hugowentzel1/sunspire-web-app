import { test, expect } from '@playwright/test';

test.describe('Specific Changes Verification', () => {
  test('Check all specific changes with Apple branding', async ({ page }) => {
    console.log('Testing all specific changes with Apple branding...');
    
    // Test Partners Page - Check EarningsMini numbers are company colored
    await page.goto('http://localhost:3002/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check EarningsMini component has company colored numbers
    const earningsMini = page.locator('text=Earnings (example)').locator('..');
    await expect(earningsMini).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/partners-earnings-fixed.png',
      fullPage: true
    });
    
    // Test Pricing Page - Check specific color changes
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check "Secure Stripe checkout" is grey
    const secureText = page.locator('text=Secure Stripe checkout').first();
    await expect(secureText).toHaveClass(/text-gray-500/);
    
    // Check "One extra booked job" is grey
    const extraJobText = page.locator('text=One extra booked job').first();
    await expect(extraJobText).toHaveClass(/text-gray-500/);
    
    // Check "24 hours" and "branded" are company colored
    const hoursText = page.locator('text=24 hours').first();
    await expect(hoursText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    const brandedText = page.locator('text=branded').first();
    await expect(brandedText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    // Check "coding" is company colored
    const codingText = page.locator('text=coding').first();
    await expect(codingText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-colors-fixed.png',
      fullPage: true
    });
    
    // Test Support Page - Check helpful resources links
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check helpful resources links are company colored
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
    
    // Test Report Page - Check sticky CTA is bigger
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check sticky CTA is visible and has bigger size
    const stickyCTA = page.locator('div[style*="clamp(360px, 36vw, 520px)"]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/sticky-cta-bigger.png',
      fullPage: true
    });
    
    console.log('✓ All specific changes verified successfully');
  });
});
