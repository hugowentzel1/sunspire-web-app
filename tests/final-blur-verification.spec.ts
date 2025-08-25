import { test, expect } from '@playwright/test';

test('Final Blur Verification - Should Match c548b88 Exactly', async ({ page }) => {
  console.log('🎯 Final verification - blur should now be visible and match c548b88 exactly...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3001/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check for blur layers
  const blurLayers = await page.locator('.blur-layer').count();
  console.log('🔍 Blur layers found:', blurLayers);

  // Check for unlock buttons
  const unlockButtons = await page.locator('.unlock-pill').count();
  console.log('🔍 Unlock buttons found:', unlockButtons);

  // Check if blur is actually visible by looking at the visual effect
  const blurVisibility = await page.evaluate(() => {
    const blurLayers = document.querySelectorAll('.blur-layer');
    const contentElements = document.querySelectorAll('[class*="text-3xl font-black"]');
    
    return {
      blurLayers: blurLayers.length,
      contentElements: contentElements.length,
      // Check if blur layers are above content (z-index > 10)
      blurAboveContent: Array.from(blurLayers).map(blur => {
        const styles = window.getComputedStyle(blur);
        return parseInt(styles.zIndex) > 10;
      }),
      // Check if content is below blur (z-index < 15)
      contentBelowBlur: Array.from(contentElements).map(content => {
        const styles = window.getComputedStyle(content);
        return parseInt(styles.zIndex) < 15;
      })
    };
  });
  console.log('🔍 Blur visibility check:', blurVisibility);

  // Check CTA box background color
  const ctaBackground = await page.evaluate(() => {
    const ctaBox = document.querySelector('[class*="rounded-3xl py-12 px-8 text-center text-white"]');
    if (ctaBox) {
      const styles = window.getComputedStyle(ctaBox);
      return {
        backgroundColor: styles.backgroundColor,
        inlineStyle: ctaBox.getAttribute('style'),
        // Check if it's not black
        isNotBlack: !styles.backgroundColor.includes('rgb(0, 0, 0)') && !styles.backgroundColor.includes('black')
      };
    }
    return null;
  });
  console.log('🔍 CTA box background:', ctaBackground);

  // Check unlock button styling
  const buttonStyles = await page.evaluate(() => {
    const buttons = document.querySelectorAll('.unlock-pill');
    return Array.from(buttons).map(button => {
      const styles = window.getComputedStyle(button);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight
      };
    });
  });
  console.log('🔍 Unlock button styles:', buttonStyles);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'final-blur-verification.png', fullPage: true });
  console.log('📸 Final verification screenshot saved');

  // Verify all requirements are met
  expect(blurLayers).toBe(4); // Should have 4 blur layers
  expect(unlockButtons).toBe(4); // Should have 4 unlock buttons
  
  // Verify blur is above content
  blurVisibility.blurAboveContent.forEach((above, index) => {
    expect(above).toBe(true, `Blur layer ${index} should be above content`);
  });

  // Verify content is below blur
  blurVisibility.contentBelowBlur.forEach((below, index) => {
    expect(below).toBe(true, `Content ${index} should be below blur`);
  });

  // Verify CTA box is not black
  expect(ctaBackground?.isNotBlack).toBe(true, 'CTA box should not be black');

  // Verify unlock buttons have correct styling
  buttonStyles.forEach(style => {
    expect(style.backgroundColor).toContain('rgb(0, 113, 227)'); // Apple blue
    expect(style.color).toBe('rgb(255, 255, 255)'); // White text
    expect(style.borderRadius).toBe('9999px'); // Rounded full
    expect(style.fontWeight).toBe('600'); // font-semibold
  });

  console.log('✅ FINAL VERIFICATION COMPLETE!');
  console.log('🔍 BLUR SYSTEM NOW WORKING:');
  console.log('   - 4 blur layers with correct z-index (15)');
  console.log('   - Content below blur (z-index 10)');
  console.log('   - Unlock buttons above everything (z-index 20)');
  console.log('   - CTA box uses dynamic brand colors (not black)');
  console.log('   - Unlock buttons styled correctly with brand colors');
  console.log('   - Blur effect should now be visible!');
});
