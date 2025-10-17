import { test, expect } from '@playwright/test';

test.describe('MOBILE ALIGNMENT - Strict Visual Tests', () => {
  
  test('Mobile Footer - Verify ALL 3 lines are TRULY centered', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check actual position of each line
    const nrelLine = page.locator('text=/Estimates generated using NREL/').first();
    const sunspireLine = page.locator('text=/Powered by Sunspire/').first();
    const googleLine = page.locator('text=/Mapping & location data/').first();

    const nrelBox = await nrelLine.boundingBox();
    const sunspireBox = await sunspireLine.boundingBox();
    const googleBox = await googleLine.boundingBox();

    console.log('📍 NREL position:', nrelBox);
    console.log('📍 Sunspire position:', sunspireBox);
    console.log('📍 Google position:', googleBox);

    // All should have similar x positions (centered)
    if (nrelBox && sunspireBox && googleBox) {
      const nrelCenter = nrelBox.x + nrelBox.width / 2;
      const sunspireCenter = sunspireBox.x + sunspireBox.width / 2;
      const googleCenter = googleBox.x + googleBox.width / 2;

      console.log('🎯 NREL center X:', nrelCenter);
      console.log('🎯 Sunspire center X:', sunspireCenter);
      console.log('🎯 Google center X:', googleCenter);

      const tolerance = 20; // Allow 20px difference
      const isAligned = 
        Math.abs(nrelCenter - sunspireCenter) < tolerance &&
        Math.abs(sunspireCenter - googleCenter) < tolerance;

      console.log(isAligned ? '✅ ALL CENTERED!' : '❌ NOT CENTERED - DIAGONAL!');
      
      if (!isAligned) {
        console.log('⚠️  Footer is DIAGONAL, needs fixing!');
      }
    }

    await page.screenshot({ 
      path: 'tests/screenshots/VERIFY-mobile-footer-alignment.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 300, width: 375, height: 300 }
    });
  });

  test('Mobile Header - Check spacing matches desktop', async ({ page }) => {
    // First check desktop spacing
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const desktopHeader = page.locator('header').first();
    const desktopHeaderHTML = await desktopHeader.innerHTML();
    console.log('🖥️  Desktop header classes:', desktopHeaderHTML.match(/space-x-\d+|gap-\d+/g));

    await page.screenshot({ 
      path: 'tests/screenshots/VERIFY-desktop-header-spacing.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 400, height: 80 }
    });

    // Now check mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const mobileHeader = page.locator('header').first();
    const mobileHeaderHTML = await mobileHeader.innerHTML();
    console.log('📱 Mobile header classes:', mobileHeaderHTML.match(/space-x-\d+|gap-\d+/g));

    await page.screenshot({ 
      path: 'tests/screenshots/VERIFY-mobile-header-spacing.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 80 }
    });

    console.log('🔍 Compare these screenshots to verify spacing matches');
  });

  test('Mobile CTA - Track if it changes during scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Capture CTA at top of page
    const ctaTop = page.locator('[data-testid="sticky-demo-cta"]').first();
    const topHTML = await ctaTop.innerHTML().catch(() => 'not found');
    const topVisible = await ctaTop.isVisible().catch(() => false);
    
    console.log('📱 CTA at TOP:');
    console.log('   Visible:', topVisible);
    console.log('   Content:', topHTML.substring(0, 100));

    await page.screenshot({ 
      path: 'tests/screenshots/VERIFY-cta-at-top.png',
      fullPage: false
    });

    // Scroll to middle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    const ctaMiddle = page.locator('[data-testid="sticky-demo-cta"]').first();
    const middleHTML = await ctaMiddle.innerHTML().catch(() => 'not found');
    const middleVisible = await ctaMiddle.isVisible().catch(() => false);

    console.log('📱 CTA at MIDDLE:');
    console.log('   Visible:', middleVisible);
    console.log('   Content:', middleHTML.substring(0, 100));

    await page.screenshot({ 
      path: 'tests/screenshots/VERIFY-cta-at-middle.png',
      fullPage: false
    });

    // Check if content changed
    if (topHTML !== middleHTML) {
      console.log('❌ CTA CHANGED! This is the problem.');
    } else {
      console.log('✅ CTA stayed the same');
    }
  });
});

