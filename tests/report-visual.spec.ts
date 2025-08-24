import { test, expect } from '@playwright/test';

test('report page visual inspection - keep open', async ({ page }) => {
  // Navigate to the report page with Apple branding
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot to verify the page loaded
  await page.screenshot({ path: 'report-apple.png', fullPage: true });
  
  console.log('✅ Report page loaded successfully!');
  console.log('🔍 Browser will stay open for visual inspection...');
  console.log('📱 Check the screenshot: report-apple.png');
  
  // Keep the page open for 30 seconds so you can see it
  await page.waitForTimeout(30000);
  
  // Verify key elements are present
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-testid*="tile-"]')).toHaveCount(4);
  
  console.log('✅ All elements verified!');
});
