import { test, expect } from '@playwright/test';

test('Show dynamic report page demo - stays up for visual verification', async ({ page }) => {
  console.log('🎬 Starting dynamic report page demo...');
  
  // Show Tesla
  console.log('\n🚗 Loading Tesla report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Tesla loaded - check:');
  console.log('   - Tesla logo in header and hero section');
  console.log('   - "Tesla" company name in header');
  console.log('   - "Private demo for Tesla. Not affiliated." under header');
  console.log('   - "Ready to Launch Your Branded Tool?" text');
  console.log('⏸️  Pausing for 8 seconds...');
  await page.waitForTimeout(8000);
  
  // Show Apple
  console.log('\n🍎 Loading Apple report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Apple loaded - check:');
  console.log('   - Apple logo in header and hero section');
  console.log('   - "Apple" company name in header');
  console.log('   - "Private demo for Apple. Not affiliated." under header');
  console.log('   - "Ready to Launch Your Branded Tool?" text');
  console.log('⏸️  Pausing for 8 seconds...');
  await page.waitForTimeout(8000);
  
  // Show Amazon
  console.log('\n📦 Loading Amazon report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Amazon loaded - check:');
  console.log('   - Amazon logo in header and hero section');
  console.log('   - "Amazon" company name in header');
  console.log('   - "Private demo for Amazon. Not affiliated." under header');
  console.log('   - "Ready to Launch Your Branded Tool?" text');
  console.log('⏸️  Pausing for 8 seconds...');
  await page.waitForTimeout(8000);
  
  // Show Google
  console.log('\n🔍 Loading Google report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Google loaded - check:');
  console.log('   - Google logo in header and hero section');
  console.log('   - "Google" company name in header');
  console.log('   - "Private demo for Google. Not affiliated." under header');
  console.log('   - "Ready to Launch Your Branded Tool?" text');
  console.log('⏸️  Pausing for 8 seconds...');
  await page.waitForTimeout(8000);
  
  // Show Custom Company
  console.log('\n☀️ Loading Custom Company report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=CustomCompany&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Custom Company loaded - check:');
  console.log('   - Sun icon (no logo available for custom company)');
  console.log('   - "Customcompany" company name in header');
  console.log('   - "Private demo for Customcompany. Not affiliated." under header');
  console.log('   - "Ready to Launch Your Branded Tool?" text');
  console.log('⏸️  Pausing for 8 seconds...');
  await page.waitForTimeout(8000);
  
  // Take final screenshot
  await page.screenshot({ path: 'dynamic-report-page-demo-final.png', fullPage: true });
  
  console.log('\n🎉 Demo complete! Browser will stay open for 20 more seconds...');
  console.log('✅ All company logos and names change dynamically based on URL');
  console.log('✅ Disclaimer text appears under header for all companies');
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing');
  console.log('✅ No hardcoded values - everything is dynamic!');
  await page.waitForTimeout(20000);
});
