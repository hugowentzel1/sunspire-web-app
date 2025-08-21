import { test, expect } from '@playwright/test';

test('Check logo parent containers and CSS constraints', async ({ page }) => {
  console.log('🚀 Starting container logo check...');
  
  // Test 1: Home page logo container
  console.log('🏠 Testing home page logo container...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const homePageLogo = page.locator('header img').first();
  const homePageContainer = homePageLogo.locator('xpath=..'); // Parent element
  
  const homeLogoBox = await homePageLogo.boundingBox();
  const homeContainerBox = await homePageContainer.boundingBox();
  
  console.log(`🏠 Home page:`);
  console.log(`  Logo: ${homeLogoBox?.width}x${homeLogoBox?.height}px`);
  console.log(`  Container: ${homeContainerBox?.width}x${homeContainerBox?.height}px`);
  
  // Check container CSS
  const homeContainerClasses = await homePageContainer.getAttribute('class');
  const homeContainerStyle = await homePageContainer.getAttribute('style');
  console.log(`  Container classes: ${homeContainerClasses}`);
  console.log(`  Container style: ${homeContainerStyle}`);
  
  // Test 2: Report page logo container
  console.log('📊 Testing report page logo container...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  const reportPageLogo = page.locator('header img').first();
  const reportPageContainer = reportPageLogo.locator('xpath=..'); // Parent element
  
  const reportLogoBox = await reportPageLogo.boundingBox();
  const reportContainerBox = await reportPageContainer.boundingBox();
  
  console.log(`📊 Report page:`);
  console.log(`  Logo: ${reportLogoBox?.width}x${reportLogoBox?.height}px`);
  console.log(`  Container: ${reportContainerBox?.width}x${reportContainerBox?.height}px`);
  
  // Check container CSS
  const reportContainerClasses = await reportPageContainer.getAttribute('class');
  const reportContainerStyle = await reportPageContainer.getAttribute('style');
  console.log(`  Container classes: ${reportContainerClasses}`);
  console.log(`  Container style: ${reportContainerStyle}`);
  
  // Check if containers are constraining logos
  console.log('\n🔍 CONTAINER ANALYSIS:');
  if (homeContainerBox?.width < homeLogoBox?.width || homeContainerBox?.height < homeLogoBox?.height) {
    console.log('⚠️ Home page container might be constraining logo');
  } else {
    console.log('✅ Home page container not constraining logo');
  }
  
  if (reportContainerBox?.width < reportLogoBox?.width || reportContainerBox?.height < reportLogoBox?.height) {
    console.log('⚠️ Report page container might be constraining logo');
  } else {
    console.log('✅ Report page container not constraining logo');
  }
  
  // Take screenshots for visual comparison
  await page.screenshot({ path: 'test-results/container-check-home.png' });
  console.log('📸 Home page container screenshot saved');
  
  await page.screenshot({ path: 'test-results/container-check-report.png' });
  console.log('📸 Report page container screenshot saved');
  
  console.log('✅ Container logo check complete!');
});
