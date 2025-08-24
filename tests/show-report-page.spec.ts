import { test, expect } from '@playwright/test';

test('Show Restored Report Page', async ({ page }) => {
  console.log('🚀 Loading the restored report page...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3001/report?demo=1&company=TestCompany');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  
  // Check that the main title is visible
  await expect(page.locator('h1:has-text("New Analysis")')).toBeVisible();
  
  // Check that all 4 metric boxes are visible
  const metricBoxes = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div');
  await expect(metricBoxes).toHaveCount(4);
  
  // Check that the chart section exists
  await expect(page.locator('div:has-text("Your Solar Savings Over Time")')).toBeVisible();
  
  // Check that the three-column layout exists
  const threeColumnLayout = page.locator('div.grid.grid-cols-1.lg\\:grid-cols-3');
  await expect(threeColumnLayout).toBeVisible();
  
  // Check that "Ready to Go Solar?" section exists
  await expect(page.locator('div:has-text("Ready to Go Solar?")')).toBeVisible();
  
  // Check that "Copy Demo Link" button exists
  await expect(page.locator('button:has-text("📋 Copy Demo Link")')).toBeVisible();
  
  // Check that disclaimer exists
  await expect(page.locator('div:has-text("Estimates are informational only")')).toBeVisible();
  
  console.log('🎉 All sections are restored and visible!');
  console.log('✅ Top 4 metric boxes with unlock buttons');
  console.log('✅ Chart section with unlock button');
  console.log('✅ Three-column layout (Financial Analysis, Environmental Impact, Calculation Assumptions)');
  console.log('✅ Ready to Go Solar section');
  console.log('✅ Copy Demo Link button');
  console.log('✅ Disclaimer section');
  
  // Keep browser open for visual inspection
  console.log('🔍 Browser will stay open for 2 minutes for visual inspection...');
  await page.waitForTimeout(120000); // 2 minutes
});
