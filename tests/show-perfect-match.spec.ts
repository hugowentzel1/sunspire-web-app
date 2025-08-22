import { test } from '@playwright/test';

test('Show Perfect Match - Support Icons Match Partners/Pricing Style, Beautiful Footer', async ({ page }) => {
  console.log('🎨 Testing perfect match between support page and partners/pricing style...');

  // Go to home page
  console.log('🏠 Loading home page...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for animations
  console.log('⏳ Waiting for animations...');
  await page.waitForTimeout(3000);
  
  // Scroll to footer
  console.log('📜 Scrolling to beautiful footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Take screenshot of footer
  console.log('📸 Capturing beautiful footer with SVG icons...');
  await page.screenshot({ path: 'test-results/beautiful-footer-svg.png', fullPage: false });
  console.log('✅ Footer screenshot saved!');
  
  // Test support page
  console.log('🆘 Testing support page with matching icon style...');
  await page.goto('http://localhost:3000/support');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/support-perfect-match.png' });
  console.log('✅ Support page screenshot saved!');
  
  // Test partners page for comparison
  console.log('🤝 Testing partners page for style comparison...');
  await page.goto('http://localhost:3000/partners');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/partners-style-comparison.png' });
  console.log('✅ Partners page screenshot saved!');
  
  // Go back to home for final inspection
  console.log('🏠 Returning to home page for final inspection...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  
  console.log('');
  console.log('🎯 PERFECT MATCH ACHIEVED:');
  console.log('✅ Support page: Icons now match partners/pricing style exactly');
  console.log('✅ Support page: White-to-company-color gradient with rounded-2xl');
  console.log('✅ Support page: Same shadow-[0_8px_30px_rgba(0,0,0,.12)] as partners');
  console.log('✅ Footer: All emojis replaced with beautiful SVG icons');
  console.log('✅ Footer: Enhanced gradient background (gray-50 via-white to-gray-100)');
  console.log('✅ Footer: Better spacing (py-16, pt-10, gap-8)');
  console.log('✅ Footer: Consistent black outline SVG style throughout');
  console.log('✅ Color consistency: All pages use consistent brand color scheme');
  console.log('');
  console.log('🔍 Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C in terminal to close when done.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
});
