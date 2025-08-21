import { test, expect } from '@playwright/test';

test('Actually check logo sizes on home vs report page', async ({ page }) => {
  console.log('🚀 Starting REAL logo size check...');
  
  // Test 1: Home page logo
  console.log('🏠 Testing home page logo...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const homePageLogo = page.locator('header img').first();
  const homePageBox = await homePageLogo.boundingBox();
  console.log(`🏠 Home page logo: ${homePageBox?.width}x${homePageBox?.height}px`);
  
  // Take screenshot of home page
  await page.screenshot({ path: 'test-results/home-page-logo-debug.png' });
  console.log('📸 Home page screenshot saved');
  
  // Test 2: Report page logo
  console.log('📊 Testing report page logo...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const reportPageLogo = page.locator('header img').first();
  const reportPageBox = await reportPageLogo.boundingBox();
  console.log(`📊 Report page logo: ${reportPageBox?.width}x${reportPageBox?.height}px`);
  
  // Take screenshot of report page
  await page.screenshot({ path: 'test-results/report-page-logo-debug.png' });
  console.log('📸 Report page screenshot saved');
  
  // Check if sizes actually match
  if (homePageBox?.width === reportPageBox?.width && homePageBox?.height === reportPageBox?.height) {
    console.log('✅ Logo sizes ACTUALLY match!');
  } else {
    console.log('❌ Logo sizes are DIFFERENT!');
    console.log(`Home: ${homePageBox?.width}x${homePageBox?.height}px`);
    console.log(`Report: ${reportPageBox?.width}x${reportPageBox?.height}px`);
  }
  
  console.log('✅ Logo size debug complete!');
});
