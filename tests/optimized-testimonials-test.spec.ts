import { test, expect } from '@playwright/test';

test.describe('Optimized Testimonials - Visual Verification', () => {
  test('Home page - Show optimized testimonials', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of optimized testimonials section - use more specific selector
    const testimonialsSection = page.locator('h2:has-text("Trusted by 100+ installers and growing")').locator('..');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/home-optimized-testimonials.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Home page optimized testimonials screenshot saved');
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
      path: 'test-results/pricing-optimized-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Pricing page optimized testimonial screenshot saved');
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
      path: 'test-results/partners-optimized-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Partners page optimized testimonial screenshot saved');
  });

  test('Mobile view - Show mobile optimizations', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take screenshot of mobile view
    await page.screenshot({ 
      path: 'test-results/mobile-optimized-home.png',
      fullPage: true
    });
    
    console.log('✓ Mobile optimized view screenshot saved');
  });

  test('Mobile testimonials - Show responsive layout', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find testimonials section - use more specific selector
    const testimonialsSection = page.locator('h2:has-text("Trusted by 100+ installers and growing")').locator('..');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of mobile testimonials
    await page.screenshot({ 
      path: 'test-results/mobile-testimonials-layout.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Mobile testimonials layout screenshot saved');
  });
});
