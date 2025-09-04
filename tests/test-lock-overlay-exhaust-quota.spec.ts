import { test, expect } from '@playwright/test';

test('Test LockOverlay by exhausting demo quota', async ({ page }) => {
  console.log('🔒 Testing LockOverlay by exhausting demo quota...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.clear());
  
  // Navigate to demo page - first run
  console.log('🔄 First demo run...');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if we can see the report (should be visible on first run)
  const reportContent = page.locator('text=Solar Report');
  const isReportVisible = await reportContent.isVisible();
  console.log('📊 Report visible on first run:', isReportVisible);
  
  // Navigate away and back to trigger second run
  console.log('🔄 Second demo run...');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if report is still visible (should be visible on second run)
  const isReportVisibleSecond = await reportContent.isVisible();
  console.log('📊 Report visible on second run:', isReportVisibleSecond);
  
  // Navigate away and back to trigger third run (should show lock overlay)
  console.log('🔄 Third demo run (should trigger lock)...');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked');
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  if (isLockVisible) {
    console.log('✅ Lock overlay is working!');
    
    // Test the improved design elements
    const brandLogo = page.locator('div[style*="background: var(--brand-primary)"]');
    const isBrandLogoVisible = await brandLogo.isVisible();
    console.log('🎨 Brand logo visible:', isBrandLogoVisible);
    
    const comparisonGrid = page.locator('div[style*="gridTemplateColumns: 1fr 1fr"]');
    const isComparisonVisible = await comparisonGrid.isVisible();
    console.log('📊 Comparison grid visible:', isComparisonVisible);
    
    const ctaButtons = page.locator('button:has-text("Activate")');
    const buttonCount = await ctaButtons.count();
    console.log('🔘 CTA buttons count:', buttonCount);
    
    // Test CTA button functionality
    if (buttonCount > 0) {
      console.log('🧪 Testing CTA button click...');
      
      // Listen for network requests
      const requests: string[] = [];
      page.on('request', request => {
        if (request.url().includes('stripe') || request.url().includes('checkout')) {
          requests.push(request.url());
        }
      });
      
      // Click the first CTA button
      const firstCTA = ctaButtons.first();
      await firstCTA.click();
      
      // Wait a moment for any network requests
      await page.waitForTimeout(2000);
      
      console.log('🌐 Network requests made:', requests);
      
      // Check if we were redirected to Stripe
      const currentUrl = page.url();
      console.log('🔗 Current URL after click:', currentUrl);
      
      if (currentUrl.includes('checkout.stripe.com')) {
        console.log('✅ Successfully redirected to Stripe checkout!');
      } else {
        console.log('❌ Did not redirect to Stripe checkout');
      }
    }
  } else {
    console.log('❌ Lock overlay not visible - checking demo quota state...');
    
    // Check localStorage for demo quota
    const quotaData = await page.evaluate(() => {
      return localStorage.getItem('demo_quota_v3');
    });
    console.log('💾 Demo quota data:', quotaData);
    
    // Check if report is still visible
    const isReportStillVisible = await reportContent.isVisible();
    console.log('📊 Report still visible:', isReportStillVisible);
  }
});
