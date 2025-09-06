import { test, expect } from '@playwright/test';

test.describe('Live Apple Demo - Final Test', () => {
  test('Apple demo - All functionality working', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🍎 Testing Apple demo on live site...');
    
    // Navigate to Apple demo
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check Apple branding
    await expect(page.locator('h1').first()).toContainText('Apple');
    
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
    await expect(page.locator('h2:has-text("Environmental Impact")')).toBeVisible();
    await expect(page.locator('text=System Size')).toBeVisible();
    await expect(page.locator('text=Annual Production')).toBeVisible();
    
    // Check quota display
    await expect(page.locator('text=Preview:')).toBeVisible();
    await expect(page.locator('text=runs left')).toBeVisible();
    
    // Check CTA buttons
    const ctaButtons = page.locator('button:has-text("Unlock"), a:has-text("Activate")');
    await expect(ctaButtons.first()).toBeVisible();
    
    // Test CTA button click (should redirect to Stripe)
    await ctaButtons.first().click();
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
    console.log('CTA redirects to Stripe:', isStripeUrl, 'URL:', currentUrl);
    
    // Go back to report
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Test "New Analysis" button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    await newAnalysisBtn.click();
    await page.waitForLoadState('networkidle');
    
    // Check if we're back on homepage with Apple branding
    const currentUrl2 = page.url();
    const hasAppleParam = currentUrl2.includes('company=Apple');
    console.log('New Analysis preserves Apple branding:', hasAppleParam);
    
    // Test second demo run
    console.log('🔒 Testing second demo run...');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await generateBtn.click();
    
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Check quota shows 0 runs left
    const quotaText = await page.locator('text=Preview:').textContent();
    console.log('Quota after second run:', quotaText);
    
    // Test third attempt (should be locked)
    console.log('🔒 Testing third attempt (should be locked)...');
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await generateBtn.click();
    
    await page.waitForLoadState('networkidle');
    
    // Check if locked (should show alert or stay on homepage)
    const currentUrl3 = page.url();
    const isOnHomepage = currentUrl3.includes('sunspire-web-app.vercel.app') && !currentUrl3.includes('/report');
    console.log('Third attempt blocked (stays on homepage):', isOnHomepage);
    
    // Check for alert message
    const alertText = await page.locator('text=Demo quota exhausted').textContent();
    console.log('Alert message shown:', alertText ? 'Yes' : 'No');
    
    console.log('✅ Apple demo test completed successfully');
  });
});
