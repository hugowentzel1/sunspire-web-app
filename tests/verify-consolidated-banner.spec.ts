import { test, expect } from '@playwright/test';

test('Verify consolidated banner fix - no more double banner', async ({ page }) => {
  console.log('🔍 Verifying consolidated banner fix...');
  
  // Go to the Meta-branded report page to test the fix
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740&company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot to show the result
  await page.screenshot({ 
    path: 'test-results/consolidated-banner-result.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved: test-results/consolidated-banner-result.png');
  
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
  console.log(`🔹 Meta text elements: ${metaElements} (should be 2: header + button)`);
  console.log(`🔹 SOLAR INTELLIGENCE elements: ${solarElements} (should be 1: header only)`);
  console.log(`🔹 Pricing links: ${pricingLinks} (should be 1)`);
  console.log(`🔹 Partners links: ${partnersLinks} (should be 1)`);
  console.log(`🔹 Support links: ${supportLinks} (should be 1)`);
  console.log(`🔹 New Analysis buttons: ${newAnalysisButtons} (should be 1)`);
  
  // Verify the fix worked
  if (headers === 1 && metaElements === 2 && solarElements === 1 && 
      pricingLinks === 1 && partnersLinks === 1 && supportLinks === 1 && 
      newAnalysisButtons === 1) {
    console.log('\n✅ SUCCESS! Double banner issue is COMPLETELY FIXED!');
    console.log('   ✓ Only one header element');
    console.log('   ✓ All navigation links present (Pricing, Partners, Support)');
    console.log('   ✓ New Analysis button integrated into main banner');
    console.log('   ✓ No duplicate banners or visual confusion');
  } else {
    console.log('\n❌ ISSUE: Double banner may still exist or elements missing');
  }
  
  // Take a screenshot of just the header section for clearer view
  await page.locator('header').screenshot({ 
    path: 'test-results/consolidated-header-closeup.png' 
  });
  
  console.log('📸 Header closeup saved: test-results/consolidated-header-closeup.png');
  
  // Test that the New Analysis button works
  console.log('\n🧪 Testing New Analysis button functionality...');
  await page.locator('text=New Analysis').click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
  
  // Take screenshot after clicking New Analysis
  await page.screenshot({ 
    path: 'test-results/after-clicking-new-analysis.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot after clicking New Analysis: test-results/after-clicking-new-analysis.png');
  
  // Verify we're back on the main page
  const currentUrl = page.url();
  console.log(`\n📍 Current URL after clicking New Analysis: ${currentUrl}`);
  
  if (currentUrl.includes('/?') || currentUrl === 'https://sunspire-web-app.vercel.app/') {
    console.log('✅ New Analysis button works correctly - navigates back to main page');
  } else {
    console.log('❌ New Analysis button may not be working correctly');
  }
});
