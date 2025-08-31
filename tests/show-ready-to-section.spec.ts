import { test, expect } from '@playwright/test';

test('Show Ready-to Section - Scrolls to It', async ({ page }) => {
  console.log('🚀 Loading report page and scrolling to ready-to section...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  
  // Verify the ready-to text exists
  const readyToText = page.locator('text=A ready-to-deploy solar intelligence tool');
  await expect(readyToText).toBeVisible();
  console.log('✅ Ready-to text found on page');
  
  // Scroll to the ready-to section using Playwright's built-in scrollIntoView
  await readyToText.scrollIntoViewIfNeeded();
  console.log('✅ Scrolled to ready-to section!');
  
  // Wait a moment for the scroll to complete
  await page.waitForTimeout(1000);
  
  // Take a screenshot to show the ready-to section
  await page.screenshot({ path: 'test-results/ready-to-section-visible.png', fullPage: false });
  console.log('📸 Screenshot of ready-to section saved');
  
  // Verify the text is now visible
  await expect(readyToText).toBeVisible();
  console.log('✅ Ready-to text is now visible in viewport');
  
  // Check for "within 24 hours" text
  await expect(page.locator('text=within 24 hours')).toBeVisible();
  console.log('✅ "within 24 hours" text visible');
  
  // Check for "Not affiliated with TestCompany" text
  await expect(page.locator('text=Not affiliated with TestCompany')).toBeVisible();
  console.log('✅ "Not affiliated with TestCompany" text visible');
  
  console.log('🎉 Ready-to section is now visible!');
  console.log('🔍 You should see:');
  console.log('   - "A ready-to-deploy solar intelligence tool — live on your site within 24 hours"');
  console.log('   - "Not affiliated with TestCompany"');
  console.log('⏰ Browser will stay open for 2 minutes for inspection...');
  
  // Keep browser open for inspection
  await page.waitForTimeout(120000); // 2 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
