import { test, expect } from '@playwright/test';

test.describe('Live Site Verification - Final Implementation', () => {
  test('Live Home page - Show optimized testimonials without heading', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
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
      path: 'test-results/live-home-final-testimonials.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Live Home page final testimonials screenshot saved');
  });

  test('Live Mobile view - Show mobile optimizations', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take screenshot of mobile view
    await page.screenshot({ 
      path: 'test-results/live-mobile-final-home.png',
      fullPage: true
    });
    
    console.log('✓ Live Mobile final view screenshot saved');
  });

  test('Live Pricing page - Show optimized testimonial', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of optimized testimonial
    const testimonial = page.locator('p:has-text("Cut quoting time from 15 min to 1 min — we now respond faster than local competitors")');
    await expect(testimonial).toBeVisible();
    
    // Scroll to testimonial
    await testimonial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/live-pricing-final-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Live Pricing page final testimonial screenshot saved');
  });

  test('Live Partners page - Show optimized testimonial', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of optimized testimonial
    const testimonial = page.locator('p:has-text("Partnered with Sunspire 6 months ago. Already earned $2,400 in recurring revenue from just 8 clients — homeowners instantly trusted our estimates")');
    await expect(testimonial).toBeVisible();
    
    // Scroll to testimonial
    await testimonial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/live-partners-final-testimonial.png',
      fullPage: false,
      clip: await testimonial.boundingBox()
    });
    
    console.log('✓ Live Partners page final testimonial screenshot saved');
  });

  test('Live Mobile testimonials - Show responsive layout', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
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
      path: 'test-results/live-mobile-final-testimonials.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Live Mobile final testimonials layout screenshot saved');
  });
});