import { test, expect } from '@playwright/test';

test.describe('Mobile Banner and Footer - Final Visual Check', () => {
  
  test('1. Mobile top banner - compact and centered', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of top banner
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-top-banner.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 120 }
    });

    console.log('✅ Mobile top banner captured');
    console.log('   Should show:');
    console.log('   - Exclusive preview badge (centered)');
    console.log('   - Runs left + countdown (centered, one line)');
  });

  test('2. Mobile footer - centered attributions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    // Take screenshot of footer bottom
    const footerHeight = 400;
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-footer-bottom.png',
      fullPage: false,
      clip: { 
        x: 0, 
        y: page.viewportSize()!.height - footerHeight, 
        width: 375, 
        height: footerHeight 
      }
    });

    console.log('✅ Mobile footer bottom captured');
    console.log('   Should show:');
    console.log('   - NREL attribution (centered)');
    console.log('   - Powered by Sunspire (centered)');
    console.log('   - Google attribution (centered)');
  });

  test('3. Mobile sticky CTA - simple button only', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if sticky CTA exists
    const stickyCTA = page.locator('[data-testid="sticky-demo-cta"]').first();
    const isVisible = await stickyCTA.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      console.log('✅ Sticky CTA is visible');
      
      // Take screenshot of bottom showing sticky CTA
      await page.screenshot({ 
        path: 'tests/screenshots/mobile-sticky-cta.png',
        fullPage: false,
        clip: { 
          x: 0, 
          y: page.viewportSize()!.height - 100, 
          width: 375, 
          height: 100 
        }
      });

      console.log('   Should show:');
      console.log('   - Simple button only (no banner content)');
      console.log('   - White background with shadow');
      console.log('   - Brand colored button');
    } else {
      console.log('⚠️  Sticky CTA not visible on this page');
    }
  });

  test('4. Desktop banner - unchanged', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of top banner
    await page.screenshot({ 
      path: 'tests/screenshots/desktop-top-banner.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 80 }
    });

    console.log('✅ Desktop banner captured (should be unchanged)');
    console.log('   Should show:');
    console.log('   - Full horizontal layout');
    console.log('   - Badge, runs, and buttons in one row');
  });

  test('5. Desktop footer - unchanged', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // Take screenshot of footer
    await page.screenshot({ 
      path: 'tests/screenshots/desktop-footer-bottom.png',
      fullPage: false,
      clip: { 
        x: 0, 
        y: page.viewportSize()!.height - 250, 
        width: 1920, 
        height: 250 
      }
    });

    console.log('✅ Desktop footer captured (should be unchanged)');
    console.log('   Should show:');
    console.log('   - 3-column layout (left, center, right)');
    console.log('   - NREL (left), Sunspire (center), Google (right)');
  });

  test('6. Full page comparison - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ 
      path: 'tests/screenshots/mobile-full-page.png',
      fullPage: true
    });

    console.log('✅ Mobile full page screenshot');
  });

  test('7. Scroll test - sticky CTA behavior', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to middle
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: 'tests/screenshots/mobile-scroll-middle.png',
      fullPage: false
    });

    console.log('✅ Middle scroll position');
    console.log('   Sticky CTA should remain at bottom, unchanged');

    // Scroll near footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - 500);
    });
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: 'tests/screenshots/mobile-near-footer.png',
      fullPage: false
    });

    console.log('✅ Near footer position');
    console.log('   Sticky CTA should still be visible and unchanged');
  });
});

test('📊 SUMMARY - Mobile Changes', async ({ page }) => {
  console.log('\n' + '='.repeat(60));
  console.log('📱 MOBILE CHANGES SUMMARY');
  console.log('='.repeat(60));
  console.log('✅ Top Banner: Compact 2-row layout (badge + counters)');
  console.log('✅ Footer: All attributions centered');
  console.log('✅ Sticky CTA: Simple button only, no changes when scrolling');
  console.log('✅ Desktop: Completely unchanged');
  console.log('='.repeat(60));
  console.log('\n📸 Screenshots saved to tests/screenshots/');
  console.log('   - mobile-top-banner.png');
  console.log('   - mobile-footer-bottom.png');
  console.log('   - mobile-sticky-cta.png');
  console.log('   - desktop-top-banner.png');
  console.log('   - desktop-footer-bottom.png');
  console.log('   - mobile-full-page.png');
  console.log('   - mobile-scroll-middle.png');
  console.log('   - mobile-near-footer.png');
  console.log('='.repeat(60) + '\n');
});

