import { test, expect } from '@playwright/test';

test.describe('Mobile Optimizations and Testimonials', () => {
  test('Home page has unified testimonials and mobile optimizations', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section exists
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Check testimonials heading
    const heading = page.locator('h2#testimonials-heading');
    await expect(heading).toHaveText('Trusted by 100+ installers and growing');
    
    // Check that we have 4 testimonial cards
    const testimonialCards = page.locator('figure[aria-label*="Testimonial from"]');
    await expect(testimonialCards).toHaveCount(4);
    
    // Check specific testimonial content
    const firstTestimonial = testimonialCards.first();
    await expect(firstTestimonial).toContainText('Cut quoting time from 15 minutes to 1 minute');
    await expect(firstTestimonial).toContainText('— Owner, 25-employee solar firm, CA');
    
    // Check mobile CSS optimizations are applied
    const body = page.locator('body');
    const bodyStyles = await body.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight
      };
    });
    
    // Should have mobile-optimized typography
    expect(bodyStyles.fontSize).toBe('16.5px');
    expect(bodyStyles.lineHeight).toBe('1.55');
  });

  test('Report page has unified testimonials', async ({ page }) => {
    await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section exists
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toBeVisible();
    
    // Check that we have 4 testimonial cards
    const testimonialCards = page.locator('figure[aria-label*="Testimonial from"]');
    await expect(testimonialCards).toHaveCount(4);
  });

  test('Pricing page does not have testimonials (correctly)', async ({ page }) => {
    await page.goto('http://localhost:3000/pricing?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section does NOT exist
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toHaveCount(0);
  });

  test('Partners page does not have testimonials (correctly)', async ({ page }) => {
    await page.goto('http://localhost:3000/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section does NOT exist
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toHaveCount(0);
  });

  test('Support page does not have testimonials (correctly)', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that testimonials section does NOT exist
    const testimonialsSection = page.locator('section[aria-labelledby="testimonials-heading"]');
    await expect(testimonialsSection).toHaveCount(0);
  });

  test('Mobile touch targets meet accessibility standards', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that buttons meet minimum touch target size
    const buttons = page.locator('button, .btn, a[role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          // Check minimum touch target size (44x44px)
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('StickyCTA has shimmer effect on hover', async ({ page }) => {
    await page.goto('http://localhost:3000/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Find the sticky CTA button
    const stickyCTA = page.locator('[data-testid="sticky-cta"]');
    await expect(stickyCTA).toBeVisible();
    
    // Check that shimmer effect exists
    const shimmerElement = stickyCTA.locator('span[style*="linear-gradient(90deg"]');
    await expect(shimmerElement).toHaveCount(2); // Mobile and desktop versions
    
    // Test hover effect
    const desktopCTA = stickyCTA.locator('.hidden.sm\\:block').first();
    await desktopCTA.hover();
    
    // Check that shimmer animation is triggered
    const shimmer = desktopCTA.locator('span[style*="linear-gradient(90deg"]');
    await expect(shimmer).toBeVisible();
  });
});
