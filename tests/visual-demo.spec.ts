import { test, expect } from '@playwright/test';

test('Visual Demo - Show New Pages and Changes', async ({ page }) => {
  // Navigate to main page to show hero text changes
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded - showing updated hero text');
  await page.waitForTimeout(3000); // Stay on page for 3 seconds
  
  // Navigate to partners page
  await page.goto('http://localhost:3001/partners');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Partners page loaded - showing partner program');
  await page.waitForTimeout(3000); // Stay on page for 3 seconds
  
  // Navigate to support page
  await page.goto('http://localhost:3001/support');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Support page loaded - showing support center');
  await page.waitForTimeout(3000); // Stay on page for 3 seconds
  
  // Navigate to privacy page
  await page.goto('http://localhost:3001/privacy');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Privacy page loaded - showing privacy policy');
  await page.waitForTimeout(3000); // Stay on page for 3 seconds
  
  // Navigate to pricing page
  await page.goto('http://localhost:3001/pricing');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Pricing page loaded - showing $399 + $99/month pricing');
  await page.waitForTimeout(3000); // Stay on page for 3 seconds
  
  // Go back to main page to show footer changes
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Back to main page - showing updated footer with compliance badges');
  await page.waitForTimeout(5000); // Stay on main page for 5 seconds to show footer
  
  console.log('🎉 Visual demo completed! All new pages and changes have been shown.');
});
