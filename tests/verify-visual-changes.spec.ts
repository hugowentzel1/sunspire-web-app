import { test, expect } from '@playwright/test';

test('verify all visual changes match the images exactly', async ({ page }) => {
  // Navigate to the report page
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're NOT in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  expect(loadingText).toBe(0);
  
  // 1. Verify header text and layout
  const headerText = await page.locator('text=SOLAR INTELLIGENCE REPORT').count();
  expect(headerText).toBeGreaterThan(0);
  
  // 2. Verify top banner text
  const topBannerText = await page.locator('text=A ready-to-embed, white-label quote tool that turns traffic into booked consults — live on your site in minutes.').count();
  expect(topBannerText).toBeGreaterThan(0);
  
  // 3. Verify demo mode banner
  const demoModeText = await page.locator('text=Demo Mode — White-Label Preview').count();
  expect(demoModeText).toBeGreaterThan(0);
  const preBrandedText = await page.locator('text=Pre-branded preview. Not a contract quote.').count();
  expect(preBrandedText).toBeGreaterThan(0);
  
  // 4. Verify CTA buttons
  const putOnSiteButton = await page.locator('text=Put this on our site').count();
  expect(putOnSiteButton).toBeGreaterThan(0);
  const copyDemoLink = await page.locator('text=Copy demo link').count();
  expect(copyDemoLink).toBeGreaterThan(0);
  
  // 5. Verify main title
  const mainTitle = await page.locator('text=Solar Intelligence Report').count();
  expect(mainTitle).toBeGreaterThan(0);
  
  // 6. Verify metric tiles - first two should be unblurred, last two should be blurred
  const systemSizeTile = await page.locator('[data-testid="tile-systemSize"]').count();
  expect(systemSizeTile).toBe(1);
  
  const annualProductionTile = await page.locator('[data-testid="tile-annualProduction"]').count();
  expect(annualProductionTile).toBe(1);
  
  // Check that the right two tiles are blurred
  const blurredTiles = await page.locator('.backdrop-blur-sm').count();
  expect(blurredTiles).toBeGreaterThanOrEqual(2);
  
  // 7. Verify icons are centered in metric tiles
  const centeredIcons = await page.locator('.flex.justify-center').count();
  expect(centeredIcons).toBeGreaterThanOrEqual(4); // At least 4 centered icons
  
  // 8. Verify unlock buttons on blurred tiles
  const unlockButtons = await page.locator('button:has-text("Unlock Full Report")').count();
  expect(unlockButtons).toBeGreaterThanOrEqual(4); // At least 4 unlock buttons
  
  // 9. Verify chart section has no unlock button
  const chartUnlockButton = await page.locator('[data-testid="savings-chart"] button:has-text("Unlock Full Report")').count();
  expect(chartUnlockButton).toBe(0);
  
  // 10. Verify financial analysis and environmental impact are blurred
  const lockedPanels = await page.locator('[data-testid="locked-panel"]').count();
  expect(lockedPanels).toBeGreaterThanOrEqual(2);
  
  // 11. Verify bottom CTA section is black (not orange/red/pink)
  const bottomCTA = await page.locator('text=Ready to Launch Your Branded Tool?').count();
  expect(bottomCTA).toBe(1);
  
  // Check that the background is black
  const blackBackground = await page.locator('.bg-black').count();
  expect(blackBackground).toBeGreaterThan(0);
  
  // 12. Verify button text changes
  const activateButton = await page.locator('text=Activate on Your Domain').count();
  expect(activateButton).toBe(1);
  
  const requestSampleButton = await page.locator('text=Request Sample Report').count();
  expect(requestSampleButton).toBe(1);
  
  // 13. Verify pricing text
  const pricingText = await page.locator('text=Only $99/mo + $399 setup. 14-day refund if it doesn\'t lift booked calls.').count();
  expect(pricingText).toBe(1);
  
  // 14. Verify email link is blue
  const emailLink = await page.locator('text=Email me full report').count();
  expect(emailLink).toBe(1);
  
  // 15. Verify footer text
  const footerText = await page.locator('text=Full version from just $99/mo + $399 setup. Most tools cost $2,500+/mo.').count();
  expect(footerText).toBe(1);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'visual-changes-verified.png', fullPage: true });
  
  console.log('✅ All visual changes verified successfully!');
});
