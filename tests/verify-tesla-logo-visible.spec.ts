import { test, expect } from '@playwright/test';

test('Verify Tesla logo is visible on report page', async ({ page }) => {
  console.log('🔍 Verifying Tesla logo visibility on report page...');
  
  // Navigate to the Tesla demo report page
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait for images to load
  await page.waitForTimeout(2000);
  
  // Check if header logo is visible
  const headerLogo = page.locator('header img[alt="Tesla logo"]').first();
  await expect(headerLogo).toBeVisible();
  console.log('✅ Header Tesla logo is visible');
  
  // Check if hero logo is visible
  const heroLogo = page.locator('main img[alt="Tesla logo"]').first();
  await expect(heroLogo).toBeVisible();
  console.log('✅ Hero Tesla logo is visible');
  
  // Check if the logos have proper src attributes
  const headerLogoSrc = await headerLogo.getAttribute('src');
  const heroLogoSrc = await heroLogo.getAttribute('src');
  
  console.log('🖼️ Header logo src:', headerLogoSrc);
  console.log('🖼️ Hero logo src:', heroLogoSrc);
  
  expect(headerLogoSrc).toContain('tesla.com');
  expect(heroLogoSrc).toContain('tesla.com');
  
  // Check if company name is showing correctly
  const companyName = page.locator('header h1');
  await expect(companyName).toHaveText('Tesla');
  console.log('✅ Company name "Tesla" is showing correctly');
  
  // Check if the "Private demo for Tesla. Not affiliated." text is showing
  const demoText = page.locator('span:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(demoText).toBeVisible();
  console.log('✅ Demo disclaimer text is showing correctly');
  
  // Check if the "in 24 hours" text is showing
  const hoursText = page.locator('p:has-text("A ready-to-deploy solar intelligence tool — live on your site in 24 hours.")');
  await expect(hoursText).toBeVisible();
  console.log('✅ "in 24 hours" text is showing correctly');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'tesla-logo-verification.png', fullPage: true });
  
  console.log('🎉 All Tesla logo and text elements verified successfully!');
});
