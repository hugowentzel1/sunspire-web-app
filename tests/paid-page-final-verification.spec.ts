import { test, expect } from '@playwright/test';

test.describe('Paid Page Final Verification', () => {
  test('paid page to report page flow works correctly', async ({ page }) => {
    // Navigate to paid page with Microsoft branding
    await page.goto('/paid?company=microsoft&demo=0');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of paid page
    await page.screenshot({ path: 'screenshots/paid-page-final.png', fullPage: true });
    
    // Verify page loaded correctly
    await expect(page.locator('body')).toBeVisible();
    
    // Fill in complete address
    const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="street" i]').first();
    await addressInput.fill('123 Main Street, New York, NY 10001');
    await page.waitForTimeout(1000);
    
    // Click submit button
    const submitButton = page.locator('button[data-cta-button]').first();
    await submitButton.click({ force: true });
    
    // Wait for navigation to report page
    await page.waitForURL('**/report**', { timeout: 10000 });
    
    // Take screenshot of report page
    await page.screenshot({ path: 'screenshots/report-page-final.png', fullPage: true });
    
    // Verify we're on report page with correct parameters
    expect(page.url()).toContain('/report');
    expect(page.url()).toContain('demo=0');
    expect(page.url()).toContain('company=microsoft');
    
    // Verify paid-specific elements are present
    await expect(page.locator('[data-testid="paid-cta-top"]')).toBeVisible();
    await expect(page.locator('[data-testid="paid-cta-bottom"]')).toBeVisible();
    await expect(page.locator('[data-testid="back-home-link"]')).toBeVisible();
    
    // Verify demo elements are NOT present
    await expect(page.locator('text=Unlock Full Report')).not.toBeVisible();
    await expect(page.locator('text=Activate on Your Domain')).not.toBeVisible();
    
    // Verify navigation doesn't show demo links
    await expect(page.locator('nav a:has-text("Pricing")')).not.toBeVisible();
    await expect(page.locator('nav a:has-text("Partners")')).not.toBeVisible();
    await expect(page.locator('nav a:has-text("Support")')).not.toBeVisible();
    
    // Check footer has company logo
    await expect(page.locator('footer img[alt*="logo"]')).toBeVisible();
    
    console.log('✅ Paid page to report page flow working correctly!');
  });
});
