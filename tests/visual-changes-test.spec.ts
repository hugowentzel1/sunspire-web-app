import { test, expect } from '@playwright/test';

test.describe('Visual Changes - Testimonials and Mobile Optimizations', () => {
  test('Home page - Show unified testimonials', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of testimonials section
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/home-testimonials.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Home page testimonials screenshot saved');
  });

  test('Pricing page - Show unified testimonials', async ({ page }) => {
    await page.goto('http://localhost:3003/pricing?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of testimonials section
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/pricing-testimonials.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Pricing page testimonials screenshot saved');
  });

  test('Partners page - Show unified testimonials', async ({ page }) => {
    await page.goto('http://localhost:3003/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of testimonials section
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/partners-testimonials.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Partners page testimonials screenshot saved');
  });

  test('Report page - Show unified testimonials', async ({ page }) => {
    await page.goto('http://localhost:3003/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of testimonials section
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Scroll to testimonials
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/report-testimonials.png',
      fullPage: false,
      clip: await testimonialsSection.boundingBox()
    });
    
    console.log('✓ Report page testimonials screenshot saved');
  });

  test('Support page - Show NO testimonials (correctly)', async ({ page }) => {
    await page.goto('http://localhost:3003/support?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section does NOT exist
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toHaveCount(0);
    
    // Take full page screenshot to show no testimonials
    await page.screenshot({ 
      path: 'test-results/support-no-testimonials.png',
      fullPage: true
    });
    
    console.log('✓ Support page (no testimonials) screenshot saved');
  });

  test('Mobile view - Show mobile optimizations', async ({ page }) => {
    await page.goto('http://localhost:3003/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take screenshot of mobile view
    await page.screenshot({ 
      path: 'test-results/mobile-home.png',
      fullPage: true
    });
    
    console.log('✓ Mobile view screenshot saved');
  });

  test('StickyCTA shimmer effect', async ({ page }) => {
    await page.goto('http://localhost:3003/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find the sticky CTA
    const stickyCTA = page.locator('[data-testid="sticky-cta"]');
    await expect(stickyCTA).toBeVisible();
    
    // Take screenshot before hover
    await page.screenshot({ 
      path: 'test-results/sticky-cta-before-hover.png',
      fullPage: false,
      clip: await stickyCTA.boundingBox()
    });
    
    // Hover over the CTA to trigger shimmer
    await stickyCTA.hover();
    await page.waitForTimeout(500);
    
    // Take screenshot after hover
    await page.screenshot({ 
      path: 'test-results/sticky-cta-after-hover.png',
      fullPage: false,
      clip: await stickyCTA.boundingBox()
    });
    
    console.log('✓ StickyCTA shimmer effect screenshots saved');
  });
});
