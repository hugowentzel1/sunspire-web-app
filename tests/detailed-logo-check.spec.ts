import { test, expect } from '@playwright/test';

test('Detailed logo check - styling and visual differences', async ({ page }) => {
  console.log('🚀 Starting detailed logo check...');
  
  // Test 1: Home page logo with detailed inspection
  console.log('🏠 Testing home page logo...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const homePageLogo = page.locator('header img').first();
  const homePageBox = await homePageLogo.boundingBox();
  const homePageClasses = await homePageLogo.getAttribute('class');
  const homePageStyle = await homePageLogo.getAttribute('style');
  
  console.log(`🏠 Home page logo:`);
  console.log(`  Dimensions: ${homePageBox?.width}x${homePageBox?.height}px`);
  console.log(`  Classes: ${homePageClasses}`);
  console.log(`  Style: ${homePageStyle}`);
  
  // Take screenshot of home page
  await page.screenshot({ path: 'test-results/home-page-detailed.png' });
  console.log('📸 Home page screenshot saved');
  
  // Test 2: Report page logo with detailed inspection
  console.log('📊 Testing report page logo...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const reportPageLogo = page.locator('header img').first();
  const reportPageBox = await reportPageLogo.boundingBox();
  const reportPageClasses = await reportPageLogo.getAttribute('class');
  const reportPageStyle = await reportPageLogo.getAttribute('style');
  
  console.log(`📊 Report page logo:`);
  console.log(`  Dimensions: ${reportPageBox?.width}x${reportPageBox?.height}px`);
  console.log(`  Classes: ${reportPageClasses}`);
  console.log(`  Style: ${reportPageStyle}`);
  
  // Take screenshot of report page
  await page.screenshot({ path: 'test-results/report-page-detailed.png' });
  console.log('📸 Report page screenshot saved');
  
  // Check for any differences
  console.log('\n🔍 COMPARISON:');
  if (homePageBox?.width === reportPageBox?.width && homePageBox?.height === reportPageBox?.height) {
    console.log('✅ Dimensions match');
  } else {
    console.log('❌ Dimensions differ');
  }
  
  if (homePageClasses === reportPageClasses) {
    console.log('✅ Classes match');
  } else {
    console.log('❌ Classes differ');
  }
  
  if (homePageStyle === reportPageStyle) {
    console.log('✅ Styles match');
  } else {
    console.log('❌ Styles differ');
  }
  
  // Check computed styles
  const homeComputedStyle = await homePageLogo.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      width: style.width,
      height: style.height,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      objectFit: style.objectFit,
      borderRadius: style.borderRadius
    };
  });
  
  const reportComputedStyle = await reportPageLogo.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      width: style.width,
      height: style.height,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      objectFit: style.objectFit,
      borderRadius: style.borderRadius
    };
  });
  
  console.log('\n🎨 COMPUTED STYLES:');
  console.log('Home:', homeComputedStyle);
  console.log('Report:', reportComputedStyle);
  
  console.log('✅ Detailed logo check complete!');
});
