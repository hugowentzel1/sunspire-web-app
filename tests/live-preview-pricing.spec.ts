import { test, expect } from '@playwright/test';

test('Live Preview - Pricing Page - Keep Open for Visual Review', async ({ page }) => {
  console.log('🚀 Opening pricing page for live preview...');
  
  // Go to pricing page with a demo brand
  await page.goto('/pricing?company=Starbucks&brandColor=%23006241');
  
  // Wait for everything to load
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('📊 Pricing page loaded!');
  console.log('🔍 Look for these visual improvements:');
  console.log('  ✅ Icons now use white-to-brand gradient (like home page)');
  console.log('  ✅ "Why This Pricing Makes Sense" section has clean gray backgrounds');
  console.log('  ✅ Final CTA section has clean gray background instead of bright');
  console.log('  ✅ "One Time Setup" and "Then Just" colors match original design');
  console.log('');
  console.log('🎯 The page will stay open for you to review...');
  console.log('💡 Tell me what you think of the visual improvements!');
  
  // Take a screenshot for reference
  await page.screenshot({ path: 'test-results/pricing-page-live-preview.png', fullPage: true });
  console.log('📸 Screenshot saved as pricing-page-live-preview.png');
  
  // Keep the page open - this will wait indefinitely
  console.log('⏳ Page will stay open until you tell me to close it...');
  
  // Wait for a very long time to keep the page open
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('✅ Preview session complete!');
});
