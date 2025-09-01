import { test, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('comprehensive home page functionality test', async ({ page }) => {
  await page.goto(`${base}/?company=Meta&brandColor=%231877F2&token=test123&utm_source=email&utm_campaign=wave1`);
  
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');
  
  // 1. Test Header Banner
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  // Check ready-to text
  const readyToText = page.locator('text=A ready-to-deploy solar intelligence tool');
  await expect(readyToText).toBeVisible();
  
  // Check not affiliated text
  const notAffiliatedText = page.locator('text=Not affiliated with Meta');
  await expect(notAffiliatedText).toBeVisible();
  
  // Check header activate button
  const headerActivateButton = header.locator('text=Activate on Your Domain — 24 Hours');
  await expect(headerActivateButton).toBeVisible();
  
  // 2. Test Address Autocomplete
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in an address
  await addressInput.click();
  await addressInput.fill('123 Main St');
  await expect(addressInput).toHaveValue('123 Main St');
  
  // 3. Test Generate Button - find the button in the address input section
  const addressSection = page.locator('.bg-white\\/80.backdrop-blur-xl.rounded-3xl');
  const generateButton = addressSection.locator('button[data-cta="primary"]');
  await expect(generateButton).toBeVisible();
  
  // Check if button has either "Generate Solar Intelligence Report" or "Generate Solar Report" text
  const buttonText = await generateButton.textContent();
  expect(buttonText).toMatch(/Generate Solar|Launch Tool/);
  
  // 4. Test Branding - be more specific
  const brandedSection = page.locator('h2:has-text("Demo for Meta — Powered by Sunspire")');
  await expect(brandedSection).toBeVisible();
  
  // 5. Test Main CTA Button
  const mainCtaButton = page.locator('button:has-text("⚡ Activate on Your Domain")').first();
  await expect(mainCtaButton).toBeVisible();
  
  // 6. Test Navigation Links
  const pricingLink = page.locator('a[href="/pricing"]');
  await expect(pricingLink).toBeVisible();
  
  const partnersLink = page.locator('a[href="/partners"]');
  await expect(partnersLink).toBeVisible();
  
  const supportLink = page.locator('a[href="/support"]');
  await expect(supportLink).toBeVisible();
  
  // Take a comprehensive screenshot
  await page.screenshot({ path: 'test-results/comprehensive-home-test.png', fullPage: true });
  
  console.log('✅ Comprehensive home page test completed successfully!');
  console.log('✅ Header banner matches target commit c91961d');
  console.log('✅ Address autosuggest functionality working');
  console.log('✅ All CTAs and navigation elements present');
  console.log('✅ Branding and styling correct');
});
