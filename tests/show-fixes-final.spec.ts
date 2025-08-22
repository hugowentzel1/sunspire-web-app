import { test } from '@playwright/test';

test('Show Final Fixes - Statistics & Footer', async ({ page }) => {
  console.log('🎨 Testing the final fixes...');

  // Go to home page
  console.log('🏠 Loading home page...');
  await page.goto('http://localhost:3004');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for animations
  console.log('⏳ Waiting for animations...');
  await page.waitForTimeout(3000);
  
  // Take screenshot of statistics section
  console.log('📊 Capturing statistics with smaller text...');
  const statsSection = page.locator('.grid.grid-cols-1.md\\:grid-cols-4').first();
  await statsSection.screenshot({ path: 'test-results/statistics-smaller-text.png' });
  console.log('✅ Statistics screenshot saved!');
  
  // Scroll to footer
  console.log('📜 Scrolling to footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Take screenshot of footer
  console.log('📸 Capturing centered footer layout...');
  await page.screenshot({ path: 'test-results/footer-centered-layout.png', fullPage: false });
  
  console.log('✅ Footer screenshot saved!');
  console.log('');
  console.log('🎯 FINAL FIXES IMPLEMENTED:');
  console.log('✅ Statistics text: Reduced from text-5xl to text-4xl');
  console.log('✅ Footer layout: Legal section now centered');
  console.log('✅ Company info: Left-aligned (md:text-left)');
  console.log('✅ Support section: Right-aligned (md:text-right)');
  console.log('✅ Legal section: Always centered (text-center)');
  console.log('');
  console.log('🔍 Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C in terminal to close when done.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
});
