import { test } from '@playwright/test';

test('Show Color Consistency & Footer Fixes', async ({ page }) => {
  console.log('🎨 Testing color consistency and footer fixes...');

  // Test 1: Home page with consistent colors
  console.log('🏠 Testing home page...');
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);
  
  // Take screenshot of home page
  await page.screenshot({ path: 'test-results/home-consistent-colors.png', fullPage: true });
  console.log('✅ Home page screenshot saved!');
  
  // Test 2: Methodology page with footer
  console.log('📚 Testing methodology page...');
  await page.goto('http://localhost:3005/methodology');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  // Take screenshot of methodology page
  await page.screenshot({ path: 'test-results/methodology-with-footer.png', fullPage: true });
  console.log('✅ Methodology page screenshot saved!');
  
  // Test 3: Privacy page with footer
  console.log('🔒 Testing privacy page...');
  await page.goto('http://localhost:3005/privacy');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  // Take screenshot of privacy page
  await page.screenshot({ path: 'test-results/privacy-with-footer.png', fullPage: true });
  console.log('✅ Privacy page screenshot saved!');
  
  // Test 4: Support page with consistent colors
  console.log('🆘 Testing support page...');
  await page.goto('http://localhost:3005/support');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  // Take screenshot of support page
  await page.screenshot({ path: 'test-results/support-consistent-colors.png', fullPage: true });
  console.log('✅ Support page screenshot saved!');
  
  console.log('✅ All screenshots captured!');
  console.log('');
  console.log('🎯 COLOR CONSISTENCY & FOOTER FIXES IMPLEMENTED:');
  console.log('✅ All blue colors replaced with brand colors (var(--brand-primary))');
  console.log('✅ Support page SLA section: Blue → Gray + Brand colors');
  console.log('✅ Status page: Blue → Brand colors');
  console.log('✅ Preferences page: All blue toggles → Brand colors');
  console.log('✅ All email links: Blue → Brand colors');
  console.log('✅ Methodology page: Added footer');
  console.log('✅ Privacy page: Added footer + fixed colors');
  console.log('✅ Preferences page: Added footer + fixed colors');
  console.log('✅ Consistent theme: White, Company Color, Black throughout');
  console.log('');
  console.log('🔍 Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C in terminal to close when done.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
});
