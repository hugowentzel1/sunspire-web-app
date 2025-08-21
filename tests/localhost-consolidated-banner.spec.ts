import { test, expect } from '@playwright/test';

test('Show consolidated banner working on localhost', async ({ page }) => {
  console.log('🔍 Opening localhost to show consolidated banner...');
  
  // Go to the localhost Meta-branded report page
  await page.goto('http://localhost:3000/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740&company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  console.log('📱 Page loaded! Taking screenshots to show the fix...');
  
  // Take a full page screenshot to show the result
  await page.screenshot({ 
    path: 'test-results/localhost-consolidated-banner.png', 
    fullPage: true 
  });
  
  console.log('📸 Full page screenshot saved: test-results/localhost-consolidated-banner.png');
  
  // Count elements to verify the fix
  const headers = await page.locator('header').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const pricingLinks = await page.locator('text=Pricing').count();
  const partnersLinks = await page.locator('text=Partners').count();
  const supportLinks = await page.locator('text=Support').count();
  const newAnalysisButtons = await page.locator('text=New Analysis').count();
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  console.log(`🔹 Header elements: ${headers} (should be 1)`);
  console.log(`🔹 Meta text elements: ${metaElements} (should be 1: header only)`);
  console.log(`🔹 SOLAR INTELLIGENCE elements: ${solarElements} (should be 1: header only)`);
  console.log(`🔹 Pricing links: ${pricingLinks} (should be 1)`);
  console.log(`🔹 Partners links: ${partnersLinks} (should be 1)`);
  console.log(`🔹 Support links: ${supportLinks} (should be 1)`);
  console.log(`🔹 New Analysis buttons: ${newAnalysisButtons} (should be 1)`);
  
  // Take a screenshot of just the header section for clearer view
  await page.locator('header').screenshot({ 
    path: 'test-results/localhost-header-closeup.png' 
  });
  
  console.log('📸 Header closeup saved: test-results/localhost-header-closeup.png');
  
  // Show the current URL
  const currentUrl = page.url();
  console.log(`\n📍 Current URL: ${currentUrl}`);
  
  // Verify the fix worked
  if (headers === 1 && metaElements === 1 && solarElements === 1 && 
      pricingLinks === 1 && partnersLinks === 1 && supportLinks === 1 && 
      newAnalysisButtons === 1) {
    console.log('\n✅ SUCCESS! Double banner issue is COMPLETELY FIXED!');
    console.log('   ✓ Only one header element');
    console.log('   ✓ All navigation links present (Pricing, Partners, Support)');
    console.log('   ✓ New Analysis button integrated into main banner');
    console.log('   ✓ No duplicate banners or visual confusion');
    console.log('\n🎯 The consolidated banner is working perfectly!');
  } else {
    console.log('\n❌ ISSUE: Double banner may still exist or elements missing');
  }
  
  // Test that the New Analysis button works
  console.log('\n🧪 Testing New Analysis button functionality...');
  await page.locator('text=New Analysis').click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
  
  // Take screenshot after clicking New Analysis
  await page.screenshot({ 
    path: 'test-results/localhost-after-new-analysis.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot after clicking New Analysis: test-results/localhost-after-new-analysis.png');
  
  // Verify we're back on the main page
  const newUrl = page.url();
  console.log(`\n📍 URL after clicking New Analysis: ${newUrl}`);
  
  if (newUrl.includes('/?') || newUrl === 'http://localhost:3000/') {
    console.log('✅ New Analysis button works correctly - navigates back to main page');
  } else {
    console.log('❌ New Analysis button may not be working correctly');
  }
  
  console.log('\n🎉 Test complete! Check the screenshots to see the consolidated banner in action!');
});
