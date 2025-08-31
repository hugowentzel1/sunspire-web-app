import { test, expect } from '@playwright/test';

test('Simple Show Report Page', async ({ page }) => {
  console.log('📊 Loading report page to show current state...');
  await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded!');
  console.log('🔍 Check the page visually for 2 minutes...');
  console.log('Expected elements:');
  console.log('- Top 4 metric boxes with blur overlays and unlock buttons');
  console.log('- Chart section with unlock button');
  console.log('- Three-column layout with Financial Analysis (unblurred), Environmental Impact (blurred), Calculation Assumptions (unblurred)');
  console.log('- "Ready to Go Solar?" section');
  console.log('- "Copy Demo Link" button');
  console.log('- Disclaimer section');
  
  await page.waitForTimeout(120000); // 2 minutes
});
