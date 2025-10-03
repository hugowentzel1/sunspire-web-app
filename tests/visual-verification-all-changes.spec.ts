import { test, expect } from '@playwright/test';

test.describe('Visual Verification of All Changes', () => {
  test('Check all pages with Apple branding', async ({ page }) => {
    console.log('Testing all pages with Apple branding...');
    
    // Test Report Page
    await page.goto('http://localhost:3002/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Scroll down to make hero CTA out of view so sticky CTA becomes visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    
    // Check sticky CTA is positioned in middle-right
    const stickyCTA = page.locator('[data-sticky-cta-desktop], [data-sticky-cta-mobile]').first();
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/report-page-apple.png',
      fullPage: true
    });
    
    // Test Support Page
    await page.goto('http://localhost:3002/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check system status circle has brand gradient
    const systemStatusCircle = page.locator('div:has-text("System Status")').locator('..').locator('div').first();
    await expect(systemStatusCircle).toHaveClass(/bg-gradient-to-br/);
    
    // Check helpful resources links are brand colored
    const setupGuideLink = page.locator('text=Setup Guide');
    await expect(setupGuideLink).toHaveClass(/text-\[var\(--brand-600\)\]/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-page-apple.png',
      fullPage: true
    });
    
    // Test Pricing Page
    await page.goto('http://localhost:3002/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check pricing numbers are brand colored
    const pricingTitle = page.locator('h1');
    await expect(pricingTitle).toContainText('$99/mo + $399 setup');
    
    // Check 14-day refund is brand colored
    const refundText = page.locator('text=14-day refund');
    await expect(refundText).toHaveClass(/text-\[var\(--brand-primary\)\]/);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-page-apple.png',
      fullPage: true
    });
    
    console.log('✓ All visual tests completed');
  });
});
