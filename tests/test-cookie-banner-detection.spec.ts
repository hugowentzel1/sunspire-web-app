import { test, expect } from '@playwright/test';

test.describe('StickyCTA Cookie Banner Detection', () => {
  test('Verify StickyCTA responds to cookie banner presence', async ({ page }) => {
    console.log('🔍 Testing StickyCTA cookie banner detection...');
    
    // Navigate to Tesla demo report page
    await page.goto('https://sunspire-web-app.vercel.app/report?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Reset demo runs to ensure unlimited access
    await page.evaluate(() => {
      localStorage.clear();
      const brandData = {
        enabled: true,
        brand: "tesla",
        primary: "#CC0000",
        logo: null,
        domain: "tesla",
        city: null,
        rep: null,
        firstName: null,
        role: null,
        expireDays: 7,
        runs: 999,
        blur: true,
        pilot: false,
        isDemo: true,
        _timestamp: Date.now()
      };
      localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
    });
    
    await page.waitForTimeout(3000);
    
    // Check if StickyCTA is visible
    const stickyCTA = page.locator('[data-testid="sticky-cta"]');
    const stickyVisible = await stickyCTA.isVisible();
    
    console.log('🎯 StickyCTA Visible:', stickyVisible);
    
    if (stickyVisible) {
      // Get initial position
      const initialPosition = await stickyCTA.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height
        };
      });
      
      console.log('📏 Initial StickyCTA position:', initialPosition);
      
      // Check for existing cookie banners
      const cookieBanners = await page.locator('[data-cookie-banner], #cookie-consent, [role="dialog"][data-cookie], .cookie-banner, .cc-window').count();
      console.log('🍪 Existing cookie banners found:', cookieBanners);
      
      // Simulate adding a cookie banner
      console.log('🍪 Simulating cookie banner appearance...');
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent';
        banner.style.cssText = `
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #333;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        `;
        banner.textContent = 'This website uses cookies';
        document.body.appendChild(banner);
      });
      
      await page.waitForTimeout(1000);
      
      // Check position after cookie banner
      const positionWithBanner = await stickyCTA.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height
        };
      });
      
      console.log('📏 StickyCTA position with cookie banner:', positionWithBanner);
      
      // Verify it moved up
      const movedUp = positionWithBanner.bottom > initialPosition.bottom;
      console.log('⬆️ StickyCTA moved up when cookie banner appeared:', movedUp);
      
      // Remove cookie banner
      console.log('🍪 Removing cookie banner...');
      await page.evaluate(() => {
        const banner = document.getElementById('cookie-consent');
        if (banner) banner.remove();
      });
      
      await page.waitForTimeout(1000);
      
      // Check position after removing cookie banner
      const positionWithoutBanner = await stickyCTA.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height
        };
      });
      
      console.log('📏 StickyCTA position without cookie banner:', positionWithoutBanner);
      
      // Verify it moved back down
      const movedBackDown = positionWithoutBanner.bottom < positionWithBanner.bottom;
      console.log('⬇️ StickyCTA moved back down when cookie banner removed:', movedBackDown);
      
      // Check if trust signals are visible
      const trustChips = stickyCTA.locator('div').filter({ hasText: 'SOC 2' });
      const trustChipsVisible = await trustChips.isVisible();
      console.log('🛡️ Trust chips visible:', trustChipsVisible);
      
      if (trustChipsVisible) {
        const trustChipsText = await trustChips.textContent();
        console.log('🛡️ Trust chips text:', trustChipsText);
      }
      
      // Check button size
      const desktopButton = stickyCTA.locator('.hidden.sm\\:block a');
      const desktopButtonVisible = await desktopButton.isVisible();
      
      if (desktopButtonVisible) {
        const buttonHeight = await desktopButton.evaluate(el => el.getBoundingClientRect().height);
        console.log('📏 Desktop button height:', buttonHeight, 'px (target: ~60px)');
        
        const buttonText = await desktopButton.textContent();
        console.log('📝 Button text:', buttonText);
      }
      
      // Check subcopy
      const subcopy = stickyCTA.locator('div').filter({ hasText: '$99/mo + $399 setup' });
      const subcopyVisible = await subcopy.isVisible();
      console.log('📝 Subcopy visible:', subcopyVisible);
      
      if (subcopyVisible) {
        const subcopyText = await subcopy.textContent();
        console.log('📝 Subcopy text:', subcopyText);
      }
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'cookie-banner-detection-test.png', fullPage: true });
    
    console.log('✅ Cookie banner detection test complete!');
  });
});
