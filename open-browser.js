const { chromium } = require('playwright');

async function openBrowser() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const page = await browser.newPage();
  
  console.log('🔍 Opening report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('✅ Report page loaded - check the bottom for restored footer sections:');
  console.log('  - Copy Demo Link Button with 🚀 emoji');
  console.log('  - ResultsAttribution component with PVWatts and Google badges');
  console.log('  - Separate disclaimer section with PVWatts attribution');
  
  // Keep browser open
  console.log('Browser will stay open for manual inspection...');
  
  // Don't close the browser
  // await browser.close();
}

openBrowser().catch(console.error);
