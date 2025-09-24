import { test, expect } from '@playwright/test';

test('Test demo functionality with quota system', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  console.log('Testing demo functionality: http://localhost:3000/?company=Apple&demo=1');
  
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { 
    waitUntil: 'networkidle0',
    timeout: 10000 
  });
  
  // Wait for React to hydrate
  await page.waitForTimeout(2000);
  
  // Check if demo quota is displayed
  const quotaText = await page.textContent('text=Preview:');
  console.log('Quota text found:', quotaText);
  
  // Check if address autocomplete is present
  const addressInput = await page.locator('[data-address-input]').count();
  console.log('Address input elements found:', addressInput);
  
  // Check if the generate button is present
  const generateButton = await page.locator('[data-cta-button]').count();
  console.log('Generate button elements found:', generateButton);
  
  // Check if Apple branding is applied
  const appleElements = await page.locator('text=Apple').count();
  console.log('Apple elements found:', appleElements);
  
  // Test address input functionality
  if (addressInput > 0) {
    await page.fill('[data-address-input]', '123 Main St, San Francisco, CA');
    console.log('Address input filled successfully');
    
    // Wait for autocomplete suggestions
    await page.waitForTimeout(1000);
    
    // Check if suggestions appear
    const suggestions = await page.locator('[role="listbox"]').count();
    console.log('Autocomplete suggestions found:', suggestions);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'demo-functionality-test.png', fullPage: true });
  console.log('Screenshot saved as demo-functionality-test.png');
  
  // Verify demo elements are present
  expect(quotaText).toBeTruthy();
  expect(addressInput).toBeGreaterThan(0);
  expect(generateButton).toBeGreaterThan(0);
  expect(appleElements).toBeGreaterThan(0);
});
