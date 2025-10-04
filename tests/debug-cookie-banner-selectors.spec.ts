import { test, expect } from '@playwright/test';

test.describe('Debug Cookie Banner Selectors', () => {
  test('Find actual cookie banner selectors on live site', async ({ page }) => {
    console.log('🔍 Debugging cookie banner selectors on live site...');
    
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
    
    // Check for all possible cookie banner selectors
    const cookieSelectors = [
      '[data-cookie-banner]',
      '#cookie-consent',
      '[role="dialog"][data-cookie]',
      '.cookie-banner',
      '.cc-window',
      '[data-cookie]',
      '.cookie-notice',
      '#cookie-notice',
      '.cookie-consent',
      '[id*="cookie"]',
      '[class*="cookie"]',
      '[data-testid*="cookie"]'
    ];
    
    console.log('🍪 Checking for cookie banners with various selectors...');
    
    for (const selector of cookieSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Found ${elements} element(s) with selector: ${selector}`);
        
        // Get details about the first element
        const firstElement = page.locator(selector).first();
        const isVisible = await firstElement.isVisible();
        const text = await firstElement.textContent();
        const className = await firstElement.getAttribute('class');
        const id = await firstElement.getAttribute('id');
        const dataAttributes = await firstElement.evaluate(el => {
          const attrs = {};
          for (const attr of el.attributes) {
            if (attr.name.startsWith('data-')) {
              attrs[attr.name] = attr.value;
            }
          }
          return attrs;
        });
        
        console.log(`   - Visible: ${isVisible}`);
        console.log(`   - Text: ${text?.substring(0, 100)}...`);
        console.log(`   - Class: ${className}`);
        console.log(`   - ID: ${id}`);
        console.log(`   - Data attributes:`, dataAttributes);
        
        if (isVisible) {
          // Get position info
          const rect = await firstElement.boundingBox();
          console.log(`   - Position: x=${rect?.x}, y=${rect?.y}, width=${rect?.width}, height=${rect?.height}`);
        }
      } else {
        console.log(`❌ No elements found with selector: ${selector}`);
      }
    }
    
    // Check for any elements that might be cookie banners by looking for common text
    const cookieTexts = ['cookie', 'consent', 'privacy', 'accept', 'decline'];
    
    console.log('🍪 Checking for elements with cookie-related text...');
    
    for (const text of cookieTexts) {
      const elements = await page.locator(`text=${text}`).count();
      if (elements > 0) {
        console.log(`✅ Found ${elements} element(s) containing text: "${text}"`);
        
        // Check if any are positioned at the bottom (likely cookie banners)
        for (let i = 0; i < Math.min(elements, 3); i++) {
          const element = page.locator(`text=${text}`).nth(i);
          const isVisible = await element.isVisible();
          if (isVisible) {
            const rect = await element.boundingBox();
            const viewportHeight = await page.evaluate(() => window.innerHeight);
            const isNearBottom = rect && rect.y > viewportHeight * 0.7;
            
            console.log(`   - Element ${i}: visible=${isVisible}, near bottom=${isNearBottom}, y=${rect?.y}, viewport=${viewportHeight}`);
          }
        }
      }
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'debug-cookie-banner-selectors.png', fullPage: true });
    
    console.log('✅ Cookie banner selector debug complete!');
  });
});
