import { test, expect } from '@playwright/test';

test('Final verification - DPA link and email icon', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Test DPA link in footer
  const dpaLink = page.locator('footer a[href="/dpa"]');
  await expect(dpaLink).toBeVisible();
  await dpaLink.click();

  // Check that we're on DPA page
  await expect(page).toHaveURL('http://localhost:3000/dpa');

  // Check DPA page content
  await expect(page.locator('h1.text-4xl.font-black.text-gray-900.mb-8.text-center')).toHaveText('Data Processing Agreement (DPA)');
  
  // Check that "Back to Home" link exists
  await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();

  // Navigate to support page
  await page.goto('http://localhost:3000/support');
  await page.waitForLoadState('networkidle');

  // Check that email support section exists
  const emailSupportSection = page.locator('div:has-text("Email Support")').first();
  await expect(emailSupportSection).toBeVisible();

  // Check that email icon exists
  const emailIcon = emailSupportSection.locator('svg').first();
  await expect(emailIcon).toBeVisible();

  // Check that "Back to Home" link exists
  await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();

  console.log('✅ DPA link and email icon are working correctly!');
  
  // Keep browser open for visual inspection
  await page.waitForTimeout(10000);
});
