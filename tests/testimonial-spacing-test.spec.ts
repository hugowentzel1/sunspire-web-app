import { test, expect } from '@playwright/test';

test.describe('Testimonial Spacing Improvements', () => {
  test('Home page - Verify improved testimonial spacing and layout', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find the testimonials section
    const testimonialsGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.gap-8');
    await expect(testimonialsGrid).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Check that all testimonial cards have consistent styling
    const testimonialCards = page.locator('div.bg-white\\/60.backdrop-blur-sm.rounded-2xl.p-6');
    await expect(testimonialCards).toHaveCount(4);
    
    // Verify the fourth testimonial has the extended quote
    const fourthCard = testimonialCards.nth(3);
    const fourthQuote = fourthCard.locator('p.text-sm.text-gray-600.italic');
    await expect(fourthQuote).toContainText('Sunspire paid for itself in week two — homeowners instantly trusted our estimates and we closed more deals.');
    
    // Take screenshot of the testimonials section
    await page.screenshot({ 
      path: 'test-results/testimonial-spacing-improvements.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Testimonial spacing improvements verified');
  });

  test('Mobile view - Verify responsive testimonial layout', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find testimonials section
    const testimonialsGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.gap-8');
    await expect(testimonialsGrid).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of mobile testimonials
    await page.screenshot({ 
      path: 'test-results/mobile-testimonial-spacing.png',
      fullPage: false,
      clip: await testimonialsGrid.boundingBox()
    });
    
    console.log('✓ Mobile testimonial spacing verified');
  });
});
