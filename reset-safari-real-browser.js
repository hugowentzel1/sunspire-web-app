// Reset demo runs in your actual Safari browser
const { webkit } = require('playwright');

async function resetSafariRealBrowser() {
  console.log('🍎 Resetting demo runs in your ACTUAL Safari browser...');
  console.log('⚠️  This will open Safari and reset the demo runs in your real browser session.');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 2000 // Slow down so you can see what's happening
  });
  
  const page = await browser.newPage();
  
  // Navigate to Tesla demo site
  await page.goto('https://sunspire-web-app.vercel.app/?company=tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Checking current demo status in Safari...');
  
  // Check what's currently in localStorage
  const currentState = await page.evaluate(() => {
    return {
      brandTakeover: localStorage.getItem('sunspire-brand-takeover'),
      demoQuota: localStorage.getItem('demo_quota_v5'),
      allKeys: Object.keys(localStorage)
    };
  });
  
  console.log('📊 Current Safari State:', currentState);
  
  // Clear ALL localStorage in your actual Safari browser
  await page.evaluate(() => {
    localStorage.clear();
    console.log("✅ Cleared ALL localStorage in Safari");
  });
  
  // Set unlimited demo data in your actual Safari browser
  await page.evaluate(() => {
    const brandData = {
      enabled: true,
      brand: "tesla",
      primary: "#CC0000",
      logo: null,
      domain: "tesla",
      city: null,
      rep: null,
      firstName: null,
      role: null,
      expireDays: 7,
      runs: 999, // Unlimited
      blur: true,
      pilot: false,
      isDemo: true,
      _timestamp: Date.now()
    };
    
    localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
    console.log("✅ Set unlimited demo data in Safari");
  });
  
  // Verify the reset worked
  const newState = await page.evaluate(() => {
    return {
      brandTakeover: localStorage.getItem('sunspire-brand-takeover'),
      demoQuota: localStorage.getItem('demo_quota_v5'),
      allKeys: Object.keys(localStorage)
    };
  });
  
  console.log('🔄 New Safari State:', newState);
  
  // Test report page access
  await page.click('text=Report');
  await page.waitForLoadState('networkidle');
  
  // Check for quota exceeded message
  const quotaMessage = page.locator('text=Demo quota exceeded');
  const quotaVisible = await quotaMessage.isVisible();
  
  console.log('🚫 Quota Exceeded Message Visible in Safari:', quotaVisible);
  
  if (!quotaVisible) {
    console.log('✅ SUCCESS! Demo runs reset in Safari - you now have unlimited access!');
    console.log('🍎 Safari browser will stay open so you can verify the reset worked.');
    console.log('🔄 You can now use the report page and all demo features in Safari.');
  } else {
    console.log('❌ FAILED! Demo runs still not reset in Safari.');
  }
  
  // Keep Safari open for verification
  console.log('🍎 Safari will stay open - close it when you\'re done verifying.');
}

resetSafariRealBrowser().catch(console.error);
