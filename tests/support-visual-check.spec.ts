import { test, expect } from '@playwright/test';

test.describe('Support Page Visual Verification', () => {
  test('Take Screenshot to Verify Support Page Updates', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Wait for any dynamic content
    await page.waitForTimeout(2000);
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'support-final-visual-check.png', fullPage: true });
    
    console.log('Support page screenshot taken for visual verification');
  });
});
