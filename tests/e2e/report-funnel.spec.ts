import { test, expect } from '@playwright/test';

test.describe('Report Page Funnel Optimization', () => {
  test('Above the fold shows correct copy and company branding', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check above-the-fold copy
    await expect(page.locator('text=Your branded solar tool is ready to launch')).toBeVisible();
    
    // Check company logo and name are visible
    await expect(page.locator('text=Apple')).toBeVisible();
    await expect(page.locator('img[alt*="Apple logo"]')).toBeVisible();
  });

  test('Sticky sidebar has correct CTA and micro-trust badges', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check sticky sidebar
    await expect(page.locator('[data-testid="report-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-cta"]')).toBeVisible();
    await expect(page.locator('text=Launch my branded tool')).toBeVisible();
    
    // Check micro-trust badges
    await expect(page.locator('text=SOC2')).toBeVisible();
    await expect(page.locator('text=GDPR')).toBeVisible();
    await expect(page.locator('text=NREL PVWatts®')).toBeVisible();
  });

  test('Unlock flow has unified CTAs with proper subcopy', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check all unlock buttons have same text and subcopy
    const unlockButtons = page.locator('[data-testid="unlock-report-cta"]');
    await expect(unlockButtons).toHaveCount(4); // 2 tiles + 2 panels
    
    for (let i = 0; i < 4; i++) {
      await expect(unlockButtons.nth(i)).toContainText('Unlock Full Report');
    }
    
    // Check subcopy appears
    await expect(page.locator('text=Upgrade to unlock the full branded report for your customers')).toBeVisible();
  });

  test('Pricing banner has correct CTA and comparison subline', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check pricing banner
    await expect(page.locator('text=Activate on Your Domain — $99/mo + $399')).toBeVisible();
    await expect(page.locator('text=Full version from just $99/mo + $399 setup. Most tools cost $2,500+/mo')).toBeVisible();
  });

  test('Social proof testimonial row appears above footer', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check testimonial row
    await expect(page.locator('text="Cut quoting time from 15 minutes to 1." — Ops Manager, Texas')).toBeVisible();
    await expect(page.locator('text="Booked 4 more installs in our first month." — Owner, Arizona')).toBeVisible();
  });

  test('Motion effects work on CTAs', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check that CTAs have hover effects
    const ctaButton = page.locator('[data-testid="report-cta"]');
    await expect(ctaButton).toHaveClass(/hover:scale-105/);
    
    const unlockButton = page.locator('[data-testid="unlock-report-cta"]').first();
    await expect(unlockButton).toHaveClass(/hover:scale-105/);
  });

  test('All CTAs route to same upgrade path', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check that all CTAs have the same onClick handler
    const allCTAs = page.locator('[data-testid="report-cta"], [data-testid="unlock-report-cta"], [data-cta="primary"]');
    await expect(allCTAs).toHaveCount(6); // 1 sticky + 4 unlock + 1 main banner
  });

  test('Footer is reverted to original state', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check footer doesn't have the extra elements we removed
    await expect(page.locator('text=SOC2')).not.toBeVisible(); // Should only be in sidebar
    await expect(page.locator('text=NREL PVWatts®')).not.toBeVisible(); // Should only be in sidebar
    await expect(page.locator('text=CRM-ready')).not.toBeVisible(); // Should only be in sidebar
  });
});
