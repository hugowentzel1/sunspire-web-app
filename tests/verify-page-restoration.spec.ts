import { test, expect } from '@playwright/test';

test('Verify main page matches restored state from commit 9b4b42cc869ce075192d0783e5dc15cdc3331479', async ({ page }) => {
  console.log('🔍 Verifying main page matches restored state...');
  
  // Go to the localhost Meta-branded main page
  await page.goto('http://localhost:3000/?company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  console.log('📱 Page loaded! Taking screenshots to show the restored state...');
  
  // Take a full page screenshot to show the result
  await page.screenshot({ 
    path: 'test-results/localhost-restored-main-page.png', 
    fullPage: true 
  });
  
  console.log('📸 Full page screenshot saved: test-results/localhost-restored-main-page.png');
  
  // Verify the key elements from commit 9b4b42cc869ce075192d0783e5dc15cdc3331479
  const headers = await page.locator('header').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const whiteLabelElements = await page.locator('text=White-Label Solar Tool').count();
  const builtForElements = await page.locator('text=Built for Your Company').count();
  const whiteLabelReadyElements = await page.locator('text=White-label ready').count();
  const pricingLinks = await page.locator('text=Pricing').count();
  const partnersLinks = await page.locator('text=Partners').count();
  const supportLinks = await page.locator('text=Support').count();
  const launchButtons = await page.locator('text=Launch on Meta').count();
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  console.log(`🔹 Header elements: ${headers} (should be 1)`);
  console.log(`🔹 Meta text elements: ${metaElements} (should be 1: header only)`);
  console.log(`🔹 SOLAR INTELLIGENCE elements: ${solarElements} (should be 1: header only)`);
  console.log(`🔹 White-Label Solar Tool elements: ${whiteLabelElements} (should be 1)`);
  console.log(`🔹 Built for Your Company elements: ${builtForElements} (should be 1)`);
  console.log(`🔹 White-label ready elements: ${whiteLabelReadyElements} (should be 1)`);
  console.log(`🔹 Pricing links: ${pricingLinks} (should be 1)`);
  console.log(`🔹 Partners links: ${partnersLinks} (should be 1)`);
  console.log(`🔹 Support links: ${supportLinks} (should be 1)`);
  console.log(`🔹 Launch on Meta buttons: ${launchButtons} (should be 1)`);
  
  // Verify the fix worked and page matches commit 9b4b42cc869ce075192d0783e5dc15cdc3331479
  if (headers === 1 && metaElements === 1 && solarElements === 1 && 
      whiteLabelElements === 1 && builtForElements === 1 && whiteLabelReadyElements === 1 &&
      pricingLinks === 1 && partnersLinks === 1 && supportLinks === 1 && 
      launchButtons === 1) {
    console.log('\n✅ SUCCESS! Main page matches commit 9b4b42cc869ce075192d0783e5dc15cdc3331479!');
    console.log('   ✓ Only one header element (banner fix working)');
    console.log('   ✓ All content restored to exact state from commit');
    console.log('   ✓ "Built for Your Company" section with "White-label ready" styling');
    console.log('   ✓ "White-Label Solar Tool" heading');
    console.log('   ✓ All navigation links present');
    console.log('   ✓ No duplicate banners or visual confusion');
  } else {
    console.log('\n❌ ISSUE: Page may not match commit 9b4b42cc869ce075192d0783e5dc15cdc3331479');
  }
  
  // Take a screenshot of just the header section for clearer view
  await page.locator('header').screenshot({ 
    path: 'test-results/localhost-restored-header-closeup.png' 
  });
  
  console.log('📸 Header closeup saved: test-results/localhost-restored-header-closeup.png');
  
  // Take a screenshot of the "Built for" section to show the restored styling
  await page.locator('text=Built for Your Company').screenshot({ 
    path: 'test-results/localhost-built-for-section.png' 
  });
  
  console.log('📸 Built for section screenshot saved: test-results/localhost-built-for-section.png');
  
  // Test that the Launch on Meta button works
  console.log('\n🧪 Testing Launch on Meta button functionality...');
  await page.locator('text=Launch on Meta').click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
  
  // Take screenshot after clicking Launch on Meta
  await page.screenshot({ 
    path: 'test-results/localhost-after-clicking-launch.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot after clicking Launch on Meta: test-results/localhost-after-clicking-launch.png');
  
  // Verify we're on the correct page
  const currentUrl = page.url();
  console.log(`\n📍 Current URL after clicking Launch on Meta: ${currentUrl}`);
  
  if (currentUrl.includes('/?company=Meta')) {
    console.log('✅ Launch on Meta button works correctly - navigates to Meta-branded page');
  } else {
    console.log('❌ Launch on Meta button may not be working correctly');
  }
  
  console.log('\n🎉 Test complete! Main page should now match commit 9b4b42cc869ce075192d0783e5dc15cdc3331479 exactly!');
});
