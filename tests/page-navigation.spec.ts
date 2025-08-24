import { test, expect } from '@playwright/test';

test('Page Navigation Test', async ({ page }) => {
  console.log('🌐 Testing page navigation...');
  
  // Start at home page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  console.log('✅ Home page loaded');
  
  // Test navigation to pricing page
  await page.click('a[href="/pricing"]');
  await page.waitForLoadState('networkidle');
  console.log('✅ Navigated to pricing page');
  
  // Verify pricing page content - look for the main page title
  const pricingTitle = await page.locator('h1:has-text("Simple, Transparent")').textContent();
  console.log('📄 Pricing page title:', pricingTitle);
  
  // Go back to home by clicking the logo/brand section
  await page.click('header h1');
  await page.waitForLoadState('networkidle');
  console.log('✅ Back to home page');
  
  // Test navigation to report page
  await page.click('a[href="/report"]');
  await page.waitForLoadState('networkidle');
  console.log('✅ Navigated to report page');
  
  // Verify report page content - look for the main page title
  const reportTitle = await page.locator('h1:has-text("Solar Intelligence Report")').textContent();
  console.log('📄 Report page title:', reportTitle);
  
  console.log('🎉 All navigation tests passed!');
});
