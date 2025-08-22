import { test } from '@playwright/test';

test('Show Improved Statistics Text Styling', async ({ page }) => {
  console.log('🎨 Testing the improved text styling in statistics boxes...');

  // Go to home page
  console.log('🏠 Loading home page...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for animations to complete
  console.log('⏳ Waiting for animations...');
  await page.waitForTimeout(4000);
  
  // Take screenshot of statistics section
  console.log('📊 Capturing statistics with improved text...');
  const statsSection = page.locator('.grid.grid-cols-1.md\\:grid-cols-4').first();
  await statsSection.screenshot({ path: 'test-results/improved-statistics-text.png' });
  console.log('✅ Improved statistics text screenshot saved!');
  
  // Take full page screenshot to show context
  console.log('📸 Capturing full page with improved text...');
  await page.screenshot({ path: 'test-results/full-page-improved-text.png', fullPage: true });
  console.log('✅ Full page screenshot saved!');
  
  console.log('✅ All screenshots captured!');
  console.log('');
  console.log('🎯 TEXT IMPROVEMENTS IMPLEMENTED:');
  console.log('✅ Larger text: text-5xl instead of text-4xl');
  console.log('✅ Gradient text: bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700');
  console.log('✅ Better spacing: mb-3 instead of mb-2');
  console.log('✅ Enhanced typography: font-bold instead of font-semibold');
  console.log('✅ Improved readability: text-lg instead of default size');
  console.log('✅ Better contrast: text-gray-700 instead of text-gray-600');
  console.log('✅ Letter spacing: tracking-wide for better readability');
  console.log('✅ Drop shadow: drop-shadow-sm for subtle depth');
  console.log('✅ Text transparency: bg-clip-text text-transparent for gradient effect');
  console.log('');
  console.log('🔍 Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C in terminal to close when done.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
});
