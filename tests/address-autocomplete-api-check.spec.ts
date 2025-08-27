import { test, expect } from '@playwright/test';

test('Address Autocomplete API Check - Should Show Missing API Key Warning', async ({ page }) => {
  console.log('🎯 Checking if Google Maps API key is missing...');

  // Navigate to the main page
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Main page loaded');

  // Check if the missing API key warning is displayed
  const missingKeyWarning = await page.locator('text=Google Maps key missing').count();
  console.log('🔍 Missing API key warning count:', missingKeyWarning);

  // Check if the AddressAutocomplete component is showing the warning
  const warningText = await page.locator('text=Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your env and redeploy').count();
  console.log('🔍 Warning text count:', warningText);

  // Check if there are any console errors related to Google Maps
  const consoleErrors = await page.evaluate(() => {
    // This would capture console errors, but we can't access them directly in Playwright
    // Instead, let's check if the warning element exists
    return {
      hasWarning: !!document.querySelector('text=Google Maps key missing'),
      hasWarningCode: !!document.querySelector('code'),
      hasYellowWarning: !!document.querySelector('.bg-yellow-50')
    };
  });
  console.log('🔍 Console error check:', consoleErrors);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'address-autocomplete-api-check.png', fullPage: false });
  console.log('📸 Address autocomplete API check screenshot saved');

  // Verify the warning is displayed
  expect(missingKeyWarning).toBeGreaterThan(0, 'Should show Google Maps key missing warning');
  expect(warningText).toBeGreaterThan(0, 'Should show instructions to set API key');

  console.log('✅ ADDRESS AUTOCOMPLETE API CHECK COMPLETE!');
  console.log('🔍 ISSUE IDENTIFIED:');
  console.log('   - Google Maps API key is missing');
  console.log('   - Component shows warning instead of working');
  console.log('   - Need to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable');
  console.log('   - API key requires Places API and Maps JavaScript API to be enabled');
});
