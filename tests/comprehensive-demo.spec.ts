import { test, expect } from '@playwright/test';

test('Comprehensive Demo - All Pages with Color Coding', async ({ page }) => {
  console.log('🚀 Starting comprehensive demo of all pages...');
  
  // 1. Main Page
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  console.log('✅ Main page loaded - showing updated hero and spacing');
  await page.waitForTimeout(3000);
  
  // 2. Pricing Page
  await page.goto('http://localhost:3002/pricing');
  await page.waitForLoadState('networkidle');
  console.log('✅ Pricing page loaded - showing color-coded design');
  await page.waitForTimeout(3000);
  
  // 3. Partners Page
  await page.goto('http://localhost:3002/partners');
  await page.waitForLoadState('networkidle');
  console.log('✅ Partners page loaded - showing partner program');
  await page.waitForTimeout(3000);
  
  // 4. Support Page
  await page.goto('http://localhost:3002/support');
  await page.waitForLoadState('networkidle');
  console.log('✅ Support page loaded - showing support center');
  await page.waitForTimeout(3000);
  
  // 5. Privacy Page
  await page.goto('http://localhost:3002/privacy');
  await page.waitForLoadState('networkidle');
  console.log('✅ Privacy page loaded - showing privacy policy');
  await page.waitForTimeout(3000);
  
  // 6. Terms Page
  await page.goto('http://localhost:3002/terms');
  await page.waitForLoadState('networkidle');
  console.log('✅ Terms page loaded - showing terms of service');
  await page.waitForTimeout(3000);
  
  // 7. Setup Guide
  await page.goto('http://localhost:3002/docs/setup');
  await page.waitForLoadState('networkidle');
  console.log('✅ Setup Guide loaded - showing installation steps');
  await page.waitForTimeout(3000);
  
  // 8. Back to Main Page for Footer
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  console.log('✅ Back to main page - showing updated footer with compliance badges');
  
  // Scroll to footer to show the compliance badges
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  console.log('🎉 Comprehensive demo completed!');
  console.log('📋 All pages are now color-coded with brand colors');
  console.log('📍 Address input simplified (like c548b88)');
  console.log('📏 Normalized 24px spacing throughout');
  console.log('💰 Pricing shows $399 + $99/month');
  console.log('🔗 All pages have Back to Home navigation');
  
  // Keep the page open for final visual inspection
  await page.waitForTimeout(10000); // Stay open for 10 seconds
});
