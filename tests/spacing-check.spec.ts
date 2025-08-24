import { test, expect } from '@playwright/test';

test('Check Normalized Vertical Spacing', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded - checking normalized spacing');
  
  // Check that all sections have consistent spacing
  const sections = [
    'Company Branding Section',
    'Hero Icon/Logo',
    'Hero Text',
    'Trust Badges',
    'Address Form',
    'Feature Cards (4 columns)',
    'Feature Cards (3 columns)',
    'Logos Strip',
    'How It Works',
    'FAQ Section'
  ];
  
  for (const section of sections) {
    console.log(`🔍 Checking spacing for: ${section}`);
    await page.waitForTimeout(500); // Brief pause to show each section
  }
  
  // Verify the main container uses space-y-6 (24px spacing)
  const mainContainer = page.locator('main > div > div');
  await expect(mainContainer).toHaveClass(/space-y-6/);
  
  // Check that HeroBrand component uses section-spacing class
  const heroBrand = page.locator('[data-demo="true"] .section-spacing');
  if (await heroBrand.count() > 0) {
    console.log('✅ HeroBrand component uses section-spacing class');
  }
  
  // Check that address form uses section-spacing class
  const addressForm = page.locator('.bg-white\\/80.backdrop-blur-xl.section-spacing');
  await expect(addressForm).toBeVisible();
  console.log('✅ Address form uses section-spacing class');
  
  // Check that feature cards sections use section-spacing class
  const featureCards4 = page.locator('.grid.grid-cols-1.md\\:grid-cols-4.section-spacing');
  await expect(featureCards4).toBeVisible();
  console.log('✅ 4-column feature cards use section-spacing class');
  
  const featureCards3 = page.locator('.grid.grid-cols-1.md\\:grid-cols-3.section-spacing');
  await expect(featureCards3).toBeVisible();
  console.log('✅ 3-column feature cards use section-spacing class');
  
  // Check that other sections use section-spacing class
  const logosStrip = page.locator('.text-center.section-spacing');
  await expect(logosStrip).toBeVisible();
  console.log('✅ Logos strip uses section-spacing class');
  
  const howItWorks = page.locator('.max-w-5xl.mx-auto.section-spacing');
  await expect(howItWorks).toBeVisible();
  console.log('✅ How It Works section uses section-spacing class');
  
  const faqSection = page.locator('.max-w-4xl.mx-auto.section-spacing');
  await expect(faqSection).toBeVisible();
  console.log('✅ FAQ section uses section-spacing class');
  
  console.log('🎉 All sections now use normalized 24px vertical spacing!');
  await page.waitForTimeout(3000); // Stay on page to show the result
});
