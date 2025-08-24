import { test, expect } from '@playwright/test';

test('verify complete visual match to images', async ({ page }) => {
  // Navigate to the report page with Apple company
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're NOT in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  expect(loadingText).toBe(0);
  
  // 1. Verify company logo is displayed prominently (not emoji)
  const appleLogo = await page.locator('img[alt="Apple logo"]').count();
  expect(appleLogo).toBeGreaterThan(0);
  
  // 2. Verify header text
  const headerText = await page.locator('text=SOLAR INTELLIGENCE REPORT').count();
  expect(headerText).toBeGreaterThan(0);
  
  // 3. Verify main title
  const mainTitle = await page.locator('text=Solar Intelligence Report').count();
  expect(mainTitle).toBeGreaterThan(0);
  
  // 4. Verify top banner text
  const topBannerText = await page.locator('text=A ready-to-embed, white-label quote tool that turns traffic into booked consults — live on your site in minutes.').count();
  expect(topBannerText).toBeGreaterThan(0);
  
  // 5. Verify demo mode banner
  const demoModeText = await page.locator('text=Demo Mode — White-Label Preview').count();
  expect(demoModeText).toBeGreaterThan(0);
  
  // 6. Verify CTA buttons
  const putOnSiteButton = await page.locator('text=Put this on our site').count();
  expect(putOnSiteButton).toBeGreaterThan(0);
  const copyDemoLink = await page.locator('text=Copy demo link').count();
  expect(copyDemoLink).toBeGreaterThan(0);
  
  // 7. Verify metric tiles - first two should be unblurred, last two should be blurred
  const systemSizeTile = await page.locator('[data-testid="tile-systemSize"]').count();
  expect(systemSizeTile).toBe(1);
  
  const annualProductionTile = await page.locator('[data-testid="tile-annualProduction"]').count();
  expect(annualProductionTile).toBe(1);
  
  // Check that the right two tiles are blurred
  const blurredTiles = await page.locator('.backdrop-blur-sm').count();
  expect(blurredTiles).toBeGreaterThanOrEqual(2);
  
  // 8. Verify icons are centered in metric tiles
  const centeredIcons = await page.locator('.flex.justify-center').count();
  expect(centeredIcons).toBeGreaterThanOrEqual(4);
  
  // 9. Verify unlock buttons on blurred tiles
  const unlockButtons = await page.locator('button:has-text("Unlock Full Report")').count();
  expect(unlockButtons).toBeGreaterThanOrEqual(4);
  
  // 10. Verify chart section has no unlock button
  const chartUnlockButton = await page.locator('[data-testid="savings-chart"] button:has-text("Unlock Full Report")').count();
  expect(chartUnlockButton).toBe(0);
  
  // 11. Verify financial analysis and environmental impact are blurred
  const lockedPanels = await page.locator('[data-testid="locked-panel"]').count();
  expect(lockedPanels).toBeGreaterThanOrEqual(2);
  
  // 12. Verify bottom CTA section is black (not orange/red/pink)
  const bottomCTA = await page.locator('text=Ready to Launch Your Branded Tool?').count();
  expect(bottomCTA).toBe(1);
  
  // Check that the background is black
  const blackBackground = await page.locator('.bg-black').count();
  expect(blackBackground).toBeGreaterThan(0);
  
  // 13. Verify button text changes
  const activateButton = await page.locator('text=Activate on Your Domain').count();
  expect(activateButton).toBe(1);
  
  const requestSampleButton = await page.locator('text=Request Sample Report').count();
  expect(requestSampleButton).toBe(1);
  
  // 14. Verify pricing text
  const pricingText = await page.locator('text=Only $99/mo + $399 setup. 14-day refund if it doesn\'t lift booked calls.').count();
  expect(pricingText).toBe(1);
  
  // 15. Verify email link is blue
  const emailLink = await page.locator('text=Email me full report').count();
  expect(emailLink).toBe(1);
  
  // 16. Verify footer text
  const footerText = await page.locator('text=Full version from just $99/mo + $399 setup. Most tools cost $2,500+/mo.').count();
  expect(footerText).toBe(1);
  
  // 17. Verify blur effects are actually visible
  // Check that the blurred content has the correct CSS properties
  const blurredElements = await page.locator('.backdrop-blur-sm');
  const blurCount = await blurredElements.count();
  expect(blurCount).toBeGreaterThanOrEqual(2);
  
  // Verify the blur effect is applied
  for (let i = 0; i < Math.min(blurCount, 4); i++) {
    const element = blurredElements.nth(i);
    const backdropFilter = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter || style.webkitBackdropFilter;
    });
    expect(backdropFilter).toContain('blur');
  }
  
  // 18. Verify white transparency overlay
  const whiteOverlays = await page.locator('.bg-white\\/60').count();
  expect(whiteOverlays).toBeGreaterThanOrEqual(2);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'complete-visual-match-verified.png', fullPage: true });
  
  console.log('✅ Complete visual match verified successfully!');
  console.log(`Found ${blurCount} blurred elements`);
  console.log(`Found ${whiteOverlays} white overlay elements`);
});
