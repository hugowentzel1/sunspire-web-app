import { test, expect } from '@playwright/test';

test('Verify CTA button sizes and logo consistency', async ({ page }) => {
  console.log('🚀 Starting verification test...');
  
  // Test demo-result page where CTA buttons are
  console.log('📱 Testing demo-result page...');
  await page.goto('/demo-result?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('.cta-band', { timeout: 15000 });
  
  // Check CTA button sizes
  const buttons = page.locator('.cta-band button');
  const buttonCount = await buttons.count();
  console.log(`🔘 Found ${buttonCount} buttons in CTA section`);
  
  // Check first two buttons (main CTA buttons)
  for (let i = 0; i < Math.min(buttonCount, 2); i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    const box = await button.boundingBox();
    console.log(`Button ${i + 1}: "${text}" - Width: ${box?.width}px, Height: ${box?.height}px`);
  }
  
  // Take screenshot of CTA section
  const ctaSection = page.locator('.cta-band');
  await ctaSection.screenshot({ path: 'test-results/cta-buttons-verified.png' });
  console.log('📸 CTA section screenshot saved');
  
  // Test main page logo
  console.log('🏠 Testing main page logo...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const mainPageLogo = page.locator('header img').first();
  const mainPageBox = await mainPageLogo.boundingBox();
  console.log(`Main page logo: ${mainPageBox?.width}x${mainPageBox?.height}px`);
  
  // Test report page logo
  console.log('📊 Testing report page logo...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  
  // Wait for page to load and check for header
  await page.waitForSelector('header', { timeout: 15000 });
  console.log('✅ Header found on report page');
  
  // Wait a bit more for images to load
  await page.waitForTimeout(2000);
  
  const reportPageLogo = page.locator('header img').first();
  if (await reportPageLogo.count() > 0) {
    const reportPageBox = await reportPageLogo.boundingBox();
    console.log(`Report page logo: ${reportPageBox?.width}x${reportPageBox?.height}px`);
    
    // Verify logo consistency
    if (mainPageBox?.width === reportPageBox?.width && mainPageBox?.height === reportPageBox?.height) {
      console.log('✅ Logo sizes match perfectly!');
    } else {
      console.log('❌ Logo sizes are different!');
    }
  } else {
    console.log('⚠️ No logo found on report page header');
  }
  
  // Take screenshot of report page
  await page.screenshot({ path: 'test-results/report-page-verified.png' });
  console.log('📸 Report page screenshot saved');
  
  console.log('✅ Verification test complete!');
});
