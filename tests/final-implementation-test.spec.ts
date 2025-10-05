import { test, expect } from '@playwright/test';

test.describe('Complete Implementation - Visual Verification', () => {
  test('Home page - Show optimized testimonials without heading', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials exist but no heading
    const testimonialsGrid = page.locator('div.grid.grid-cols-1.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-4');
    await expect(testimonialsGrid).toBeVisible();
    
    // Check that there's no "Trusted by 100+ installers" heading
    const heading = page.locator('h2:has-text("Trusted by 100+ installers and growing")');
    await expect(heading).toHaveCount(0);
    
    // Scroll to testimonials
    await testimonialsGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/home-final-testimonials.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Home page final testimonials screenshot saved');
  });

  test('Mobile view - Show mobile optimizations', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take screenshot of mobile view
    await page.screenshot({ 
      path: 'test-results/mobile-final-home.png',
      fullPage: true
    });
    
    console.log('✓ Mobile final view screenshot saved');
  });

  test('Smart Sticky CTA - Check behavior', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that sticky CTA exists but is hidden initially
    const stickyCTA = page.locator('#stickyCta');
    await expect(stickyCTA).toHaveCount(1);
    
    // Initially should not be visible (no sticky-cta--visible class)
    await expect(stickyCTA).not.toHaveClass(/sticky-cta--visible/);
    
    // Scroll down to trigger sticky CTA
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    // Now should be visible
    await expect(stickyCTA).toHaveClass(/sticky-cta--visible/);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/smart-sticky-cta.png',
      fullPage: false,
      clip: await stickyCTA.boundingBox()
    });
    
    console.log('✓ Smart sticky CTA behavior verified');
  });

  test('Pricing page - Show optimized testimonial', async ({ page }) => {
    await page.goto('http://localhost:3003/pricing?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of optimized testimonial
    const testimonial = page.locator('p:has-text("Cut quoting time from 15 min to 1 min — we now respond faster than local competitors")');
    await expect(testimonial).toBeVisible();
    
    // Scroll to testimonial
    await testimonial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/pricing-final-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Pricing page final testimonial screenshot saved');
  });

  test('Partners page - Show optimized testimonial', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of optimized testimonial
    const testimonial = page.locator('p:has-text("Partnered with Sunspire 6 months ago. Already earned $2,400 in recurring revenue from just 8 clients — homeowners instantly trusted our estimates")');
    await expect(testimonial).toBeVisible();
    
    // Scroll to testimonial
    await testimonial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/partners-final-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Partners page final testimonial screenshot saved');
  });

  test('Mobile testimonials - Show responsive layout', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find testimonials section
    const testimonialsGrid = page.locator('div.grid.grid-cols-1.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-4');
    await expect(testimonialsGrid).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of mobile testimonials
    await page.screenshot({ 
      path: 'test-results/mobile-final-testimonials.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Mobile final testimonials layout screenshot saved');
  });
});
