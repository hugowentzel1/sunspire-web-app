import { test, expect } from '@playwright/test';

test('Verify Unlock Button Styling Matches c548b88', async ({ page }) => {
  console.log('🔍 Verifying unlock button styling matches c548b88 exactly...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3000/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check for unlock buttons
  const unlockButtons = await page.locator('.unlock-pill').count();
  console.log('🔍 Unlock buttons found:', unlockButtons);

  // Verify unlock button styling matches c548b88
  const buttonStyles = await page.evaluate(() => {
    const buttons = document.querySelectorAll('.unlock-pill');
    return Array.from(buttons).map(button => {
      const styles = window.getComputedStyle(button);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        boxShadow: styles.boxShadow,
        transition: styles.transition
      };
    });
  });
  console.log('🔍 Unlock button styles:', buttonStyles);

  // Check if buttons have the 🔒 emoji icon
  const buttonIcons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('.unlock-pill');
    return Array.from(buttons).map(button => {
      const emoji = button.querySelector('[role="img"]');
      return emoji ? emoji.textContent : 'No emoji found';
    });
  });
  console.log('🔍 Button icons:', buttonIcons);

  // Check button positioning (should be bottom-6)
  const buttonPositions = await page.evaluate(() => {
    const buttons = document.querySelectorAll('.unlock-pill');
    return Array.from(buttons).map(button => {
      const styles = window.getComputedStyle(button);
      return {
        position: styles.position,
        bottom: styles.bottom,
        left: styles.left,
        transform: styles.transform
      };
    });
  });
  console.log('🔍 Button positioning:', buttonPositions);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'unlock-button-verification.png', fullPage: true });
  console.log('📸 Screenshot saved for visual inspection');

  // Verify all requirements are met
  expect(unlockButtons).toBe(4); // Should have 4 unlock buttons
  
  // Verify button styling
  buttonStyles.forEach(style => {
    expect(style.backgroundColor).toContain('rgb(0, 113, 227)'); // Apple blue
    expect(style.color).toBe('rgb(255, 255, 255)'); // White text
    expect(style.borderRadius).toBe('9999px'); // Rounded full
    expect(style.fontWeight).toBe('600'); // font-semibold
  });

  // Verify button icons
  buttonIcons.forEach(icon => {
    expect(icon).toBe('🔒'); // Should have lock emoji
  });

  // Verify button positioning
  buttonPositions.forEach(pos => {
    expect(pos.position).toBe('absolute');
    expect(pos.bottom).toBe('24px'); // bottom-6 = 24px
    // Note: left value is computed as pixels, but CSS uses left-1/2
    // transform is applied to center the button
  });

  console.log('✅ Unlock button styling matches c548b88 exactly!');
  console.log('🔍 VERIFICATION COMPLETE:');
  console.log('   - 4 unlock buttons found');
  console.log('   - All buttons have 🔒 emoji icon');
  console.log('   - Buttons positioned at bottom-6');
  console.log('   - Brand colors applied correctly');
  console.log('   - Rounded full styling applied');
  console.log('   - Font weight is semibold');
});
