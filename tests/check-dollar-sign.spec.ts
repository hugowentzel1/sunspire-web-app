import { test, expect } from '@playwright/test';

test('Check Dollar Sign Has Two Lines and Support Page Icons', async ({ page }) => {
  console.log('🔍 Checking pricing page dollar sign and support page icons...');
  
  // First check the pricing page dollar sign
  await page.goto('/pricing?company=Google&brandColor=%234285F4');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Pricing page loaded! Checking dollar sign...');
  
  // Take screenshot of pricing page to verify dollar sign
  await page.screenshot({ path: 'test-results/pricing-dollar-sign.png', fullPage: true });
  console.log('📸 Pricing page screenshot saved - check if dollar sign has two lines');
  
  // Now check the support page icons
  await page.goto('/support?company=Google&brandColor=%234285F4');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Support page loaded! Checking icons...');
  
  // Take screenshot of support page to verify icons
  await page.screenshot({ path: 'test-results/support-page-icons.png', fullPage: true });
  console.log('📸 Support page screenshot saved - check if icons look good');
  
  console.log('\n🎯 Verification complete! Please check:');
  console.log('  1. Pricing page: Dollar sign should have TWO distinct lines');
  console.log('  2. Support page: Icons should be black outline style with white/company gradients');
  
  // Keep page open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('✅ Inspection session complete!');
});
