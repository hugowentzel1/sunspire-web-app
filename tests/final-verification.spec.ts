import { test, expect } from '@playwright/test';

test.describe('Final Verification Test', () => {
  test('Verify StickyCTA and all changes work on live site', async ({ page }) => {
    console.log('🎯 Final verification of all changes...');
    
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
    
    await page.waitForTimeout(2000);
    
    // Check if StickyCTA is visible on report page
    const stickyCTA = page.locator('[data-sticky-cta-desktop]');
    const stickyVisible = await stickyCTA.isVisible();
    
    console.log('🎯 StickyCTA Visible on Report Page:', stickyVisible);
    expect(stickyVisible).toBe(true);
    
    if (stickyVisible) {
      // Check the CTA label
      const ctaLabel = await stickyCTA.locator('a').textContent();
      console.log('📝 CTA Label:', ctaLabel);
      expect(ctaLabel).toBe('Activate on Your Domain — 24 Hours');
      
      // Check the subtext (should be the new pricing text)
      const subtext = await stickyCTA.locator('div').nth(1).textContent();
      console.log('📝 Subtext:', subtext);
      expect(subtext).toBe('$99/mo + $399 setup • Cancel anytime');
    }
    
    // Test Tesla red colors on Partners page
    console.log('🔍 Testing Tesla red colors on Partners page...');
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const partnersColors = await page.evaluate(() => {
      const elements = ['$30/mo', '$120', '30 days', '$30/client', '$120/client'];
      const results = {};
      elements.forEach(text => {
        const element = Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent?.trim() === text
        );
        if (element) {
          results[text] = getComputedStyle(element).color;
        }
      });
      return results;
    });
    
    console.log('🎨 Partners Page Colors:', partnersColors);
    const allTeslaRed = Object.values(partnersColors).every(color => color === 'rgb(204, 0, 0)');
    expect(allTeslaRed).toBe(true);
    
    // Test Tesla red colors on Support page
    console.log('🔍 Testing Tesla red colors on Support page...');
    await page.goto('https://sunspire-web-app.vercel.app/support?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const supportColors = await page.evaluate(() => {
      const elements = ['Setup Guide', 'CRM Integration Tutorial', 'Branding Customization', 'API Documentation'];
      const results = {};
      elements.forEach(text => {
        const element = Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent?.trim() === text
        );
        if (element) {
          results[text] = getComputedStyle(element).color;
        }
      });
      return results;
    });
    
    console.log('🎨 Support Page Colors:', supportColors);
    const allSupportTeslaRed = Object.values(supportColors).every(color => color === 'rgb(204, 0, 0)');
    expect(allSupportTeslaRed).toBe(true);
    
    // Test that StickyCTA is NOT on other pages
    console.log('🔍 Verifying StickyCTA is NOT on other pages...');
    
    // Check pricing page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const pricingSticky = page.locator('[data-sticky-cta-desktop]');
    const pricingStickyVisible = await pricingSticky.isVisible();
    console.log('💰 Pricing Page StickyCTA Visible:', pricingStickyVisible);
    expect(pricingStickyVisible).toBe(false);
    
    // Check partners page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const partnersSticky = page.locator('[data-sticky-cta-desktop]');
    const partnersStickyVisible = await partnersSticky.isVisible();
    console.log('🤝 Partners Page StickyCTA Visible:', partnersStickyVisible);
    expect(partnersStickyVisible).toBe(false);
    
    // Check support page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const supportSticky = page.locator('[data-sticky-cta-desktop]');
    const supportStickyVisible = await supportSticky.isVisible();
    console.log('🆘 Support Page StickyCTA Visible:', supportStickyVisible);
    expect(supportStickyVisible).toBe(false);
    
    // Take final screenshot
    await page.screenshot({ path: 'final-verification-complete.png', fullPage: true });
    
    console.log('✅ All changes verified successfully on live site!');
    console.log('🎯 StickyCTA: Only on report page with correct label and pricing subtext');
    console.log('🎨 Tesla Colors: Working on Partners and Support pages');
    console.log('🚫 StickyCTA: Correctly absent from other pages');
  });
});