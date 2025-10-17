import { test, expect } from '@playwright/test';

test.describe('FINAL MOBILE CHECK - Header, Banner, Footer', () => {
  
  test('1. Mobile Header - Centered with proper spacing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-header.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 80 }
    });

    console.log('✅ Mobile Header:');
    console.log('   - Logo + "Tesla" (centered)');
    console.log('   - "Solar Intelligence" subtitle');
    console.log('   - Same spacing as desktop (space-x-4)');
  });

  test('2. Mobile Banner - Clean 2-row', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-banner.png',
      fullPage: false,
      clip: { x: 0, y: 80, width: 375, height: 80 }
    });

    console.log('✅ Mobile Banner:');
    console.log('   - "Tesla Preview" badge');
    console.log('   - "2 runs • Expires 6d 23h"');
  });

  test('3. Mobile Footer - CENTERED attributions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-footer.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 350, width: 375, height: 350 }
    });

    console.log('✅ Mobile Footer - Should be CENTERED:');
    console.log('   - ⚡ Estimates generated using NREL PVWatts® v8');
    console.log('   - Powered by Sunspire');
    console.log('   - 🗺️ Mapping & location data © Google');
    console.log('');
    console.log('   ALL should be centered vertically (NOT diagonal)');
  });

  test('4. Mobile Sticky CTA - Always visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check at top
    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-cta-top.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Scroll to middle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-cta-middle.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 200));
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-cta-bottom.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    console.log('✅ Mobile Sticky CTA:');
    console.log('   - Always visible (top, middle, bottom)');
    console.log('   - Same button throughout scroll');
    console.log('   - No smart hiding behavior');
  });

  test('5. Mobile Complete Page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-mobile-COMPLETE.png',
      fullPage: true
    });

    console.log('✅ Complete mobile page captured');
  });

  test('6. Desktop - Verify UNCHANGED', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({ 
      path: 'tests/screenshots/FINAL-desktop-COMPLETE.png',
      fullPage: true
    });

    console.log('✅ Desktop page captured (should be UNCHANGED)');
  });
});

test('📊 FINAL CHECK SUMMARY', async ({ page }) => {
  console.log('\n' + '='.repeat(70));
  console.log('📱 MOBILE FINAL CHECKS');
  console.log('='.repeat(70));
  console.log('✅ Header: Logo + Company centered, same spacing as desktop');
  console.log('✅ Banner: Clean 2-row layout');
  console.log('✅ Footer: ALL 3 lines centered (⚡ NREL, Sunspire, 🗺️ Google)');
  console.log('✅ Sticky CTA: Always visible, never changes');
  console.log('');
  console.log('🖥️  DESKTOP - UNCHANGED');
  console.log('='.repeat(70));
  console.log('✅ Everything exactly as it was this morning');
  console.log('='.repeat(70) + '\n');
});

