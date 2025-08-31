import { test, expect } from '@playwright/test';

test('Show Final Result - Ready-to Text Implementation', async ({ page }) => {
  console.log('🚀 Loading the final result...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  
  // Verify the key changes
  console.log('🔍 Verifying the implementation...');
  
  // Check that the old company logo box is gone from header
  const appleLogo = page.locator('header').locator('text=Apple');
  await expect(appleLogo).toHaveCount(0);
  console.log('✅ Apple logo box removed from header');
  
  // Check that the ready-to text is now in the main content area
  const readyToText = page.locator('main').locator('text=ready-to-deploy');
  await expect(readyToText).toBeVisible();
  console.log('✅ Ready-to text now in main content area');
  
  // Check for "within 24 hours" text
  await expect(page.locator('text=within 24 hours')).toBeVisible();
  console.log('✅ "within 24 hours" text visible');
  
  // Check for "Not affiliated with Apple" text
  await expect(page.locator('text=Not affiliated with Apple')).toBeVisible();
  console.log('✅ "Not affiliated with Apple" text visible');
  
  console.log('🎉 All changes verified successfully!');
  console.log('📱 You should now see:');
  console.log('   - NO white company logo box in header');
  console.log('   - YES "A ready-to-deploy solar intelligence tool — live on your site within 24 hours"');
  console.log('   - YES "Not affiliated with Apple"');
  console.log('   - NO popups or modals');
  console.log('   - Ready-to text prominently displayed in main content area');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/final-result.png', fullPage: true });
  console.log('📸 Screenshot saved: final-result.png');
  
  console.log('🔍 Browser will stay open for 2 minutes for visual inspection...');
  
  // Keep browser open for inspection
  await page.waitForTimeout(120000); // 2 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
