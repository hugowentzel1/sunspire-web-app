import { test, expect } from '@playwright/test';

test('Show All Visual Improvements - Live Preview', async ({ page }) => {
  console.log('🚀 Opening all pages to show visual improvements...');
  
  // 1. PRICING PAGE - Show IconBadge icons and clean backgrounds
  console.log('\n📊 1. Opening Pricing Page...');
  await page.goto('/pricing?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Pricing page loaded! Look for:');
  console.log('  🎯 Icons now use white-to-brand gradient (like home page)');
  console.log('  🎯 "Why This Pricing Makes Sense" section has clean gray backgrounds');
  console.log('  🎯 Final CTA section has clean gray background instead of bright');
  
  await page.screenshot({ path: 'test-results/pricing-improvements.png', fullPage: true });
  console.log('📸 Pricing page screenshot saved');
  
  // Wait a bit so you can see it
  await page.waitForTimeout(5000);
  
  // 2. PARTNERS PAGE - Show lighter text and gradient icons
  console.log('\n🤝 2. Opening Partners Page...');
  await page.goto('/partners?company=Microsoft&brandColor=%23007ACC');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Partners page loaded! Look for:');
  console.log('  🎯 Commission structure text is now lighter and readable');
  console.log('  🎯 Icons use white-to-brand gradient (💰🎯🏷️📈)');
  console.log('  🎯 Clean white background instead of bright color block');
  
  await page.screenshot({ path: 'test-results/partners-improvements.png', fullPage: true });
  console.log('📸 Partners page screenshot saved');
  
  // Wait a bit so you can see it
  await page.waitForTimeout(5000);
  
  // 3. SUPPORT PAGE - Show aligned resources and black/white icons
  console.log('\n🆘 3. Opening Support Page...');
  await page.goto('/support?company=Apple&brandColor=%23000000');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Support page loaded! Look for:');
  console.log('  🎯 Helpful resources text now aligned with FAQ questions');
  console.log('  🎯 Live Chat, Email Support, Priority Support icons are black/white');
  console.log('  🎯 Clean, readable design throughout');
  
  await page.screenshot({ path: 'test-results/support-improvements.png', fullPage: true });
  console.log('📸 Support page screenshot saved');
  
  // Wait a bit so you can see it
  await page.waitForTimeout(5000);
  
  // 4. HOME PAGE - Show original IconBadge design for comparison
  console.log('\n🏠 4. Opening Home Page for comparison...');
  await page.goto('/?company=Starbucks&brandColor=%23006241');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Home page loaded! This shows the original IconBadge design');
  console.log('  🎯 Compare these icons with the ones on pricing/partners pages');
  
  await page.screenshot({ path: 'test-results/home-comparison.png', fullPage: true });
  console.log('📸 Home page screenshot saved');
  
  console.log('\n🎉 All pages shown! Tell me what you think of the improvements!');
  console.log('💡 The page will stay open for you to review...');
  
  // Keep the page open for review
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('✅ Preview session complete!');
});
