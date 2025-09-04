import { test, expect } from '@playwright/test';

test('Manual Verification - Stay Up for Visual Check', async ({ page }) => {
  console.log('🚀 Starting manual verification test...');
  
  // Test 1: Dynamic Branding - Tesla
  console.log('📱 Testing Tesla branding...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  
  // Check if Tesla branding is applied
  const teslaBrand = await page.textContent('h1, h2, h3').catch(() => '');
  console.log('✅ Tesla branding check:', teslaBrand.includes('Tesla') ? 'PASS' : 'FAIL');
  
  // Test 2: Demo Limitation System
  console.log('🔒 Testing demo limitation system...');
  
  // First run - should show report
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  const firstRun = await page.locator('[data-testid="report-content"], .report-content, main').isVisible().catch(() => false);
  console.log('✅ First demo run (should show report):', firstRun ? 'PASS' : 'FAIL');
  
  // Second run - should show report
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  const secondRun = await page.locator('[data-testid="report-content"], .report-content, main').isVisible().catch(() => false);
  console.log('✅ Second demo run (should show report):', secondRun ? 'PASS' : 'FAIL');
  
  // Third run - should show lock overlay
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  const thirdRun = await page.locator('[data-testid="lock-overlay"], .lock-overlay, [style*="position: fixed"]').isVisible().catch(() => false);
  console.log('✅ Third demo run (should show lock overlay):', thirdRun ? 'PASS' : 'FAIL');
  
  // Test 3: LockOverlay Design
  console.log('🎨 Testing LockOverlay design...');
  
  if (thirdRun) {
    // Check for brand logo with dynamic colors
    const brandLogo = await page.locator('[style*="background: var(--brand-primary)"], [style*="background: var(--brand)"]').isVisible().catch(() => false);
    console.log('✅ Brand logo with dynamic colors:', brandLogo ? 'PASS' : 'FAIL');
    
    // Check for comparison sections
    const currentSection = await page.locator('text=What You See Now').isVisible().catch(() => false);
    const liveSection = await page.locator('text=What You Get Live').isVisible().catch(() => false);
    console.log('✅ Comparison sections - Current:', currentSection ? 'PASS' : 'FAIL');
    console.log('✅ Comparison sections - Live:', liveSection ? 'PASS' : 'FAIL');
    
    // Check for single CTA button
    const ctaButtons = await page.locator('button').count();
    const activateButtons = await page.locator('button:has-text("Activate")').count();
    const launchButtons = await page.locator('button:has-text("Launch")').count();
    console.log('✅ CTA button count:', ctaButtons);
    console.log('✅ Activate button count:', activateButtons);
    console.log('✅ Launch button count:', launchButtons);
    
    // Check for pricing text (should only appear once)
    const pricingText = await page.locator('text=Most tools cost $2,500+/mo').count();
    console.log('✅ Pricing text count (should be 1):', pricingText);
  }
  
  // Test 4: Different Company Colors
  console.log('🌈 Testing different company colors...');
  
  // Test Apple branding
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(3000);
  const appleBrand = await page.textContent('h1, h2, h3').catch(() => '');
  console.log('✅ Apple branding check:', appleBrand.includes('Apple') ? 'PASS' : 'FAIL');
  
  // Test 5: Stripe Integration
  console.log('💳 Testing Stripe integration...');
  
  // Go to a fresh demo to get to lock overlay
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  
  // Try to click the CTA button
  const ctaButton = page.locator('button:has-text("Activate")').first();
  if (await ctaButton.isVisible()) {
    console.log('✅ CTA button found, attempting click...');
    
    // Set up promise to catch navigation
    const navigationPromise = page.waitForURL('**/checkout.stripe.com/**', { timeout: 10000 });
    
    try {
      await ctaButton.click();
      console.log('✅ CTA button clicked successfully');
      
      // Wait for navigation to Stripe
      await navigationPromise;
      console.log('✅ Successfully redirected to Stripe checkout!');
      
      // Check if we're on Stripe
      const currentUrl = page.url();
      const isStripe = currentUrl.includes('checkout.stripe.com');
      console.log('✅ Stripe redirect verification:', isStripe ? 'PASS' : 'FAIL');
      console.log('✅ Current URL:', currentUrl);
      
    } catch (error) {
      console.log('❌ Stripe redirect failed:', error.message);
    }
  } else {
    console.log('❌ CTA button not found');
  }
  
  console.log('🎉 Manual verification complete!');
  console.log('👀 Browser window will stay open for manual inspection...');
  console.log('🔍 You can now manually verify all features in the browser window.');
  console.log('⏹️  Press Ctrl+C to stop the test and close the browser.');
  
  // Keep the browser open for manual inspection
  await page.waitForTimeout(60000); // Wait 60 seconds
});
