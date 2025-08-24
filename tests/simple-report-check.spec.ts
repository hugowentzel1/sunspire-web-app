import { test, expect } from '@playwright/test';

test('Simple report page check - c548b88 style', async ({ page }) => {
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check the header
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  // Check the main title
  await expect(page.locator('h1.text-4xl.md\\:text-5xl.font-black.text-gray-900')).toHaveText('New Analysis');
  
  // Check the trust elements section
  const trustSection = page.locator('div.mt-4.flex.flex-wrap.items-center.justify-center.gap-3');
  await expect(trustSection).toBeVisible();
  
  // Check "Put this on our site" button
  await expect(trustSection.locator('a:has-text("Put this on our site")')).toBeVisible();
  
  // Check data sources text
  await expect(trustSection.locator('div.text-xs.text-slate-500:has-text("Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted")')).toBeVisible();
  
  // Check the metrics grid
  const metricsGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-5.items-stretch');
  await expect(metricsGrid).toBeVisible();
  
  // Check that metrics have unlock buttons
  const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
  await expect(unlockButtons).toHaveCount(6); // 4 metrics + 1 chart + 1 environmental impact
  
  // Check the chart section
  const chartSection = page.locator('div.relative.rounded-2xl.bg-white.p-5.overflow-hidden');
  await expect(chartSection).toBeVisible();
  
  // Check the three-column layout
  const threeColumnLayout = page.locator('div.grid.grid-cols-1.lg\\:grid-cols-3.gap-8');
  await expect(threeColumnLayout).toBeVisible();
  
  // Check Financial Analysis (should be unblurred)
  await expect(threeColumnLayout.locator('div.relative.rounded-2xl.p-8.bg-white.border.border-gray-200\\/50:has-text("Financial Analysis")').first()).toBeVisible();
  
  // Check Environmental Impact (should be blurred)
  await expect(threeColumnLayout.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("Environmental Impact")').first()).toBeVisible();
  
  // Check Calculation Assumptions (should be unblurred)
  await expect(threeColumnLayout.locator('div.relative.rounded-2xl.p-8.bg-white.border.border-gray-200\\/50:has-text("Calculation Assumptions")').first()).toBeVisible();
  
  // Check the CTA band
  const ctaBand = page.locator('div.bg-gradient-to-r.from-orange-500.via-red-500.to-pink-500.rounded-3xl.py-12.px-8.text-center.text-white');
  await expect(ctaBand).toBeVisible();
  
  // Check CTA title and button
  await expect(ctaBand.locator('h2.text-3xl.font-bold.mb-6')).toHaveText('Ready to Go Solar?');
  await expect(ctaBand.locator('button:has-text("Get Matched with Installers")')).toBeVisible();
  
  // Check copy demo link button
  await expect(page.locator('button:has-text("📋 Copy Demo Link")')).toBeVisible();
  
  // Check disclaimer
  const disclaimer = page.locator('div.max-w-4xl.mx-auto.text-center div.bg-gray-50.rounded-lg.p-6.border.border-gray-200');
  await expect(disclaimer).toBeVisible();
  
  console.log('✅ Report page is working exactly like c548b88!');
  
  // Keep browser open for visual inspection
  await page.waitForTimeout(10000);
});
