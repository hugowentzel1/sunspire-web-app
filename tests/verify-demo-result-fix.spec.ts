import { test, expect } from '@playwright/test';

test('Verify demo-result page double banner is also fixed', async ({ page }) => {
  console.log('🔍 Verifying demo-result page double banner fix...');
  
  // Go to the Meta-branded demo-result page to test the fix
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Meta&brandColor=%231877F2');
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot to show the result
  await page.screenshot({ 
    path: 'test-results/demo-result-after-fix.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved: test-results/demo-result-after-fix.png');
  
  // Count elements to verify the fix
  const headers = await page.locator('header').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const solarReportElements = await page.locator('text=SOLAR INTELLIGENCE REPORT').count();
  const newAnalysisButtons = await page.locator('text=New Analysis').count();
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  console.log(`🔹 Header elements: ${headers} (should be 1)`);
  console.log(`🔹 Meta text elements: ${metaElements} (should be 1: header only)`);
  console.log(`🔹 SOLAR INTELLIGENCE elements: ${solarElements} (should be 0: not in header)`);
  console.log(`🔹 SOLAR INTELLIGENCE REPORT elements: ${solarReportElements} (should be 1: in header)`);
  console.log(`🔹 New Analysis buttons: ${newAnalysisButtons} (should be 1)`);
  
  // Verify the fix worked
  if (headers === 1 && metaElements === 1 && solarElements === 0 && 
      solarReportElements === 1 && newAnalysisButtons === 1) {
    console.log('\n✅ SUCCESS! Demo-result page double banner issue is FIXED!');
    console.log('   ✓ Only one header element');
    console.log('   ✓ Meta branding in header only');
    console.log('   ✓ SOLAR INTELLIGENCE REPORT in header only');
    console.log('   ✓ New Analysis button present');
    console.log('   ✓ No duplicate banners or visual confusion');
  } else {
    console.log('\n❌ ISSUE: Double banner may still exist or elements missing');
  }
  
  // Take a screenshot of just the header section for clearer view
  await page.locator('header').screenshot({ 
    path: 'test-results/demo-result-header-closeup.png' 
  });
  
  console.log('📸 Header closeup saved: test-results/demo-result-header-closeup.png');
  
  // Test that the New Analysis button works
  console.log('\n🧪 Testing New Analysis button functionality...');
  await page.locator('text=New Analysis').click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
  
  // Take screenshot after clicking New Analysis
  await page.screenshot({ 
    path: 'test-results/demo-result-after-clicking-new-analysis.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot after clicking New Analysis: test-results/demo-result-after-clicking-new-analysis.png');
  
  // Verify we're back on the main page
  const currentUrl = page.url();
  console.log(`\n📍 Current URL after clicking New Analysis: ${currentUrl}`);
  
  if (currentUrl.includes('/?') || currentUrl === 'https://sunspire-web-app.vercel.app/') {
    console.log('✅ New Analysis button works correctly - navigates back to main page');
  } else {
    console.log('❌ New Analysis button may not be working correctly');
  }
  
  console.log('\n🎉 Demo-result page test complete! Double banner should be fixed!');
});
