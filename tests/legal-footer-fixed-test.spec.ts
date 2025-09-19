import { test, expect } from '@playwright/test';

test('Legal pages should have correct footer for paid version', async ({ page }) => {
  // Test privacy page with paid version - use encoded URL
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&brandColor=%23FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for brand state to load
  await page.waitForTimeout(3000);
  
  // Check that footer shows company name
  const companyName = page.locator('text=Apple');
  await expect(companyName).toBeVisible();
  console.log('✅ Privacy page shows company name');
  
  // Check that footer shows logo
  const logo = page.locator('img[src*="logo.clearbit.com/apple.com"]');
  await expect(logo).toBeVisible();
  console.log('✅ Privacy page shows company logo');
  
  // Check that footer shows "Powered by Sunspire"
  const poweredBy = page.locator('text=Powered by Sunspire');
  await expect(poweredBy).toBeVisible();
  console.log('✅ Privacy page shows Powered by Sunspire');
  
  // Test terms page with paid version
  await page.goto('https://sunspire-web-app.vercel.app/terms?company=Apple&brandColor=%23FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Check that footer shows company name and logo
  const termsCompanyName = page.locator('text=Apple');
  await expect(termsCompanyName).toBeVisible();
  console.log('✅ Terms page shows company name');
  
  const termsLogo = page.locator('img[src*="logo.clearbit.com/apple.com"]');
  await expect(termsLogo).toBeVisible();
  console.log('✅ Terms page shows company logo');
  
  // Test that demo version doesn't show company logo in footer
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Demo version should not show company logo in footer
  const demoLogo = page.locator('img[src*="logo.clearbit.com/apple.com"]');
  await expect(demoLogo).not.toBeVisible();
  console.log('✅ Demo version privacy page does not show company logo (correct)');
});


