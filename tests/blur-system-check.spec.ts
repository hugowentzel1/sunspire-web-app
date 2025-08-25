import { test, expect } from '@playwright/test';

test('Check Blur System Implementation', async ({ page }) => {
  console.log('🔍 Checking blur system implementation...');
  
  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3000/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('✅ Report page loaded with Apple branding');
  
  // Check if demo mode is active
  const demoAttribute = await page.getAttribute('body', 'data-demo');
  console.log('🔍 Demo mode active:', demoAttribute);
  
  // Check the main container for data-demo attribute
  const mainContainer = await page.locator('[data-demo]').first();
  const mainDemoAttribute = await mainContainer.getAttribute('data-demo');
  console.log('🔍 Main container data-demo:', mainDemoAttribute);
  
  // Check if the CSS is being applied by looking at computed styles
  const blurElement = await page.locator('.locked-blur').first();
  const computedStyles = await blurElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      border: styles.border,
      backgroundColor: styles.backgroundColor,
      position: styles.position
    };
  });
  console.log('🔍 First blur element computed styles:', computedStyles);
  
  // Check if the pseudo-element CSS is being applied
  const pseudoElementStyles = await page.evaluate(() => {
    const element = document.querySelector('.locked-blur__content');
    if (!element) return null;
    
    // Try to get pseudo-element styles
    const styles = window.getComputedStyle(element, '::after');
    return {
      content: styles.content,
      backdropFilter: styles.backdropFilter,
      backgroundColor: styles.backgroundColor,
      position: styles.position
    };
  });
  console.log('🔍 Pseudo-element styles:', pseudoElementStyles);
  
  // Check for locked blur elements
  const lockedBlurElements = await page.locator('.locked-blur').count();
  console.log('🔍 Locked blur elements found:', lockedBlurElements);
  
  // Check for blur content elements
  const blurContentElements = await page.locator('.locked-blur__content').count();
  console.log('🔍 Blur content elements found:', blurContentElements);
  
  // Check for blur overlay elements
  const blurOverlayElements = await page.locator('.locked-blur__overlay').count();
  console.log('🔍 Blur overlay elements found:', blurOverlayElements);
  
  // Check for unlock buttons
  const unlockButtons = await page.locator('.unlock-pill, button:has-text("Unlock")').count();
  console.log('🔍 Unlock buttons found:', unlockButtons);
  
  // Check if brand colors are applied
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('🔍 Brand primary color:', brandPrimary);
  
  // Check if blur is visible by looking at CSS
  const blurStyles = await page.evaluate(() => {
    const elements = document.querySelectorAll('.locked-blur__content');
    return Array.from(elements).map(el => {
      const styles = window.getComputedStyle(el);
      // Check the ::after pseudo-element styles
      const afterStyles = window.getComputedStyle(el, '::after');
      return {
        backdropFilter: afterStyles.backdropFilter,
        filter: afterStyles.filter,
        opacity: afterStyles.opacity,
        backgroundColor: afterStyles.backgroundColor,
        zIndex: afterStyles.zIndex,
        display: afterStyles.display,
        visibility: afterStyles.visibility
      };
    });
  });
  console.log('🔍 Blur pseudo-element styles:', blurStyles);
  
  // Take screenshot for visual verification
  await page.screenshot({ path: 'blur-system-check.png' });
  console.log('📸 Screenshot saved for visual inspection');
  
  // Verify blur system is working
  expect(lockedBlurElements).toBeGreaterThan(0);
  expect(blurContentElements).toBeGreaterThan(0);
  expect(blurOverlayElements).toBeGreaterThan(0);
  expect(unlockButtons).toBeGreaterThan(0);
  
  console.log('✅ Blur system appears to be implemented correctly');
});
