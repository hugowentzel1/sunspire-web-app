import { test, expect } from '@playwright/test';

test('Visual logo check - actually look at both pages', async ({ page }) => {
  console.log('🚀 Opening web pages to visually check logos...');
  
  // Test 1: Home page - take screenshot
  console.log('🏠 Opening home page...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  // Wait a bit for everything to render
  await page.waitForTimeout(2000);
  
  // Take screenshot of the header area
  const homeHeader = page.locator('header');
  await homeHeader.screenshot({ path: 'test-results/home-page-header-visual.png' });
  console.log('📸 Home page header screenshot saved');
  
  // Test 2: Report page - take screenshot  
  console.log('📊 Opening report page...');
  await page.goto('/report?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  
  // Wait a bit for everything to render
  await page.waitForTimeout(2000);
  
  // Take screenshot of the header area
  const reportHeader = page.locator('header');
  await reportHeader.screenshot({ path: 'test-results/report-page-header-visual.png' });
  console.log('📸 Report page header screenshot saved');
  
  // Also take full page screenshots for comparison
  await page.screenshot({ path: 'test-results/report-page-full-visual.png', fullPage: true });
  console.log('📸 Report page full screenshot saved');
  
  // Go back to home page for full screenshot
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header img', { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/home-page-full-visual.png', fullPage: true });
  console.log('📸 Home page full screenshot saved');
  
  console.log('✅ Visual check complete! Check the screenshots to see logo differences.');
  console.log('📁 Screenshots saved in test-results/ folder');
});
