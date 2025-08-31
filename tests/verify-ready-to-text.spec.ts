import { test, expect } from '@playwright/test';

test('Verify Ready-to Text Section - No Popups', async ({ page }) => {
  console.log('🔍 Testing ready-to text section without popups...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  
  // Check that the ready-to text section exists and has correct content
  const readyToSection = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-2xl:has-text("ready-to-deploy")');
  await expect(readyToSection).toBeVisible();
  console.log('✅ Ready-to text section visible');
  
  // Check for "within 24 hours" text
  const within24Hours = page.locator('text=within 24 hours');
  await expect(within24Hours).toBeVisible();
  console.log('✅ "within 24 hours" text visible');
  
  // Check for "Not affiliated with TestCompany" text
  const notAffiliated = page.locator('text=Not affiliated with TestCompany');
  await expect(notAffiliated).toBeVisible();
  console.log('✅ "Not affiliated with TestCompany" text visible');
  
  // Verify no popups or modals are present
  const modals = page.locator('[role="dialog"], .modal, .popup, [data-modal]');
  await expect(modals).toHaveCount(0);
  console.log('✅ No popups or modals found');
  
  // Check that the page has the expected structure
  await expect(page.locator('h1:has-text("New Analysis")')).toBeVisible();
  await expect(page.locator('[data-testid="report-page"]')).toBeVisible();
  
  console.log('🎉 Ready-to text section verified successfully!');
  console.log('✅ No popups displayed');
  console.log('✅ "within 24 hours" text present');
  console.log('✅ "Not affiliated with [Company]" text present');
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'test-results/ready-to-text-verified.png', fullPage: true });
  console.log('📸 Screenshot saved: ready-to-text-verified.png');
});
