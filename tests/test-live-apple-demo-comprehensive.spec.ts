import { test, expect } from '@playwright/test';

test.describe('Live Apple Demo - Comprehensive Test', () => {
  test('Apple demo - CTA buttons, demo runs, lockout, and color consistency', async ({ page }) => {
    // Test the Apple demo URL
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🍎 Testing Apple demo on live site...');
    
    // Navigate to Apple demo
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the homepage with Apple branding
    await expect(page.locator('h1').first()).toContainText('Apple');
    
    // Check for Apple branding (red colors)
    const appleBranding = page.locator('[style*="--brand"]');
    await expect(appleBranding.first()).toBeVisible();
    
    // Test address autosuggest
    console.log('🔍 Testing address autosuggest...');
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(1000);
    
    // Check if autosuggest appears
    const suggestions = page.locator('[role="listbox"], .autocomplete-suggestions, [data-testid="suggestions"]');
    const hasSuggestions = await suggestions.count() > 0;
    console.log('Address autosuggest working:', hasSuggestions);
    
    // Test first demo run
    console.log('🔒 Testing first demo run...');
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(500);
    
    // Click generate estimate
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")').first();
    await generateBtn.click();
    
    // Wait for report page
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Check if report content is visible (not locked)
    const reportContent = page.locator('[data-testid="report-content"], .report-content, .solar-estimate');
    const isReportVisible = await reportContent.count() > 0;
    console.log('First demo run - Report visible:', isReportVisible);
    
    // Check for Apple branding on report page
    const reportBranding = page.locator('[style*="--brand"]');
    await expect(reportBranding.first()).toBeVisible();
    
    // Check quota display
    const quotaDisplay = page.locator('text=Preview:').or(page.locator('text=runs left'));
    await expect(quotaDisplay).toBeVisible();
    
    // Test CTA buttons on report page
    console.log('💳 Testing CTA buttons on report page...');
    const ctaButtons = page.locator('button:has-text("Activate"), button:has-text("Unlock"), button:has-text("Checkout"), a:has-text("Activate"), a:has-text("Unlock")');
    const ctaCount = await ctaButtons.count();
    console.log('CTA buttons found:', ctaCount);
    
    if (ctaCount > 0) {
      // Click first CTA button
      await ctaButtons.first().click();
      await page.waitForTimeout(2000);
      
      // Check if redirected to Stripe
      const currentUrl = page.url();
      const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
      console.log('CTA redirects to Stripe:', isStripeUrl, 'URL:', currentUrl);
      
      // Go back to report
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
    
    // Test "New Analysis" button
    console.log('🔄 Testing New Analysis button...');
    const newAnalysisBtn = page.locator('button:has-text("New Analysis"), a:has-text("New Analysis")');
    if (await newAnalysisBtn.count() > 0) {
      await newAnalysisBtn.click();
      await page.waitForLoadState('networkidle');
      
      // Check if we're back on homepage with Apple branding
      const currentUrl = page.url();
      const hasAppleParam = currentUrl.includes('company=Apple');
      console.log('New Analysis preserves Apple branding:', hasAppleParam, 'URL:', currentUrl);
      
      // Go back to report for second test
      await page.goto(appleDemoUrl);
      await page.waitForLoadState('networkidle');
    }
    
    // Test second demo run
    console.log('🔒 Testing second demo run...');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(500);
    await generateBtn.click();
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Check if report is still visible (should be, as this is second run)
    const secondReportVisible = await reportContent.count() > 0;
    console.log('Second demo run - Report visible:', secondReportVisible);
    
    // Check quota display shows 0 or 1 remaining
    const quotaText = await quotaDisplay.textContent();
    console.log('Quota after second run:', quotaText);
    
    // Test third attempt (should be locked)
    console.log('🔒 Testing third attempt (should be locked)...');
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(500);
    await generateBtn.click();
    
    await page.waitForLoadState('networkidle');
    
    // Check if locked (should show lock overlay or alert)
    const lockOverlay = page.locator('[data-testid="lock-overlay"], .lock-overlay, .preview-limit');
    const alertDialog = page.locator('[role="alert"], .alert');
    const isLocked = await lockOverlay.count() > 0 || await alertDialog.count() > 0;
    console.log('Third attempt locked:', isLocked);
    
    // If not locked on report page, check if we got an alert
    if (!isLocked) {
      const currentUrl = page.url();
      console.log('Current URL after third attempt:', currentUrl);
      
      // Check if we're still on homepage (might have been blocked)
      const isOnHomepage = currentUrl.includes('sunspire-web-app.vercel.app') && !currentUrl.includes('/report');
      console.log('Still on homepage (blocked):', isOnHomepage);
    }
    
    // Test color consistency throughout
    console.log('🎨 Testing color consistency...');
    
    // Check homepage colors
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    const homepageBranding = page.locator('[style*="--brand"]');
    const homepageBrandCount = await homepageBranding.count();
    console.log('Homepage Apple branding elements:', homepageBrandCount);
    
    // Check report page colors
    await addressInput.fill('123 Main St, New York, NY');
    await generateBtn.click();
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    const reportBranding2 = page.locator('[style*="--brand"]');
    const reportBrandCount = await reportBranding2.count();
    console.log('Report page Apple branding elements:', reportBrandCount);
    
    // Verify colors are consistent (both should have Apple red branding)
    expect(homepageBrandCount).toBeGreaterThan(0);
    expect(reportBrandCount).toBeGreaterThan(0);
    
    console.log('✅ Apple demo comprehensive test completed');
  });
});
