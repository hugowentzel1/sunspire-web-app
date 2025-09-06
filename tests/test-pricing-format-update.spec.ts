import { test, expect } from '@playwright/test';

test('Verify pricing format shows $99/mo + $399 setup', async ({ page }) => {
  console.log('🔍 Testing pricing format updates...');
  
  // Test home page pricing
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check home page pricing text
  const homePricing = page.locator('text=No call required. $99/mo + $399 setup');
  await expect(homePricing).toBeVisible();
  console.log('✅ Home page pricing format correct');
  
  // Test pricing page
  await page.goto('https://sunspire-web-app.vercel.app/pricing');
  await page.waitForLoadState('networkidle');
  
  // Check pricing page main price
  const mainPrice = page.locator('h2:has-text("$99/mo + $399 setup")');
  await expect(mainPrice).toBeVisible();
  console.log('✅ Pricing page main price format correct');
  
  // Test signup page
  await page.goto('https://sunspire-web-app.vercel.app/signup');
  await page.waitForLoadState('networkidle');
  
  // Check signup page pricing text
  const signupPricing = page.locator('text=No call required. $99/mo + $399 setup');
  await expect(signupPricing).toBeVisible();
  console.log('✅ Signup page pricing format correct');
  
  // Test report page pricing
  await page.goto('https://sunspire-web-app.vercel.app/report?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check report page pricing text
  const reportPricing = page.locator('text=Full version from just $99/mo + $399 setup');
  await expect(reportPricing).toBeVisible();
  console.log('✅ Report page pricing format correct');
  
  // Check CTA buttons
  const unlockButton = page.locator('button:has-text("Unlock Full Report - $99/mo + $399")');
  await expect(unlockButton).toBeVisible();
  console.log('✅ Unlock button pricing format correct');
  
  const activateButton = page.locator('button:has-text("Activate on Your Domain - $99/mo + $399")');
  await expect(activateButton).toBeVisible();
  console.log('✅ Activate button pricing format correct');
  
  console.log('🎉 All pricing formats updated successfully!');
  console.log('💰 All instances now show: $99/mo + $399 setup');
  
  // Take a screenshot
  await page.screenshot({ path: 'pricing-format-verification.png' });
  console.log('📸 Screenshot saved as pricing-format-verification.png');
});
