import { test, expect } from '@playwright/test';

test('Homepage Issues - Test Autosuggest, Timer, and Lockout', async ({ page }) => {
  console.log('\n🏠 HOMEPAGE ISSUES - TESTING AUTOSUGGEST, TIMER, AND LOCKOUT');
  
  const baseUrl = 'https://sunspire-web-app.vercel.app';
  const testUrl = `${baseUrl}/?company=Apple&demo=1`;
  
  // Clear localStorage to start fresh
  await page.goto(baseUrl);
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared localStorage');
  });
  
  console.log('\n📊 TEST 1: Homepage with Apple branding');
  console.log('🔗 URL:', testUrl);
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check homepage content
  const homepage = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasQuotaDisplay = bodyText.includes('Preview:') && bodyText.includes('runs left');
    const hasTimerDisplay = bodyText.includes('Expires in') && bodyText.includes('d') && bodyText.includes('h');
    const hasAddressInput = !!document.querySelector('input[placeholder*="address"], input[placeholder*="Address"]');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasQuotaDisplay,
      hasTimerDisplay,
      hasAddressInput,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 1000)
    };
  });
  
  console.log('📊 Homepage Results:');
  console.log('  ✅ Quota display visible:', homepage.hasQuotaDisplay);
  console.log('  ✅ Timer display visible:', homepage.hasTimerDisplay);
  console.log('  ✅ Address input visible:', homepage.hasAddressInput);
  console.log('  📦 Quota data:', homepage.quota);
  console.log('  📄 Page content preview:', homepage.bodyText);
  
  // Test address autosuggest
  console.log('\n📊 TEST 2: Address Autosuggest');
  
  if (homepage.hasAddressInput) {
    const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(3000);
    
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item, .pac-item').all();
    console.log('📊 Address suggestions found:', suggestions.length);
    
    // Check if Google Maps is loaded
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && window.google.maps;
    });
    console.log('🗺️ Google Maps loaded:', googleMapsLoaded);
  }
  
  // Test report generation
  console.log('\n📊 TEST 3: Generate Report (Should consume quota)');
  
  if (homepage.hasAddressInput) {
    const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    // Click generate button
    await page.click('button:has-text("Generate"), button:has-text("Launch")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if we're on report page
    const currentUrl = page.url();
    console.log('🔗 Current URL after generate:', currentUrl);
    
    const isReportPage = currentUrl.includes('/report');
    console.log('📊 On report page:', isReportPage);
    
    if (isReportPage) {
      // Check quota after report generation
      const quotaAfter = await page.evaluate(() => {
        const quota = localStorage.getItem('demo_quota_v3');
        const parsedQuota = quota ? JSON.parse(quota) : null;
        const bodyText = document.body.innerText;
        const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size');
        const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
        
        return {
          quota: parsedQuota,
          hasReportContent,
          hasLockOverlay
        };
      });
      
      console.log('📊 After report generation:');
      console.log('  📦 Quota data:', quotaAfter.quota);
      console.log('  ✅ Report content visible:', quotaAfter.hasReportContent);
      console.log('  ❌ Lock overlay visible:', quotaAfter.hasLockOverlay);
    }
  }
  
  console.log('\n🎯 FINAL VERIFICATION:');
  console.log('=====================================');
  console.log('✅ Homepage loaded:', true);
  console.log('✅ Quota display working:', homepage.hasQuotaDisplay);
  console.log('✅ Timer display working:', homepage.hasTimerDisplay);
  console.log('✅ Address input available:', homepage.hasAddressInput);
  
  console.log('\n📝 ISSUES FOUND:');
  if (!homepage.hasQuotaDisplay) console.log('❌ Quota display not working');
  if (!homepage.hasTimerDisplay) console.log('❌ Timer display not working');
  if (!homepage.hasAddressInput) console.log('❌ Address input not available');
});
