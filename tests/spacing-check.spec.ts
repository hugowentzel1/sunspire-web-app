import { test, expect } from '@playwright/test';

test('spacing changes - visual verification', async ({ page }) => {
  console.log('🚀 Testing spacing changes...');
  
  await page.goto('http://localhost:3001/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  
  await page.waitForTimeout(5000);
  
  // Wait for elements to be visible
  const backButton = page.locator('[data-testid="back-home-link"]');
  const h1 = page.locator('[data-testid="hdr-h1"]');
  const logo = page.locator('[data-testid="hdr-logo"]');
  const sub = page.locator('[data-testid="hdr-sub"]');
  const address = page.locator('[data-testid="hdr-address"]');
  const meta = page.locator('[data-testid="hdr-meta"]');
  
  await expect(backButton).toBeVisible();
  await expect(h1).toBeVisible();
  await expect(logo).toBeVisible();
  await expect(sub).toBeVisible();
  await expect(address).toBeVisible();
  await expect(meta).toBeVisible();
  
  console.log('✅ All elements visible');
  
  // Get bounding boxes
  const backBox = await backButton.boundingBox();
  const h1Box = await h1.boundingBox();
  const logoBox = await logo.boundingBox();
  const subBox = await sub.boundingBox();
  const addressBox = await address.boundingBox();
  const metaBox = await meta.boundingBox();
  
  // Calculate gaps
  const backToH1Gap = h1Box!.y - (backBox!.y + backBox!.height);
  const h1ToLogoGap = logoBox!.y - (h1Box!.y + h1Box!.height);
  const logoToSubGap = subBox!.y - (logoBox!.y + logoBox!.height);
  const subToAddressGap = addressBox!.y - (subBox!.y + subBox!.height);
  const addressToMetaGap = metaBox!.y - (addressBox!.y + addressBox!.height);
  
  console.log('📏 Spacing measurements:');
  console.log(`  Back to H1: ${backToH1Gap.toFixed(1)}px (target: ~40-48px, decreased from previous)`);
  console.log(`  H1 to Logo: ${h1ToLogoGap.toFixed(1)}px (target: ~32px, increased from 24px)`);
  console.log(`  Logo to Sub: ${logoToSubGap.toFixed(1)}px (target: ~16px)`);
  console.log(`  Sub to Address: ${subToAddressGap.toFixed(1)}px (target: ~8px)`);
  console.log(`  Address to Meta: ${addressToMetaGap.toFixed(1)}px (target: ~16px)`);
  
  // Verify spacing (with tolerance)
  expect(h1ToLogoGap).toBeGreaterThanOrEqual(28); // mt-8 = 32px, allow some tolerance
  expect(h1ToLogoGap).toBeLessThanOrEqual(36);
  
  expect(logoToSubGap).toBeGreaterThanOrEqual(12); // mt-4 = 16px
  expect(logoToSubGap).toBeLessThanOrEqual(20);
  
  expect(subToAddressGap).toBeGreaterThanOrEqual(4); // mt-2 = 8px
  expect(subToAddressGap).toBeLessThanOrEqual(12);
  
  expect(addressToMetaGap).toBeGreaterThanOrEqual(12); // mt-4 = 16px  
  expect(addressToMetaGap).toBeLessThanOrEqual(20);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/spacing-final.png', fullPage: true });
  console.log('📸 Screenshot saved to test-results/spacing-final.png');
  
  console.log('✅ All spacing checks passed!');
});

