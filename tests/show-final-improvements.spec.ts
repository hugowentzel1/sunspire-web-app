import { test, expect } from '@playwright/test';

test('Show Final Improvements - Live Preview', async ({ page }) => {
  console.log('🚀 Opening pages to show final improvements...');
  
  // 1. PRICING PAGE - Show improved dollar sign with 2 lines
  console.log('\n📊 1. Opening Pricing Page...');
  await page.goto('/pricing?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Pricing page loaded! Look for:');
  console.log('  🎯 Dollar sign icon now has 2 lines through it (better design)');
  console.log('  🎯 All icons use outline style matching home page');
  console.log('  🎯 Clean gray backgrounds instead of bright ones');
  
  await page.screenshot({ path: 'test-results/pricing-final-improvements.png', fullPage: true });
  console.log('📸 Pricing page screenshot saved');
  
  // Wait a bit so you can see it
  await page.waitForTimeout(5000);
  
  // 2. PARTNERS PAGE - Show lighter commission text
  console.log('\n🤝 2. Opening Partners Page...');
  await page.goto('/partners?company=Microsoft&brandColor=%23007ACC');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Partners page loaded! Look for:');
  console.log('  🎯 Commission structure text is now lighter (text-gray-500)');
  console.log('  🎯 Icons use white-to-brand gradient with black outlines');
  console.log('  🎯 Clean white background instead of bright color block');
  
  await page.screenshot({ path: 'test-results/partners-final-improvements.png', fullPage: true });
  console.log('📸 Partners page screenshot saved');
  
  // Wait a bit so you can see it
  await page.waitForTimeout(5000);
  
  // 3. SUPPORT PAGE - Show white gradient buttons with company color
  console.log('\n🆘 3. Opening Support Page...');
  await page.goto('/support?company=Google&brandColor=%234285F4');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Support page loaded! Look for:');
  console.log('  🎯 Support buttons now use white gradient background');
  console.log('  🎯 Buttons have company color borders and text');
  console.log('  🎯 Icons are black outlines matching home page style');
  console.log('  🎯 FAQ boxes have darker borders for better visibility');
  
  await page.screenshot({ path: 'test-results/support-final-improvements.png', fullPage: true });
  console.log('📸 Support page screenshot saved');
  
  console.log('\n🎉 All final improvements shown! Tell me what you think!');
  console.log('💡 The page will stay open for you to review...');
  
  // Keep the page open for review
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('✅ Preview session complete!');
});
