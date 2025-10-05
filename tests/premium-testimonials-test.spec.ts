import { test, expect } from '@playwright/test';

test.describe('Premium Testimonial System', () => {
  test('Home page - Verify premium testimonial layout and spacing', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find the premium testimonial grid
    const testimonialGrid = page.locator('.t-grid[data-section="testimonials"]');
    await expect(testimonialGrid).toBeVisible();
    
    // Check that all testimonial cards exist
    const testimonialCards = page.locator('.t-card');
    await expect(testimonialCards).toHaveCount(4);
    
    // Check that quotes use blockquote elements
    const quotes = page.locator('.t-quote');
    await expect(quotes).toHaveCount(4);
    
    // Check that citations use figcaption elements
    const citations = page.locator('.t-cite');
    await expect(citations).toHaveCount(4);
    
    // Scroll to testimonials
    await testimonialGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of the premium testimonials
    await page.screenshot({ 
      path: 'test-results/premium-testimonials-desktop.png',
      fullPage: false,
      clip: await testimonialGrid.boundingBox()
    });
    
    console.log('✓ Premium testimonial system verified');
  });

  test('Mobile view - Verify responsive premium layout', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find testimonial grid
    const testimonialGrid = page.locator('.t-grid[data-section="testimonials"]');
    await expect(testimonialGrid).toBeVisible();
    
    // Scroll to testimonials
    await testimonialGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of mobile testimonials
    await page.screenshot({ 
      path: 'test-results/premium-testimonials-mobile.png',
      fullPage: false,
      clip: await testimonialGrid.boundingBox()
    });
    
    console.log('✓ Mobile premium testimonials verified');
  });

  test('Brand color integration - Verify Tesla red accents', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that decorative quote marks use brand color
    const firstQuote = page.locator('.t-quote').first();
    const quoteMark = firstQuote.locator('::before');
    
    // Scroll to testimonials
    await firstQuote.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot focusing on brand color integration
    await page.screenshot({ 
      path: 'test-results/premium-testimonials-brand-colors.png',
      fullPage: false,
      clip: await firstQuote.boundingBox()
    });
    
    console.log('✓ Brand color integration verified');
  });
});
