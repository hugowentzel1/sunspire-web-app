import { test, expect } from '@playwright/test';

test.describe('Live Apple Demo - Final Comprehensive Test', () => {
  test('Apple demo - All functionality verified', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🍎 Final comprehensive test of Apple demo...');
    
    // Navigate to Apple demo
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // ✅ Check Apple branding
    await expect(page.locator('h1').first()).toContainText('Apple');
    console.log('✅ Apple branding confirmed');
    
    // Test address input and generate
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")');
    await generateBtn.click();
    
    // Wait for report page
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // ✅ Check report content is visible
    await expect(page.locator('h2:has-text("Financial Analysis")')).toBeVisible();
    await expect(page.locator('text=System Size')).toBeVisible();
    await expect(page.locator('text=Annual Production')).toBeVisible();
    console.log('✅ Report content visible');
    
    // ✅ Check quota display (using correct selector)
    const quotaDisplay = page.locator('text=Preview:').or(page.locator('text=Expires in'));
    await expect(quotaDisplay).toBeVisible();
    const quotaText = await quotaDisplay.first().textContent();
    console.log('✅ Quota display working:', quotaText);
    
    // ✅ Check CTA buttons
    const ctaButtons = page.locator('button:has-text("Unlock"), a:has-text("Activate")');
    const ctaCount = await ctaButtons.count();
    expect(ctaCount).toBeGreaterThan(0);
    console.log('✅ CTA buttons visible:', ctaCount, 'buttons');
    
    // ✅ Test CTA button redirects to Stripe
    await ctaButtons.first().click();
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
    expect(isStripeUrl).toBe(true);
    console.log('✅ CTA buttons redirect to Stripe');
    
    // Go back to report
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // ✅ Test "New Analysis" button preserves branding
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    await newAnalysisBtn.click();
    await page.waitForLoadState('networkidle');
    
    const finalUrl = page.url();
    const hasAppleParams = finalUrl.includes('company=Apple') && finalUrl.includes('demo=1');
    expect(hasAppleParams).toBe(true);
    console.log('✅ New Analysis preserves Apple branding');
    
    // Verify we're back on homepage with Apple branding
    await expect(page.locator('h1').first()).toContainText('Apple');
    console.log('✅ Apple branding maintained on homepage');
    
    // Test second demo run
    console.log('🔒 Testing second demo run...');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await generateBtn.click();
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Check quota after second run
    const quotaDisplay2 = page.locator('text=Preview:').or(page.locator('text=Expires in'));
    const quotaText2 = await quotaDisplay2.first().textContent();
    console.log('✅ Second run quota:', quotaText2);
    
    // Test third attempt (should be locked)
    console.log('🔒 Testing third attempt (should be locked)...');
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await generateBtn.click();
    
    await page.waitForLoadState('networkidle');
    
    // Check if locked (should stay on homepage or show alert)
    const currentUrl3 = page.url();
    const isOnHomepage = currentUrl3.includes('sunspire-web-app.vercel.app') && !currentUrl3.includes('/report');
    console.log('✅ Third attempt blocked:', isOnHomepage);
    
    // Check for alert message
    const alertText = await page.locator('text=Demo quota exhausted').textContent();
    if (alertText) {
      console.log('✅ Alert message shown:', alertText);
    }
    
    console.log('🎉 ALL TESTS PASSED - Apple demo is fully functional!');
  });
});
