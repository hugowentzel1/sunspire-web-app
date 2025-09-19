import { test, expect } from '@playwright/test';

test('Legal pages should have correct footer for paid version with navigation', async ({ page }) => {
  // First go to main page to trigger brand takeover
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Wait for brand takeover to load
  await page.waitForTimeout(3000);
  
  // Check brand state from localStorage
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('Brand state after main page:', brandState);
  
  // Now navigate to privacy page
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
});


