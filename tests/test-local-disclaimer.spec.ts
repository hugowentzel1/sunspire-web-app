import { test, expect } from '@playwright/test';

test('Test disclaimer styling on local development server', async ({ page }) => {
  console.log('🔍 Testing disclaimer styling on local development server...');
  
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check what disclaimer elements exist
  const disclaimerElements = await page.locator('div:has-text("Private demo for Tesla. Not affiliated.")').count();
  console.log('📊 Disclaimer elements found:', disclaimerElements);
  
  // Check the actual styling of the disclaimer
  const disclaimerDiv = page.locator('div:has-text("Private demo for Tesla. Not affiliated.")').first();
  const disclaimerClasses = await disclaimerDiv.getAttribute('class');
  console.log('🎨 Disclaimer div classes:', disclaimerClasses);
  
  // Check if it has white background
  const hasWhiteBg = disclaimerClasses?.includes('bg-white');
  const hasGrayBg = disclaimerClasses?.includes('bg-gray-50');
  
  console.log('🔍 Background analysis:');
  console.log('  - Has white background (bg-white):', hasWhiteBg);
  console.log('  - Has gray background (bg-gray-50):', hasGrayBg);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'local-disclaimer-styling.png', fullPage: true });
  
  console.log('✅ Local test complete! Check local-disclaimer-styling.png for visual verification');
});
