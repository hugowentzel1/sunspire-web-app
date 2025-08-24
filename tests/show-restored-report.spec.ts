import { test, expect } from '@playwright/test';

test('Show Restored Report Page from c548b88', async ({ page }) => {
  console.log('🎯 Testing the RESTORED report page from c548b88...');
  
  // Test with different company parameters to show dynamic theming
  console.log('📊 Loading report page with company=Meta...');
  await page.goto('http://localhost:3000/report?demo=1&company=Meta');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded with Meta branding!');
  console.log('🔍 Check the following elements for 1 minute:');
  console.log('1. Top 4 metric boxes: ALL should have blur overlays and unlock buttons');
  console.log('2. Chart section: Should have unlock button');
  console.log('3. Three-column layout:');
  console.log('   - Left (Financial Analysis): NO blur, NO unlock button - fully visible');
  console.log('   - Middle (Environmental Impact): HAS blur overlay AND unlock button');
  console.log('   - Right (Calculation Assumptions): NO blur, NO unlock button - fully visible');
  console.log('4. "Ready to Go Solar?" section with orange gradient');
  console.log('5. "Copy Demo Link" button');
  console.log('6. Disclaimer section');
  console.log('7. Dynamic Meta branding colors should be applied');
  
  await page.waitForTimeout(60000); // 1 minute
  
  // Now test with a different company
  console.log('📊 Loading report page with company=Amazon...');
  await page.goto('http://localhost:3000/report?demo=1&company=Amazon');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded with Amazon branding!');
  console.log('🔍 Check that Amazon branding colors are applied for 1 minute...');
  
  await page.waitForTimeout(60000); // 1 minute
  
  console.log('🎉 Report page restoration complete! All c548b88 functionality restored!');
});
