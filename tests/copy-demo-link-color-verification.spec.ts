import { test, expect } from '@playwright/test';

test('Copy Demo Link Button Color Verification - Should Use Company Color', async ({ page }) => {
  console.log('🎯 Verifying Copy Demo Link button uses company color...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3001/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check the Copy Demo Link button colors
  const copyButtonColors = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const copyButton = Array.from(buttons).find(button => 
      button.textContent?.includes('📋 Copy Demo Link')
    );
    if (!copyButton) return null;
    
    const styles = window.getComputedStyle(copyButton);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      isCompanyColor: styles.backgroundColor.includes('rgb(0, 113, 227)'), // Apple blue
      hasBrandVar: styles.backgroundColor.includes('var(--brand)')
    };
  });
  console.log('🔍 Copy Demo Link button colors:', copyButtonColors);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'copy-demo-link-color-verification.png', fullPage: false });
  console.log('📸 Copy Demo Link color verification screenshot saved');

  // Verify the button uses company colors
  expect(copyButtonColors?.isCompanyColor).toBe(true, 'Copy Demo Link button should use Apple blue color');
  expect(copyButtonColors?.color).toBe('rgb(255, 255, 255)', 'Copy Demo Link button text should be white');

  console.log('✅ COPY DEMO LINK COLOR VERIFICATION COMPLETE!');
  console.log('🔍 BUTTON NOW USES COMPANY COLORS:');
  console.log('   - Background: Company color (Apple blue)');
  console.log('   - Text: White for good contrast');
  console.log('   - Styling: Consistent with brand theme');
});
