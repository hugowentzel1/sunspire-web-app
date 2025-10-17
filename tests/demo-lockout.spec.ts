import { test, expect } from '@playwright/test';

test.describe('Demo Quota Lockout', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to reset quota
    await page.goto('/?company=Tesla&demo=1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show lock overlay after exhausting demo runs', async ({ page }) => {
    // Start with fresh quota (2 runs)
    await page.goto('/?company=Tesla&demo=1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check initial quota display
    const quotaText = await page.locator('text=/Preview:.*runs left/').first();
    await expect(quotaText).toBeVisible();
    console.log('Initial quota:', await quotaText.textContent());

    // Fill in an address
    const addressInput = page.locator('input[placeholder*="address"]').first();
    await addressInput.click();
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(1000);

    // Click the first autocomplete suggestion if it appears
    const firstSuggestion = page.locator('[role="option"]').first();
    if (await firstSuggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
    }

    // First click - should navigate to report (quota: 2→1)
    console.log('🔹 First click - should work');
    const generateButton = page.locator('button:has-text("Generate Solar Report")').first();
    await generateButton.click();
    
    // Wait for navigation to report page
    await page.waitForURL('**/report?*', { timeout: 10000 });
    console.log('✅ First click successful - navigated to report');
    
    // Go back to home
    await page.goto('/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check quota is now 1
    const quota1Text = await page.locator('text=/Preview:.*run.*left/').first();
    console.log('After first run:', await quota1Text.textContent());

    // Fill address again
    await addressInput.click();
    await addressInput.fill('1 Apple Park Way, Cupertino, CA');
    await page.waitForTimeout(1000);
    
    const secondSuggestion = page.locator('[role="option"]').first();
    if (await secondSuggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await secondSuggestion.click();
      await page.waitForTimeout(1000);
    }

    // Second click - should navigate to report (quota: 1→0)
    console.log('🔹 Second click - should work');
    await generateButton.click();
    
    await page.waitForURL('**/report?*', { timeout: 10000 });
    console.log('✅ Second click successful - navigated to report');
    
    // Go back to home
    await page.goto('/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check quota is now 0
    const quota0Text = await page.locator('text=/Demo limit reached/').first();
    await expect(quota0Text).toBeVisible();
    console.log('After second run: Demo limit reached message shown');

    // Fill address for third attempt
    await addressInput.click();
    await addressInput.fill('1 Microsoft Way, Redmond, WA');
    await page.waitForTimeout(1000);

    // Third click - should show lock overlay (quota: 0, no navigation)
    console.log('🔹 Third click - should trigger lock overlay');
    await generateButton.click();
    
    // Wait a moment for the lock overlay to appear
    await page.waitForTimeout(2000);
    
    // Verify lock overlay is visible
    const lockOverlay = page.locator('text="Ready to Launch Your Branded, Customer-Facing Tool?"').first();
    await expect(lockOverlay).toBeVisible({ timeout: 5000 });
    console.log('✅ Lock overlay appeared!');
    
    // Verify we did NOT navigate to report page
    expect(page.url()).toContain('/?company=Tesla&demo=1');
    expect(page.url()).not.toContain('/report');
    console.log('✅ Correctly stayed on homepage (no navigation)');
    
    // Take a screenshot of the lock overlay
    await page.screenshot({ path: 'tests/screenshots/demo-lockout.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/demo-lockout.png');

    // Verify lock overlay has the CTA button
    const ctaButton = page.locator('button:has-text("Launch Your Branded Version Now")').last();
    await expect(ctaButton).toBeVisible();
    console.log('✅ Lock overlay CTA button is visible');

    // Verify the pricing text
    const pricingText = page.locator('text=/\\$99\\/mo.*\\$399 setup/');
    await expect(pricingText).toBeVisible();
    console.log('✅ Pricing information is visible in lock overlay');
  });

  test('should immediately show lock overlay if quota is already 0', async ({ page }) => {
    // Manually set quota to 0
    await page.goto('/?company=Google&demo=1');
    await page.evaluate(() => {
      const key = 'demo_quota_v5';
      const link = 'http://localhost:3000/?company=Google&demo=1';
      localStorage.setItem(key, JSON.stringify({ [link]: 0 }));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify the "Demo limit reached" message
    const limitMessage = page.locator('text=/Demo limit reached/').first();
    await expect(limitMessage).toBeVisible();
    console.log('✅ Demo limit reached message shown');

    // Fill in address
    const addressInput = page.locator('input[placeholder*="address"]').first();
    await addressInput.click();
    await addressInput.fill('1 Infinite Loop, Cupertino, CA');
    await page.waitForTimeout(1000);

    // Click generate button
    const generateButton = page.locator('button:has-text("Generate Solar Report")').first();
    await generateButton.click();
    
    // Wait for lock overlay
    await page.waitForTimeout(2000);
    
    // Verify lock overlay appears immediately
    const lockOverlay = page.locator('text="Ready to Launch Your Branded, Customer-Facing Tool?"').first();
    await expect(lockOverlay).toBeVisible({ timeout: 5000 });
    console.log('✅ Lock overlay appeared immediately with 0 quota');
    
    // Verify no navigation occurred
    expect(page.url()).toContain('/?company=Google&demo=1');
    expect(page.url()).not.toContain('/report');
    console.log('✅ No navigation with 0 quota');
  });
});

