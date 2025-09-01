import { test, expect } from '@playwright/test';

test('Debug Report Page - See What\'s Actually There', async ({ page }) => {
  console.log('🔍 Debugging report page...');
  
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take a screenshot to see what's there
  await page.screenshot({ path: 'debug-report-page.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-report-page.png');
  
  // Check what text is actually on the page
  const pageText = await page.textContent('body');
  console.log('📄 Page text:', pageText?.substring(0, 500));
  
  // Check if there are any h2 elements
  const h2Elements = await page.locator('h2').count();
  console.log(`🔍 Found ${h2Elements} h2 elements`);
  
  // List all h2 elements
  for (let i = 0; i < h2Elements; i++) {
    const h2Text = await page.locator('h2').nth(i).textContent();
    console.log(`H2 ${i}: ${h2Text}`);
  }
  
  // Check if the address input section exists
  const addressSection = page.locator('h2:has-text("Enter Your Property Address")');
  const hasAddressSection = await addressSection.count();
  console.log(`🔍 Address section found: ${hasAddressSection > 0}`);
  
  // Check if there are any input fields
  const inputFields = await page.locator('input').count();
  console.log(`🔍 Found ${inputFields} input fields`);
  
  // List all input placeholders
  for (let i = 0; i < inputFields; i++) {
    const placeholder = await page.locator('input').nth(i).getAttribute('placeholder');
    console.log(`Input ${i} placeholder: ${placeholder}`);
  }
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(10000);
});
