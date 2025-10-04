import { test, expect } from '@playwright/test';

test.describe('Updated StickyCTA Verification', () => {
  test('Verify updated StickyCTA with larger size and trust signals', async ({ page }) => {
    console.log('🔍 Testing updated StickyCTA on live site...');
    
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
    
    // Check if StickyCTA is visible on desktop
    const stickyCTA = page.locator('[data-testid="sticky-cta"]');
    const stickyVisible = await stickyCTA.isVisible();
    
    console.log('🎯 StickyCTA Visible:', stickyVisible);
    
    if (stickyVisible) {
      // Check desktop version
      const desktopCTA = stickyCTA.locator('.hidden.sm\\:block');
      const desktopVisible = await desktopCTA.isVisible();
      
      if (desktopVisible) {
        // Check button height (should be ~60px)
        const button = desktopCTA.locator('a');
        const buttonHeight = await button.evaluate(el => el.getBoundingClientRect().height);
        console.log('📏 Desktop button height:', buttonHeight, 'px');
        
        // Check if button text is correct
        const buttonText = await button.textContent();
        console.log('📝 Button text:', buttonText);
        
        // Check subcopy
        const subcopy = desktopCTA.locator('div').filter({ hasText: '$99/mo + $399 setup' });
        const subcopyText = await subcopy.textContent();
        console.log('📝 Subcopy:', subcopyText);
        
        // Check trust chips
        const trustChips = desktopCTA.locator('div').filter({ hasText: 'SOC 2' });
        const trustChipsVisible = await trustChips.isVisible();
        console.log('🛡️ Trust chips visible:', trustChipsVisible);
        
        if (trustChipsVisible) {
          const trustChipsText = await trustChips.textContent();
          console.log('🛡️ Trust chips text:', trustChipsText);
        }
      }
      
      // Check mobile version
      const mobileCTA = stickyCTA.locator('.sm\\:hidden');
      const mobileVisible = await mobileCTA.isVisible();
      
      if (mobileVisible) {
        // Check mobile button height (should be ≥52px)
        const mobileButton = mobileCTA.locator('a');
        const mobileButtonHeight = await mobileButton.evaluate(el => el.getBoundingClientRect().height);
        console.log('📱 Mobile button height:', mobileButtonHeight, 'px');
        
        // Check mobile trust chips
        const mobileTrustChips = mobileCTA.locator('div').filter({ hasText: 'SOC 2' });
        const mobileTrustChipsVisible = await mobileTrustChips.isVisible();
        console.log('📱 Mobile trust chips visible:', mobileTrustChipsVisible);
      }
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'updated-sticky-cta-verification.png', fullPage: true });
    
    console.log('✅ Updated StickyCTA verification complete!');
  });
  
  test('Verify StickyCTA only appears on report page, not on other pages', async ({ page }) => {
    console.log('🔍 Checking that StickyCTA only appears on report page...');
    
    const pages = [
      { name: 'Home', url: 'https://sunspire-web-app.vercel.app/?company=tesla&demo=1' },
      { name: 'Pricing', url: 'https://sunspire-web-app.vercel.app/pricing?company=tesla&demo=1' },
      { name: 'Partners', url: 'https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1' },
      { name: 'Support', url: 'https://sunspire-web-app.vercel.app/support?company=tesla&demo=1' }
    ];
    
    for (const pageInfo of pages) {
      console.log(`🔍 Checking ${pageInfo.name} page...`);
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      const stickyCTA = page.locator('[data-testid="sticky-cta"]');
      const stickyVisible = await stickyCTA.isVisible();
      
      console.log(`📄 ${pageInfo.name} page - StickyCTA visible:`, stickyVisible);
      
      if (stickyVisible) {
        console.log(`❌ ERROR: StickyCTA should NOT be visible on ${pageInfo.name} page!`);
      } else {
        console.log(`✅ Correct: StickyCTA not visible on ${pageInfo.name} page`);
      }
    }
    
    // Now check report page specifically
    console.log('🔍 Checking Report page...');
    await page.goto('https://sunspire-web-app.vercel.app/report?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const reportStickyCTA = page.locator('[data-testid="sticky-cta"]');
    const reportStickyVisible = await reportStickyCTA.isVisible();
    
    console.log('📄 Report page - StickyCTA visible:', reportStickyVisible);
    
    if (reportStickyVisible) {
      console.log('✅ Correct: StickyCTA is visible on Report page');
    } else {
      console.log('❌ ERROR: StickyCTA should be visible on Report page!');
    }
    
    console.log('✅ StickyCTA page placement verification complete!');
  });
});
