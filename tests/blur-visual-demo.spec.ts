import { test, expect } from '@playwright/test';

test('Blur System Visual Demo - Stays Up for Inspection', async ({ page }) => {
  console.log('🎯 Opening blur system demo - page will stay open for visual inspection');
  
  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3000/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('✅ Report page loaded with Apple branding');
  console.log('🔍 Demo mode should be active with blur effects visible');
  console.log('📱 Page will stay open for visual inspection');
  console.log('🔒 Look for blurred content in metric tiles and locked panels');
  console.log('🎨 Brand color should be Apple blue (#0071E3)');
  
  // Check if demo mode is active
  const demoAttribute = await page.getAttribute('body', 'data-demo');
  console.log('🔍 Demo mode active:', demoAttribute);
  
  // Check the main container for data-demo attribute
  const mainContainer = await page.locator('[data-demo]').first();
  const mainDemoAttribute = await mainContainer.getAttribute('data-demo');
  console.log('🔍 Main container data-demo:', mainDemoAttribute);
  
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
  
  // Take screenshot for verification
  await page.screenshot({ path: 'blur-visual-demo.png', fullPage: true });
  console.log('📸 Full page screenshot saved as blur-visual-demo.png');
  
  // Verify blur system is working
  expect(lockedBlurElements).toBeGreaterThan(0);
  expect(blurContentElements).toBeGreaterThan(0);
  expect(blurOverlayElements).toBeGreaterThan(0);
  expect(unlockButtons).toBeGreaterThan(0);
  
  console.log('✅ Blur system is working correctly!');
  console.log('🔍 VISUAL INSPECTION:');
  console.log('   - Look for blurred content in metric tiles (System Size, Annual Production, etc.)');
  console.log('   - Check Financial Analysis and Environmental Impact panels for blur');
  console.log('   - Verify unlock buttons are visible on locked sections');
  console.log('   - Confirm Apple blue brand color is applied throughout');
  console.log('   - Page will stay open for manual inspection');
  
  // Keep the page open for visual inspection
  await page.waitForTimeout(300000); // Wait 5 minutes
});
