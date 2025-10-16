import { test, expect } from '@playwright/test';

test('Visual test - Lock overlay with brand colors', async ({ page }) => {
  // Go to demo page with company branding
  await page.goto('/?company=google&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of demo page
  await page.screenshot({ path: 'screenshots/01-demo-page.png', fullPage: true });
  
  // Navigate to report page to potentially trigger lock overlay
  // You may need to adjust this based on how the lock overlay is triggered
  await page.goto('/report?company=google&demo=1');
  
  // Wait for report to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'screenshots/02-report-or-lock.png', fullPage: true });
  
  // If lock overlay appears, it should be visible
  const lockOverlay = page.locator('[data-testid="primary-cta-lock"]');
  if (await lockOverlay.isVisible()) {
    console.log('✅ Lock overlay is visible!');
    await page.screenshot({ path: 'screenshots/03-lock-overlay-closeup.png' });
  } else {
    console.log('⚠️ Lock overlay not visible, might need more runs to trigger it');
  }
  
  // Keep page open for visual inspection
  await page.waitForTimeout(30000);
});

