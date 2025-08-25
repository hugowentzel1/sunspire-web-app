import { test, expect } from '@playwright/test';

test('Header Text Verification - Should Match c548b88 Exactly', async ({ page }) => {
  console.log('🎯 Verifying header text matches c548b88 exactly...');

  // Navigate to report page with Apple branding
  await page.goto('http://localhost:3001/report?demo=1&company=Apple&primary=%230071E3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('✅ Report page loaded with Apple branding');

  // Check the main title (should be "New Analysis" not "Solar Intelligence Report")
  const mainTitle = await page.locator('h1.text-4xl').textContent();
  console.log('🔍 Main title:', mainTitle);

  // Check the subtitle (should be dynamic address, not hardcoded)
  const subtitle = await page.locator('h1 + div p.text-xl').textContent();
  console.log('🔍 Subtitle:', subtitle);

  // Check the data source info (should be dynamic, not hardcoded)
  const dataSourceInfo = await page.locator('h1 + div .text-sm.text-gray-500').textContent();
  console.log('🔍 Data source info:', dataSourceInfo);

  // Check if unwanted elements are removed
  const putThisOnSiteButton = await page.locator('text=Put this on our site').count();
  const copyDemoLinkButton = await page.locator('text=Copy demo link').count();
  const dataSourcesText = await page.locator('text=Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted').count();
  const whiteLabelBanner = await page.locator('text=ready-to-embed, white-label quote tool').count();

  console.log('🔍 Unwanted elements check:');
  console.log('  - "Put this on our site" button:', putThisOnSiteButton);
  console.log('  - "Copy demo link" button:', copyDemoLinkButton);
  console.log('  - "Data sources: PVWatts..." text:', dataSourcesText);
  console.log('  - White-label banner:', whiteLabelBanner);

  // Check if logo is dynamic (should show Apple logo when company=Apple)
  const logoImage = await page.locator('img[alt*="logo"]').count();
  const logoAlt = await page.locator('img[alt*="logo"]').getAttribute('alt');
  console.log('🔍 Logo check:');
  console.log('  - Logo image count:', logoImage);
  console.log('  - Logo alt text:', logoAlt);

  // Take screenshot for visual verification
  await page.screenshot({ path: 'header-text-verification.png', fullPage: false });
  console.log('📸 Header text verification screenshot saved');

  // Verify all requirements are met
  expect(mainTitle).toBe('New Analysis', 'Main title should be "New Analysis" (not "Solar Intelligence Report")');
  expect(subtitle).toContain('Comprehensive analysis for your property at', 'Subtitle should contain the correct text');
  expect(subtitle).not.toContain('123 N Central Ave, Phoenix, AZ', 'Subtitle should not contain hardcoded address');
  expect(dataSourceInfo).toContain('Data Source:', 'Data source info should contain "Data Source:"');
  expect(dataSourceInfo).toContain('Generated on', 'Data source info should contain "Generated on"');

  // Verify unwanted elements are removed
  expect(putThisOnSiteButton).toBe(0, '"Put this on our site" button should be removed');
  expect(copyDemoLinkButton).toBe(0, '"Copy demo link" button should be removed');
  expect(dataSourcesText).toBe(0, 'Data sources text should be removed');
  expect(whiteLabelBanner).toBe(0, 'White-label banner should be removed');

  // Verify logo is dynamic
  expect(logoImage).toBeGreaterThan(0, 'Logo image should be present');
  expect(logoAlt).toContain('Apple logo', 'Logo alt text should contain company name');

  console.log('✅ HEADER TEXT VERIFICATION COMPLETE!');
  console.log('🔍 HEADER NOW MATCHES c548b88 EXACTLY:');
  console.log('   - Title: "New Analysis" (not "Solar Intelligence Report")');
  console.log('   - Subtitle: Dynamic address from estimate (not hardcoded)');
  console.log('   - Data info: Dynamic source and date (not hardcoded)');
  console.log('   - Logo: Dynamic company logo (not hardcoded)');
  console.log('   - Unwanted elements: All removed');
});
