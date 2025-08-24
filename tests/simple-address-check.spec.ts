import { test, expect } from '@playwright/test';

test('Simple address box check', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:3000');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the address box section exists
  const addressSection = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-3xl.shadow-2xl.border.border-gray-200\\/30.p-8.md\\:p-12.max-w-3xl.mx-auto.section-spacing');
  await expect(addressSection).toBeVisible();
  
  // Check the title
  await expect(addressSection.locator('h2.text-2xl.font-bold.text-gray-900')).toHaveText('Enter Your Property Address');
  
  // Check the description
  await expect(addressSection.locator('p.text-gray-600')).toHaveText('Get a comprehensive solar analysis tailored to your specific location');
  
  // Check that there's an input field (either AddressAutocomplete or placeholder)
  const inputField = addressSection.locator('input, div.h-12.bg-gray-100.rounded-lg.animate-pulse');
  await expect(inputField).toBeVisible();
  
  // Check the helper text
  await expect(addressSection.locator('p.text-sm.text-gray-500.mt-2.text-center')).toHaveText('Enter your property address to get started');
  
  // Check the button
  const button = addressSection.locator('button');
  await expect(button).toBeVisible();
  
  // Check button text (should show "Generate Solar Intelligence Report" when no address)
  await expect(button.locator('span')).toContainText('Generate Solar Intelligence Report');
  
  console.log('✅ Address box is working correctly!');
  
  // Keep browser open for visual inspection
  await page.waitForTimeout(10000);
});
