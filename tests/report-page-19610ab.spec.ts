import { test, expect } from '@playwright/test';

test.describe('Report Page 19610ab Verification', () => {
  const demoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';

  test('Report page matches 19610ab commit exactly', async ({ page }) => {
    // Navigate to demo page first
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Click on "Get Solar Quote" button to go to report page
    const getQuoteButton = page.locator('button:has-text("Get Solar Quote")').first();
    await getQuoteButton.click();
    await page.waitForLoadState('networkidle');
    
    // Wait for the report to load
    await page.waitForSelector('[data-testid="solar-estimate"]', { timeout: 10000 });
    
    // Check that the report page has the correct structure from 19610ab
    // The 19610ab commit should have specific elements and layout
    
    // Check for the main report container
    const reportContainer = page.locator('[data-testid="solar-estimate"]');
    await expect(reportContainer).toBeVisible();
    
    // Check for demo mode indicators
    const demoMode = page.locator('text=Demo for Apple');
    await expect(demoMode).toBeVisible();
    
    // Check for the unlock buttons (demo mode should have these)
    const unlockButtons = page.locator('text=Unlock Full Report');
    await expect(unlockButtons).toHaveCount(3); // Should have 3 unlock buttons
    
    // Check for the blur overlay (demo mode should have this)
    const blurLayers = page.locator('.blur-layer');
    await expect(blurLayers).toHaveCount(3); // Should have 3 blur layers
    
    // Check for the legal footer
    const legalFooter = page.locator('footer');
    await expect(legalFooter).toBeVisible();
    
    // Check that the footer shows "Demo for Apple — Powered by Sunspire"
    const footerText = page.locator('text=Demo for Apple — Powered by Sunspire');
    await expect(footerText).toBeVisible();
    
    // Check for the results attribution
    const resultsAttribution = page.locator('text=Estimates generated using NREL PVWatts® v8');
    await expect(resultsAttribution).toBeVisible();
    
    // Check for the Google disclaimer
    const googleDisclaimer = page.locator('text=Mapping & location data © Google');
    await expect(googleDisclaimer).toBeVisible();
    
    // Check that there's no PaidFooter or DisclaimerBar (these were added later)
    const paidFooter = page.locator('[data-testid="paid-footer"]');
    await expect(paidFooter).not.toBeVisible();
    
    const disclaimerBar = page.locator('[data-testid="disclaimer-bar"]');
    await expect(disclaimerBar).not.toBeVisible();
    
    // Check that there's no StickyBar (this was added later)
    const stickyBar = page.locator('[data-testid="sticky-bar"]');
    await expect(stickyBar).not.toBeVisible();
  });

  test('Report page demo mode functionality works correctly', async ({ page }) => {
    // Navigate to demo page first
    await page.goto(demoUrl);
    await page.waitForLoadState('networkidle');
    
    // Click on "Get Solar Quote" button to go to report page
    const getQuoteButton = page.locator('button:has-text("Get Solar Quote")').first();
    await getQuoteButton.click();
    await page.waitForLoadState('networkidle');
    
    // Wait for the report to load
    await page.waitForSelector('[data-testid="solar-estimate"]', { timeout: 10000 });
    
    // Check that demo quota is displayed correctly
    const quotaText = page.locator('text=Runs left: 2');
    await expect(quotaText).toBeVisible();
    
    // Check that the countdown is displayed
    const countdownText = page.locator('text=Expires in');
    await expect(countdownText).toBeVisible();
    
    // Check that the unlock buttons are clickable
    const firstUnlockButton = page.locator('text=Unlock Full Report').first();
    await expect(firstUnlockButton).toBeVisible();
    await expect(firstUnlockButton).toBeEnabled();
  });
});
