import { test, expect } from '@playwright/test';

test.describe('MOBILE STRICT VERIFICATION - Footer & CTA', () => {
  
  test('Footer - ALL 3 lines must be centered (measure actual positions)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    // Find the footer elements by their unique text
    const nrel = page.locator('text=Estimates generated').first();
    const sunspire = page.locator('text=Powered by').first();
    const google = page.locator('text=Mapping & location').first();

    // Wait for all to be visible
    await expect(nrel).toBeVisible({ timeout: 5000 });
    await expect(sunspire).toBeVisible({ timeout: 5000 });
    await expect(google).toBeVisible({ timeout: 5000 });

    const nrelBox = await nrel.boundingBox();
    const sunspireBox = await sunspire.boundingBox();
    const googleBox = await google.boundingBox();

    console.log('\n📍 FOOTER POSITIONING:');
    console.log('NREL:', nrelBox);
    console.log('Sunspire:', sunspireBox);
    console.log('Google:', googleBox);

    if (nrelBox && sunspireBox && googleBox) {
      // Calculate center X position of each element
      const nrelCenterX = nrelBox.x + (nrelBox.width / 2);
      const sunspireCenterX = sunspireBox.x + (sunspireBox.width / 2);
      const googleCenterX = googleBox.x + (googleBox.width / 2);

      // Calculate screen center
      const screenCenterX = 375 / 2;

      console.log('\n🎯 CENTER POSITIONS (X):');
      console.log(`Screen center: ${screenCenterX}`);
      console.log(`NREL center:   ${nrelCenterX.toFixed(1)} (diff: ${Math.abs(nrelCenterX - screenCenterX).toFixed(1)}px)`);
      console.log(`Sunspire:      ${sunspireCenterX.toFixed(1)} (diff: ${Math.abs(sunspireCenterX - screenCenterX).toFixed(1)}px)`);
      console.log(`Google center: ${googleCenterX.toFixed(1)} (diff: ${Math.abs(googleCenterX - screenCenterX).toFixed(1)}px)`);

      // Check if all are within 30px of screen center
      const nrelCentered = Math.abs(nrelCenterX - screenCenterX) < 30;
      const sunspireCentered = Math.abs(sunspireCenterX - screenCenterX) < 30;
      const googleCentered = Math.abs(googleCenterX - screenCenterX) < 30;

      console.log('\n✅ RESULTS:');
      console.log(nrelCentered ? '✅ NREL is centered' : '❌ NREL is NOT centered');
      console.log(sunspireCentered ? '✅ Sunspire is centered' : '❌ Sunspire is NOT centered');
      console.log(googleCentered ? '✅ Google is centered' : '❌ Google is NOT centered');

      const allCentered = nrelCentered && sunspireCentered && googleCentered;
      
      if (!allCentered) {
        console.log('\n❌ FOOTER IS NOT PROPERLY CENTERED - NEEDS FIX!');
      } else {
        console.log('\n🎉 ALL FOOTER LINES ARE CENTERED!');
      }

      expect(allCentered).toBe(true);
    }

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-footer-centered.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 350, width: 375, height: 350 }
    });
  });

  test('Sticky CTA - Must stay EXACTLY the same during scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const cta = page.locator('[data-testid="sticky-demo-cta"]');
    await expect(cta).toBeVisible({ timeout: 5000 });

    // Get initial state
    const initialHTML = await cta.innerHTML();
    const initialText = await cta.textContent();
    
    console.log('\n📱 STICKY CTA - Initial state:');
    console.log('Text:', initialText);

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-cta-position-1-top.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Scroll to 25%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25));
    await page.waitForTimeout(1000);
    
    const html25 = await cta.innerHTML();
    const text25 = await cta.textContent();
    
    console.log('\n📱 At 25% scroll:');
    console.log('Text:', text25);
    console.log('Same as initial?', html25 === initialHTML ? '✅ YES' : '❌ NO - CHANGED!');

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-cta-position-2-25percent.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Scroll to 50%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(1000);
    
    const html50 = await cta.innerHTML();
    const text50 = await cta.textContent();
    
    console.log('\n📱 At 50% scroll:');
    console.log('Text:', text50);
    console.log('Same as initial?', html50 === initialHTML ? '✅ YES' : '❌ NO - CHANGED!');

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-cta-position-3-50percent.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Scroll to 75%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
    await page.waitForTimeout(1000);
    
    const html75 = await cta.innerHTML();
    const text75 = await cta.textContent();
    
    console.log('\n📱 At 75% scroll:');
    console.log('Text:', text75);
    console.log('Same as initial?', html75 === initialHTML ? '✅ YES' : '❌ NO - CHANGED!');

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-cta-position-4-75percent.png',
      fullPage: false,
      clip: { x: 0, y: page.viewportSize()!.height - 80, width: 375, height: 80 }
    });

    // Verify ALL are the same
    const allSame = (
      html25 === initialHTML && 
      html50 === initialHTML && 
      html75 === initialHTML
    );

    if (!allSame) {
      console.log('\n❌ CTA CHANGES DURING SCROLL - NEEDS FIX!');
      console.log('Initial:', initialHTML.substring(0, 150));
      console.log('At 25%:', html25.substring(0, 150));
      console.log('At 50%:', html50.substring(0, 150));
      console.log('At 75%:', html75.substring(0, 150));
    } else {
      console.log('\n🎉 CTA STAYS THE SAME AT ALL SCROLL POSITIONS!');
    }

    expect(allSame).toBe(true);
  });

  test('Desktop - Verify unchanged (footer 3-column)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: 'tests/screenshots/STRICT-desktop-footer.png',
      fullPage: false,
      clip: { x: 400, y: page.viewportSize()!.height - 200, width: 1200, height: 200 }
    });

    console.log('✅ Desktop footer captured - should be 3-column (unchanged)');
  });
});

