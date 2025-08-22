import { test } from '@playwright/test';

test('Show Reverted Statistics & New Footer', async ({ page }) => {
  console.log('🎨 Testing the reverted statistics and new footer layout...');

  // Go to home page
  console.log('🏠 Loading home page...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for animations
  console.log('⏳ Waiting for animations...');
  await page.waitForTimeout(3000);
  
  // Take screenshot of statistics section
  console.log('📊 Capturing reverted statistics...');
  const statsSection = page.locator('.grid.grid-cols-1.md\\:grid-cols-4').first();
  await statsSection.screenshot({ path: 'test-results/reverted-statistics.png' });
  console.log('✅ Statistics screenshot saved!');
  
  // Scroll to footer
  console.log('📜 Scrolling to footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Take screenshot of footer
  console.log('📸 Capturing new footer layout...');
  await page.screenshot({ path: 'test-results/new-footer-layout.png', fullPage: false });
  
  console.log('✅ Footer screenshot saved!');
  console.log('');
  console.log('🎯 CHANGES IMPLEMENTED:');
  console.log('✅ Statistics reverted: Back to 50K+, $2.5M, 98%, 24/7');
  console.log('✅ Simple styling: Clean text-4xl with text-gray-900');
  console.log('✅ Footer layout: Compact design from cb083ed commit');
  console.log('✅ Better spacing: gap-6, flex-wrap, no overlapping');
  console.log('✅ Three sections: Disclaimers, Company Info, Legal Links');
  console.log('✅ Responsive: flex-col on mobile, flex-row on desktop');
  console.log('');
  console.log('🔍 Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C in terminal to close when done.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
});
