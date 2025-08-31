import { test, expect } from '@playwright/test';

test('Simple Show Page - Current State', async ({ page }) => {
  console.log('🚀 Loading the report page to show current state...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  
  // Take a screenshot to see current state
  await page.screenshot({ path: 'test-results/current-page-state.png', fullPage: true });
  console.log('📸 Screenshot saved: current-page-state.png');
  
  // Get all text content to see what's actually there
  const bodyText = await page.textContent('body');
  console.log('📄 Body text (first 1000 chars):', bodyText?.substring(0, 1000));
  
  // Check what's in the header
  const headerText = await page.locator('header').textContent();
  console.log('📄 Header text:', headerText);
  
  // Check if ready-to text exists anywhere
  const readyToText = page.locator('text=ready-to-deploy');
  const readyToCount = await readyToText.count();
  console.log(`🔍 "ready-to-deploy" text elements found: ${readyToCount}`);
  
  // Check if "within 24 hours" exists
  const hoursText = page.locator('text=within 24 hours');
  const hoursCount = await hoursText.count();
  console.log(`🔍 "within 24 hours" text elements found: ${hoursCount}`);
  
  console.log('🔍 Browser will stay open for 2 minutes for visual inspection...');
  console.log('📱 You can see what the page currently looks like');
  
  // Keep browser open for inspection
  await page.waitForTimeout(120000); // 2 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
