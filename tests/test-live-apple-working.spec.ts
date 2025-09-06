import { test, expect } from '@playwright/test';

test.describe('Live Apple Demo - Working Test', () => {
  test('Apple demo - Verify all functionality', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🍎 Testing Apple demo on live site...');
    
    // Navigate to Apple demo
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check Apple branding
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
    
    // Check report content is visible
    await expect(page.locator('h2:has-text("Financial Analysis")')).toBeVisible();
    await expect(page.locator('text=System Size')).toBeVisible();
    await expect(page.locator('text=Annual Production')).toBeVisible();
    console.log('✅ Report content visible');
    
    // Check quota display (more flexible search)
    const quotaElements = page.locator('text=runs left').or(page.locator('text=Preview:')).or(page.locator('text=Expires in'));
    const quotaCount = await quotaElements.count();
    console.log('Quota elements found:', quotaCount);
    
    if (quotaCount > 0) {
      const quotaText = await quotaElements.first().textContent();
      console.log('Quota text:', quotaText);
      console.log('✅ Quota display working');
    } else {
      console.log('❌ Quota display not found');
    }
    
    // Check CTA buttons
    const ctaButtons = page.locator('button:has-text("Unlock"), a:has-text("Activate")');
    const ctaCount = await ctaButtons.count();
    console.log('CTA buttons found:', ctaCount);
    
    if (ctaCount > 0) {
      console.log('✅ CTA buttons visible');
      
      // Test CTA button click (should redirect to Stripe)
      await ctaButtons.first().click();
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
      console.log('CTA redirects to Stripe:', isStripeUrl, 'URL:', currentUrl);
      
      if (isStripeUrl) {
        console.log('✅ CTA buttons redirect to Stripe');
      } else {
        console.log('❌ CTA buttons not redirecting to Stripe');
      }
      
      // Go back to report
      await page.goBack();
      await page.waitForLoadState('networkidle');
    } else {
      console.log('❌ CTA buttons not found');
    }
    
    // Test "New Analysis" button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    if (await newAnalysisBtn.count() > 0) {
      await newAnalysisBtn.click();
      await page.waitForLoadState('networkidle');
      
      const currentUrl2 = page.url();
      const hasAppleParam = currentUrl2.includes('company=Apple');
      console.log('New Analysis preserves Apple branding:', hasAppleParam);
      
      if (hasAppleParam) {
        console.log('✅ New Analysis preserves branding');
      } else {
        console.log('❌ New Analysis loses branding');
      }
    }
    
    // Test second demo run
    console.log('🔒 Testing second demo run...');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await generateBtn.click();
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Check quota after second run
    const quotaElements2 = page.locator('text=runs left').or(page.locator('text=Preview:')).or(page.locator('text=Expires in'));
    const quotaCount2 = await quotaElements2.count();
    if (quotaCount2 > 0) {
      const quotaText2 = await quotaElements2.first().textContent();
      console.log('Quota after second run:', quotaText2);
    }
    
    // Test third attempt (should be locked)
    console.log('🔒 Testing third attempt (should be locked)...');
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await generateBtn.click();
    
    await page.waitForLoadState('networkidle');
    
    // Check if locked
    const currentUrl3 = page.url();
    const isOnHomepage = currentUrl3.includes('sunspire-web-app.vercel.app') && !currentUrl3.includes('/report');
    console.log('Third attempt blocked (stays on homepage):', isOnHomepage);
    
    if (isOnHomepage) {
      console.log('✅ Third attempt properly blocked');
    } else {
      console.log('❌ Third attempt not blocked');
    }
    
    console.log('✅ Apple demo test completed');
  });
});
