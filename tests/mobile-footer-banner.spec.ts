import { test, expect } from '@playwright/test';

test.describe('Mobile Footer and Banner - Visual Check', () => {
  
  test('Mobile footer attributions are centered', async ({ page }) => {
    // Set mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Take screenshot of footer
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-footer-centered.png', 
      fullPage: true 
    });

    console.log('✅ Mobile footer screenshot captured');
    console.log('📸 Check: tests/screenshots/mobile-footer-centered.png');
    console.log('   - Address should be centered');
    console.log('   - Bottom attributions (NREL, Sunspire, Google) should be centered');
  });

  test('Mobile sticky banner matches desktop home page style', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if sticky banner is visible
    const stickyBanner = page.locator('[data-testid="sticky-demo-cta"]').first();
    const isVisible = await stickyBanner.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      console.log('✅ Sticky banner is visible');
      
      // Check for banner elements
      const hasExclusivePreview = await page.locator('text=/Exclusive preview/i').isVisible({ timeout: 1000 }).catch(() => false);
      const hasRunsLeft = await page.locator('text=/runs left/i').isVisible({ timeout: 1000 }).catch(() => false);
      const hasExpires = await page.locator('text=/Expires in/i').isVisible({ timeout: 1000 }).catch(() => false);
      
      console.log('✅ "Exclusive preview" badge:', hasExclusivePreview);
      console.log('✅ "Runs left" counter:', hasRunsLeft);
      console.log('✅ "Expires in" countdown:', hasExpires);
    } else {
      console.log('⚠️  Sticky banner not visible (may only show on certain pages)');
    }

    // Take screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-banner-style.png', 
      fullPage: true 
    });

    console.log('📸 Screenshot: tests/screenshots/mobile-banner-style.png');
  });

  test('Compare mobile vs desktop footer', async ({ page }) => {
    // Desktop screenshot
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'tests/screenshots/desktop-footer-comparison.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 300, width: 1920, height: 300 }
    });

    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-footer-comparison.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 400, width: 375, height: 400 }
    });

    console.log('📸 Comparison screenshots captured:');
    console.log('   - Desktop: tests/screenshots/desktop-footer-comparison.png');
    console.log('   - Mobile: tests/screenshots/mobile-footer-comparison.png');
  });

  test('Desktop home page banner style reference', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Screenshot of the top banner
    await page.screenshot({ 
      path: 'tests/screenshots/desktop-banner-reference.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 100 }
    });

    console.log('📸 Desktop banner reference: tests/screenshots/desktop-banner-reference.png');
    console.log('   This is the style that mobile sticky banner should match');
  });
});

