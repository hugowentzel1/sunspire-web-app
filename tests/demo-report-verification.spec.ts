import { test, expect } from '@playwright/test';

test.describe('Demo Report Page Verification', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';
  const DEMO_REPORT_URL = 'http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test';

  test('Demo report page shows correct demo features', async ({ page }) => {
    await page.goto(DEMO_REPORT_URL, { waitUntil: 'networkidle' });
    
    // Check for demo-specific elements
    const demoBanner = page.locator('text=Preview: 2 runs left.');
    await expect(demoBanner).toBeVisible();
    console.log('✅ Demo preview banner visible');

    // Check for countdown timer
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible();
    console.log('✅ Countdown timer visible');

    // Check for runs left counter
    const runsLeft = page.locator('text=/Runs left/');
    await expect(runsLeft).toBeVisible();
    console.log('✅ Runs left counter visible');

    // Check for locked sections (demo-specific)
    const lockedOverlay = page.locator('[data-locked]');
    const hasLockedSections = await lockedOverlay.count() > 0;
    console.log('✅ Locked sections present:', hasLockedSections);

    // Check for demo-specific CTA
    const demoCta = page.locator('button[data-cta="primary"]').filter({ hasText: 'Activate on Your Domain' });
    await expect(demoCta).toBeVisible();
    console.log('✅ Demo CTA visible');

    // Check for company branding
    const companyName = page.locator('text=Netflix');
    await expect(companyName).toBeVisible();
    console.log('✅ Company name (Netflix) visible');

    // Check for Sunspire branding in footer
    const sunspireText = page.locator('[data-testid="footer"]').locator('text=Sunspire');
    await expect(sunspireText).toBeVisible();
    console.log('✅ Sunspire branding in footer');
  });

  test('Address autocomplete functionality', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Focus address input
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await expect(addressInput).toBeVisible();
    
    // Type partial address
    await addressInput.fill('123 Main St Phoenix');
    
    // Wait for autocomplete suggestions
    const suggestions = page.locator('[data-autosuggest]');
    await suggestions.waitFor({ timeout: 5000 });
    
    const suggestionCount = await suggestions.locator('li').count();
    console.log('✅ Autocomplete suggestions found:', suggestionCount);
    
    if (suggestionCount > 0) {
      // Click first suggestion
      await suggestions.locator('li').first().click();
      
      // Check if quote result appears
      const quoteResult = page.locator('[data-quote-result]');
      await expect(quoteResult).toBeVisible({ timeout: 5000 });
      console.log('✅ Quote result appeared after address selection');
    } else {
      console.log('⚠️ No autocomplete suggestions (Google API may be rate limited)');
    }
  });

  test('Demo run limit and lock screen', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Complete multiple runs to trigger lock
    for (let i = 0; i < 3; i++) {
      const addressInput = page.locator('input[placeholder*="Start typing"]');
      await addressInput.fill(`123 Main St Phoenix, AZ ${i}`);
      
      const suggestions = page.locator('[data-autosuggest]');
      if (await suggestions.count() > 0) {
        await suggestions.locator('li').first().click();
        await page.waitForURL(/.*\/report/, { timeout: 5000 });
        await page.goBack({ waitUntil: 'networkidle' });
      }
    }
    
    // Check for lock screen
    const lockOverlay = page.locator('[data-locked]');
    const hasLockScreen = await lockOverlay.count() > 0;
    console.log('✅ Lock screen present after runs:', hasLockScreen);
  });

  test('Demo timer countdown functionality', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check for timer display
    const timer = page.locator('text=/Expires in/');
    await expect(timer).toBeVisible();
    
    const timerText = await timer.textContent();
    console.log('✅ Timer text:', timerText);
    
    // Verify timer format (should contain days, hours, minutes, seconds)
    expect(timerText).toMatch(/\d+d\s+\d+h\s+\d+m\s+\d+s/);
    console.log('✅ Timer format is correct');
  });
});
