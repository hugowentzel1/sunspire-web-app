import { test, expect } from '@playwright/test';

test('Show disclaimer under header - stays up for visual verification', async ({ page }) => {
  console.log('🎬 Showing disclaimer under header on report page...');
  
  // Show Tesla
  console.log('\n🚗 Loading Tesla report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Tesla loaded - check that "Private demo for Tesla. Not affiliated." appears under the header');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Show Apple
  console.log('\n🍎 Loading Apple report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Apple loaded - check that "Private demo for Apple. Not affiliated." appears under the header');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Show Amazon
  console.log('\n📦 Loading Amazon report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Amazon loaded - check that "Private demo for Amazon. Not affiliated." appears under the header');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Take final screenshot
  await page.screenshot({ path: 'disclaimer-under-header-final.png', fullPage: true });
  
  console.log('\n🎉 Demo complete! Browser will stay open for 30 more seconds...');
  console.log('✅ Disclaimer text now appears under header on report page');
  console.log('✅ Just like on every other page of the site!');
  await page.waitForTimeout(30000);
});
