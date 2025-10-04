import { test, expect } from '@playwright/test';

test.describe('Debug StickyCTA Deployment', () => {
  test('Debug why StickyCTA is not visible on live site', async ({ page }) => {
    console.log('🔍 Debugging StickyCTA deployment...');
    
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
    
    // Check for any console errors
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Check if demo mode is active
    const demoMode = await page.evaluate(() => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('demo') === '1';
    });
    console.log('🎯 Demo mode active:', demoMode);
    
    // Check if StickyCTA component exists in DOM
    const stickyCTAExists = await page.evaluate(() => {
      return document.querySelector('[data-testid="sticky-cta"]') !== null;
    });
    console.log('🎯 StickyCTA element exists in DOM:', stickyCTAExists);
    
    // Check if StickyCTA is visible
    const stickyCTA = page.locator('[data-testid="sticky-cta"]');
    const stickyVisible = await stickyCTA.isVisible();
    console.log('🎯 StickyCTA visible:', stickyVisible);
    
    // Check all elements with sticky-cta in the selector
    const allStickyElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid*="sticky"], [class*="sticky"], [id*="sticky"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        dataTestId: el.getAttribute('data-testid'),
        visible: el.offsetParent !== null
      }));
    });
    console.log('🎯 All sticky-related elements:', allStickyElements);
    
    // Check if there are any React errors
    const reactErrors = consoleLogs.filter(log => 
      log.includes('Error') || log.includes('Warning') || log.includes('React')
    );
    console.log('⚠️ React/Error logs:', reactErrors);
    
    // Check the page source for StickyCTA
    const pageContent = await page.content();
    const hasStickyCTA = pageContent.includes('sticky-cta') || pageContent.includes('StickyCTA');
    console.log('🎯 Page contains StickyCTA references:', hasStickyCTA);
    
    // Check if the report page has the demo mode condition
    const hasDemoCondition = pageContent.includes('demoMode &&') || pageContent.includes('demoMode?');
    console.log('🎯 Page has demo mode condition:', hasDemoCondition);
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'debug-sticky-cta-deployment.png', fullPage: true });
    
    console.log('✅ Debug complete!');
  });
});
