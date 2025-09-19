import { test, expect } from '@playwright/test';

test('Demo banners should show on pricing, support, and partners pages', async ({ page }) => {
  // Test pricing page
  await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check for demo banner on pricing page
  const pricingBanner = page.locator('h2:has-text("Demo for Apple — Powered by Sunspire")');
  await expect(pricingBanner).toBeVisible();
  console.log('✅ Pricing page banner visible');
  
  // Test support page
  await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check for demo banner on support page
  const supportBanner = page.locator('h2:has-text("Demo for Apple — Powered by Sunspire")');
  await expect(supportBanner).toBeVisible();
  console.log('✅ Support page banner visible');
  
  // Test partners page
  await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check for demo banner on partners page
  const partnersBanner = page.locator('h2:has-text("Demo for Apple — Powered by Sunspire")');
  await expect(partnersBanner).toBeVisible();
  console.log('✅ Partners page banner visible');
  
  // Test that other pages don't have the banner
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const privacyBanner = page.locator('h2:has-text("Demo for Apple — Powered by Sunspire")');
  await expect(privacyBanner).not.toBeVisible();
  console.log('✅ Privacy page banner not visible (correct)');
});


