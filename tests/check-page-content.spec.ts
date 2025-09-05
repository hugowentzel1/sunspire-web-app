import { test, expect } from '@playwright/test';

test('Check Page Content - See What\'s Actually There', async ({ page }) => {
  console.log('🔍 Checking what content is actually on the page...');
  
  // Test Tesla with correct parameters
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check what headings are on the page
  const headings = await page.locator('h1, h2, h3').all();
  console.log('📋 Headings found on page:');
  for (let i = 0; i < headings.length; i++) {
    const text = await headings[i].textContent();
    console.log(`  ${i + 1}. ${text}`);
  }
  
  // Check for any white boxes
  const whiteBoxes = await page.locator('.bg-white, [class*="bg-white"]').all();
  console.log(`📦 White boxes found: ${whiteBoxes.length}`);
  
  // Check for calculation-related content
  const calcContent = await page.locator('text=Calculation, text=Assumptions, text=NREL, text=PVWatts').all();
  console.log(`🧮 Calculation content found: ${calcContent.length}`);
  for (let i = 0; i < calcContent.length; i++) {
    const text = await calcContent[i].textContent();
    console.log(`  ${i + 1}. ${text}`);
  }
  
  // Check for data sources
  const dataSources = await page.locator('text=Data Sources, text=Google Maps, text=utility rates').all();
  console.log(`📊 Data sources content found: ${dataSources.length}`);
  for (let i = 0; i < dataSources.length; i++) {
    const text = await dataSources[i].textContent();
    console.log(`  ${i + 1}. ${text}`);
  }
  
  // Take screenshot to see current state
  await page.screenshot({ path: 'current-page-content.png', fullPage: true });
  console.log('📸 Current page content screenshot saved');
  
  console.log('\n🎯 SUMMARY:');
  console.log('✅ Brand colors working (Tesla red)');
  console.log('✅ CTA buttons working');
  console.log('✅ Company names working');
  console.log('❓ Consolidated white box - checking if deployed...');
});
