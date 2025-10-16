import { test, expect } from '@playwright/test';

test('Visual check - Report page spacing and layout', async ({ page }) => {
  // Navigate to demo report page
  await page.goto('/report?company=google&demo=1&address=123+Main+St,+Los+Angeles,+CA');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'screenshots/report-page-full.png', 
    fullPage: true 
  });
  
  // Take screenshot of header area (address + meta info)
  const header = page.locator('text=Comprehensive analysis').first();
  if (await header.isVisible()) {
    await header.screenshot({ 
      path: 'screenshots/header-section.png' 
    });
    console.log('✅ Header section captured');
  }
  
  // Check address width (should be max-w-[62ch])
  const addressElement = await page.locator('p.max-w-\\[62ch\\]').first();
  if (await addressElement.isVisible()) {
    console.log('✅ Address has max-w-[62ch]');
  }
  
  // Check meta info spacing (should be space-y-4)
  const metaInfo = await page.locator('div.space-y-4').first();
  if (await metaInfo.isVisible()) {
    console.log('✅ Meta info has space-y-4 (16px between rows)');
  }
  
  // Keep browser open for visual inspection
  console.log('\n📸 Screenshots saved to screenshots/ directory');
  await page.waitForTimeout(5000);
});

test('Visual check - Lock overlay', async ({ page }) => {
  // For lock overlay, we need to trigger it by exhausting quota
  // For now, let's just navigate and see if we can force it
  await page.goto('/?company=apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Try to navigate to report multiple times to exhaust quota
  for (let i = 0; i < 5; i++) {
    await page.goto(`/report?company=apple&demo=1&address=123+Test+St,+City,+CA&run=${i}`);
    await page.waitForTimeout(1000);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('[data-testid="primary-cta-lock"]');
  if (await lockOverlay.isVisible()) {
    console.log('✅ Lock overlay is visible!');
    await page.screenshot({ 
      path: 'screenshots/lock-overlay.png',
      fullPage: false
    });
  } else {
    console.log('⚠️ Lock overlay not triggered yet');
  }
  
  await page.waitForTimeout(5000);
});
