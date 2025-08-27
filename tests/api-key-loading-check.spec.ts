import { test, expect } from '@playwright/test';

test('Google Maps API Key Loading Check', async ({ page }) => {
  console.log('🔍 Checking if Google Maps API key is being loaded correctly...');

  // Navigate to the main page
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('✅ Main page loaded');

  // Check if the API key warning is displayed
  const hasWarning = await page.locator('.bg-yellow-50').count();
  console.log('🔍 API key warning count:', hasWarning);

  // Check if the warning text is present
  const hasWarningText = await page.locator('text=Google Maps key missing').count();
  console.log('🔍 Warning text count:', hasWarningText);

  // Check if the address input field is present
  const hasAddressInput = await page.locator('input[placeholder*="address"]').count();
  console.log('🔍 Address input field count:', hasAddressInput);

  // Check the page content for clues
  const pageContent = await page.content();
  const hasGoogleMapsError = pageContent.includes('Google Maps') && pageContent.includes('error');
  const hasPlacesError = pageContent.includes('Places') && pageContent.includes('error');
  const hasApiError = pageContent.includes('API') && pageContent.includes('error');
  const hasKeyMissing = pageContent.includes('key missing');
  
  console.log('🔍 Page content analysis:');
  console.log('  - Has Google Maps error:', hasGoogleMapsError);
  console.log('  - Has Places error:', hasPlacesError);
  console.log('  - Has API error:', hasApiError);
  console.log('  - Has key missing text:', hasKeyMissing);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'api-key-loading-check.png', fullPage: false });
  console.log('📸 API key loading check screenshot saved');

  // Log findings
  console.log('🔍 FINDINGS:');
  if (hasWarning > 0) {
    console.log('  ❌ Component shows API key warning');
    console.log('  🔧 POSSIBLE SOLUTIONS:');
    console.log('    1. Check if Places API is enabled in Google Cloud Console');
    console.log('    2. Verify API key has correct permissions');
    console.log('    3. Ensure billing is enabled for the project');
    console.log('    4. Check if API key has referrer restrictions');
  } else if (hasAddressInput > 0) {
    console.log('  ✅ Address input field is present');
    console.log('  ✅ API key appears to be working');
  } else {
    console.log('  ❓ Component not rendering - check for other errors');
  }

  // Basic expectations
  if (hasWarning > 0) {
    console.log('⚠️  ISSUE IDENTIFIED: Google Maps API key warning is showing');
    console.log('   - Despite having API key in Vercel environment');
    console.log('   - This suggests an API configuration issue, not missing key');
  }
});
