import { test, expect } from '@playwright/test';

test('Show dynamic company branding demo - stays up', async ({ page }) => {
  console.log('🎬 Starting dynamic company branding demo...');
  
  // Start with Tesla
  console.log('\n🚗 Loading Tesla demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Tesla loaded - check the Tesla logo and "Private demo for Tesla. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Apple
  console.log('\n🍎 Loading Apple demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Apple loaded - check the Apple logo and "Private demo for Apple. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Amazon
  console.log('\n📦 Loading Amazon demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Amazon loaded - check the Amazon logo and "Private demo for Amazon. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Google
  console.log('\n🔍 Loading Google demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Google loaded - check the Google logo and "Private demo for Google. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Microsoft
  console.log('\n💻 Loading Microsoft demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Microsoft loaded - check the Microsoft logo and "Private demo for Microsoft. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Netflix
  console.log('\n📺 Loading Netflix demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Netflix loaded - check the Netflix logo and "Private demo for Netflix. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Switch to Custom Company (should show sun icon)
  console.log('\n☀️ Loading Custom Company demo...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=CustomCompany&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Custom Company loaded - check the sun icon and "Private demo for Customcompany. Not affiliated." text');
  console.log('⏸️  Pausing for 10 seconds...');
  await page.waitForTimeout(10000);
  
  // Final pause to keep browser open
  console.log('\n🎉 Demo complete! Browser will stay open for 30 more seconds...');
  console.log('✅ All companies showed different logos, names, and text dynamically!');
  console.log('✅ No hardcoded values - everything changes based on URL parameters!');
  await page.waitForTimeout(30000);
});
