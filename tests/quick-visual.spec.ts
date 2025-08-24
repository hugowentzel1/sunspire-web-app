import { test, expect } from '@playwright/test';

test('Quick Visual Check - Show Main Page', async ({ page }) => {
  console.log('🌐 Opening main page for visual inspection...');
  
  // Go to home page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait a bit for everything to render
  await page.waitForTimeout(3000);
  
  console.log('✅ Main page loaded! Browser should be open for visual inspection.');
  console.log('🔍 You can now see the page and verify:');
  console.log('   - No motion animations');
  console.log('   - Clean, modern design');
  console.log('   - Working navigation');
  console.log('   - Address input functionality');
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'test-results/main-page-visual-check.png', fullPage: true });
  console.log('📸 Screenshot saved to test-results/main-page-visual-check.png');
  
  // Keep browser open for a shorter time
  await page.waitForTimeout(10000); // 10 seconds
});
