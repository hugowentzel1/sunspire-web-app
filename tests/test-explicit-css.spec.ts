import { test, expect } from '@playwright/test';

test('Test Explicit CSS Classes for Blur', async ({ page }) => {
  console.log('🔍 Testing explicit CSS classes for blur...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3001/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check for blur layers using explicit CSS classes
  const blurLayers = await page.locator('.blur-layer').count();
  console.log('🔍 Blur layers found with .blur-layer class:', blurLayers);

  // Check for content layers
  const contentLayers = await page.locator('.content-layer').count();
  console.log('🔍 Content layers found with .content-layer class:', contentLayers);

  // Check the actual CSS being applied
  const cssCheck = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('.blur-layer');
    return Array.from(blurLayers).map((blur, index) => {
      const styles = window.getComputedStyle(blur);
      return {
        index,
        position: styles.position,
        inset: styles.inset,
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter,
        zIndex: styles.zIndex,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      };
    });
  });
  console.log('🔍 CSS check for .blur-layer:', cssCheck);

  // Check if blur is actually visible
  const visibilityCheck = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('.blur-layer');
    const contentElements = document.querySelectorAll('[class*="text-3xl font-black"]');
    
    return {
      blurLayers: blurLayers.length,
      contentElements: contentElements.length,
      blurPositions: Array.from(blurLayers).map(blur => {
        const rect = blur.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      }),
      contentPositions: Array.from(contentElements).map(content => {
        const rect = content.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      })
    };
  });
  console.log('🔍 Visibility check:', visibilityCheck);

  // Take screenshot
  await page.screenshot({ path: 'test-explicit-css.png', fullPage: true });
  console.log('📸 Screenshot saved');

  // Basic verification
  expect(blurLayers).toBe(4);
  expect(contentLayers).toBe(4);
});
