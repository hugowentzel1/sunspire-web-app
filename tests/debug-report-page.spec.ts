import { test, expect } from '@playwright/test';

test('Debug report page - see what is actually there', async ({ page }) => {
  console.log('🚀 Starting report page debug...');
  
  // Go to report page
  console.log('📊 Going to report page...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  
  // Wait a bit for any redirects or loading
  await page.waitForTimeout(5000);
  
  // Take screenshot of what we see
  await page.screenshot({ path: 'test-results/debug-report-page.png', fullPage: true });
  console.log('📸 Full page screenshot saved');
  
  // Check what's actually in the HTML
  const bodyText = await page.textContent('body');
  console.log('📄 Body text (first 500 chars):', bodyText?.substring(0, 500));
  
  // Check if there are any elements
  const allElements = await page.locator('*').count();
  console.log(`🔍 Total elements on page: ${allElements}`);
  
  // Check for specific elements
  const headerCount = await page.locator('header').count();
  const mainCount = await page.locator('main').count();
  const divCount = await page.locator('div').count();
  
  console.log(`🏷️ Headers: ${headerCount}, Mains: ${mainCount}, Divs: ${divCount}`);
  
  // Check for any error messages
  const errorElements = await page.locator('[class*="error"], [class*="Error"], [class*="loading"], [class*="Loading"]').count();
  console.log(`⚠️ Error/Loading elements: ${errorElements}`);
  
  // Check the current URL
  const currentUrl = page.url();
  console.log(`📍 Current URL: ${currentUrl}`);
  
  console.log('✅ Debug complete!');
});
