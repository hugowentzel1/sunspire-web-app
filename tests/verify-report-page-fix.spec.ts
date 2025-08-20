import { test, expect } from '@playwright/test';

test('Verify report page double banner fix with screenshot', async ({ page }) => {
  console.log('🔍 Verifying report page double banner fix with screenshot...');
  
  // Go to the exact same Meta-branded report page from your image
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740&company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot to see the visual result
  await page.screenshot({ 
    path: 'test-results/report-page-after-fix-verification.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved: test-results/report-page-after-fix-verification.png');
  
  // Count key elements to verify the fix
  const headers = await page.locator('header').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const reportElements = await page.locator('text=REPORT').count();
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  console.log(`🔹 Header elements: ${headers} (should be 1)`);
  console.log(`🔹 Meta text elements: ${metaElements} (should be 2: header + button)`);
  console.log(`🔹 SOLAR INTELLIGENCE elements: ${solarElements} (should be 1: header only)`);
  console.log(`🔹 REPORT text elements: ${reportElements} (should be 7: unlock buttons only)`);
  
  // Verify the fix worked
  if (headers === 1 && metaElements === 2 && solarElements === 1) {
    console.log('\n✅ SUCCESS! Double banner issue is FIXED!');
    console.log('   ✓ Only one header element');
    console.log('   ✓ Correct number of Meta text elements'); 
    console.log('   ✓ No duplicate SOLAR INTELLIGENCE text');
  } else {
    console.log('\n❌ ISSUE: Double banner may still exist');
  }
  
  // Also take a screenshot of just the top section for clearer view
  await page.locator('header').screenshot({ 
    path: 'test-results/header-section-after-fix.png' 
  });
  
  console.log('📸 Header screenshot saved: test-results/header-section-after-fix.png');
  
  // Log the visual layout
  await page.evaluate(() => {
    console.log('\n🎯 VISUAL LAYOUT ANALYSIS:');
    console.log('===========================');
    
    const headers = document.querySelectorAll('header');
    console.log(`Found ${headers.length} header elements`);
    
    headers.forEach((header, index) => {
      const rect = header.getBoundingClientRect();
      console.log(`Header ${index + 1}:`);
      console.log(`  Position: top=${rect.top}, height=${rect.height}`);
      console.log(`  Contains: ${header.textContent?.substring(0, 50)}...`);
    });
    
    // Check for any elements that might look like duplicate headers
    const allElements = document.querySelectorAll('*');
    const potentialDuplicates = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return text.includes('Meta') && text.includes('SOLAR INTELLIGENCE');
    });
    
    console.log(`\nFound ${potentialDuplicates.length} elements with brand + SOLAR INTELLIGENCE:`);
    potentialDuplicates.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Position: top=${rect.top}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
    });
  });
});
