import { test, expect } from '@playwright/test';

test.describe('Cookie Banner Consistency', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure banner shows
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Demo page - cookie banner displays fully without cutoff', async ({ page }) => {
    await page.goto('/?company=microsoft&demo=1');
    await page.waitForTimeout(1000);

    const banner = page.locator('[data-cookie-banner]');
    await expect(banner).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/demo-cookie-banner.png',
      fullPage: true 
    });

    // Verify banner is at bottom and has proper height
    const bannerBox = await banner.boundingBox();
    expect(bannerBox).toBeTruthy();
    
    // Banner should not be cut off (height should be reasonable, not restricted to 56px)
    if (bannerBox) {
      expect(bannerBox.height).toBeGreaterThan(70); // Should be taller than 56px
    }

    // Verify all text is visible
    await expect(banner.locator('text=We use cookies to improve your experience')).toBeVisible();
    await expect(banner.locator('text=Accept All')).toBeVisible();
    await expect(banner.locator('text=Decline')).toBeVisible();

    console.log('✓ Demo cookie banner displays fully');
  });

  test('Paid page - cookie banner matches demo version', async ({ page }) => {
    await page.goto('/?company=microsoft&demo=0');
    await page.waitForTimeout(1000);

    const banner = page.locator('[data-cookie-banner]');
    await expect(banner).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/paid-cookie-banner.png',
      fullPage: true 
    });

    // Verify it's the same full-width banner (not the old compact toast)
    const bannerBox = await banner.boundingBox();
    expect(bannerBox).toBeTruthy();
    
    if (bannerBox) {
      // Should be full width (close to viewport width)
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        expect(bannerBox.width).toBeGreaterThan(viewportSize.width * 0.9);
      }
      
      // Should have proper height (not cut off)
      expect(bannerBox.height).toBeGreaterThan(70);
    }

    // Verify all content is visible
    await expect(banner.locator('text=We use cookies to improve your experience')).toBeVisible();
    await expect(banner.locator('text=Accept All')).toBeVisible();
    await expect(banner.locator('text=Decline')).toBeVisible();

    console.log('✓ Paid cookie banner matches demo version');
  });

  test('Mobile - cookie banner stacks properly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/?company=microsoft&demo=1');
    await page.waitForTimeout(1000);

    const banner = page.locator('[data-cookie-banner]');
    await expect(banner).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/mobile-cookie-banner.png',
      fullPage: true 
    });

    // On mobile, buttons should stack below text
    const bannerBox = await banner.boundingBox();
    if (bannerBox) {
      // Mobile banner needs more vertical space for stacking
      expect(bannerBox.height).toBeGreaterThan(100);
    }

    console.log('✓ Mobile cookie banner stacks properly');
  });
});

