import { test, expect } from '@playwright/test';

test('Debug CTA Button Styles - Check CSS Variables', async ({ page }) => {
  console.log('🔍 Debugging CTA button styles...');
  
  // Navigate to Tesla report page
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check CSS variables on document root
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand'),
      brandPrimaryValue: root.style.getPropertyValue('--brand-primary'),
      brandValue: root.style.getPropertyValue('--brand')
    };
  });
  
  console.log('🎨 CSS Variables on document root:', cssVars);
  
  // Find CTA buttons
  const ctaButtons = await page.locator('[data-cta="primary"]').all();
  console.log(`🔘 Found ${ctaButtons.length} CTA buttons`);
  
  for (let i = 0; i < ctaButtons.length; i++) {
    const button = ctaButtons[i];
    
    // Get computed styles
    const styles = await button.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        background: computed.background,
        color: computed.color,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity
      };
    });
    
    console.log(`🔘 CTA Button ${i + 1} styles:`, styles);
    
    // Check inline styles
    const inlineStyle = await button.getAttribute('style');
    console.log(`🔘 CTA Button ${i + 1} inline style:`, inlineStyle);
    
    // Check if CSS variable is being used
    const hasVarBrandPrimary = inlineStyle?.includes('var(--brand-primary)');
    console.log(`🔘 CTA Button ${i + 1} uses var(--brand-primary):`, hasVarBrandPrimary);
  }
  
  // Check if there are any CSS rules overriding the buttons
  const cssRules = await page.evaluate(() => {
    const rules = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (rule instanceof CSSStyleRule) {
              if (rule.selectorText.includes('[data-cta="primary"]') || 
                  rule.selectorText.includes('button') ||
                  rule.selectorText.includes('.bg-white')) {
                rules.push({
                  selector: rule.selectorText,
                  backgroundColor: rule.style.backgroundColor,
                  background: rule.style.background
                });
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
      }
    }
    return rules;
  });
  
  console.log('📋 CSS Rules affecting CTA buttons:', cssRules);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-cta-styles.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
});
