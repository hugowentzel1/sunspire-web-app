import { test, expect } from '@playwright/test';

test('Show Support Page Complete - Live Preview', async ({ page }) => {
  console.log('🚀 Opening support page to show complete design...');
  
  // Open Support Page with Google brand
  await page.goto('/support?company=Google&brandColor=%234285F4');
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  console.log('✅ Support page loaded! Look for:');
  console.log('  🎯 Icon circles: White gradient with company color shading');
  console.log('  🎯 Icons: Black outline style (consistent with rest of site)');
  console.log('  🎯 Buttons: Original commit style (company color background, white text)');
  console.log('  🎯 FAQ boxes: Properly aligned with title');
  
  await page.screenshot({ path: 'test-results/support-complete-design.png', fullPage: true });
  console.log('📸 Support page screenshot saved');
  
  console.log('\n🎉 Complete design shown! The page should now have:');
  console.log('  ✅ Beautiful white gradient icon circles with company color shading');
  console.log('  ✅ Black outline icons matching the rest of the site');
  console.log('  ✅ Original button styles from commit 08c6e9...');
  console.log('  ✅ Perfect FAQ alignment');
  
  // Keep the page open for review
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('✅ Preview session complete!');
});
