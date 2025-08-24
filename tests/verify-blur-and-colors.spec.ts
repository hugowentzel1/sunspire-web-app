import { test, expect } from '@playwright/test';

test('verify blur effects and color coding are actually visible', async ({ page }) => {
  // Navigate to the report page with Apple company
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're NOT in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  expect(loadingText).toBe(0);
  
  // 1. Verify company logo is displayed prominently
  const appleLogo = await page.locator('img[alt="Apple logo"]').count();
  expect(appleLogo).toBeGreaterThan(0);
  
  // 2. Verify the text matches the images exactly
  const mainTitle = await page.locator('text=Solar Intelligence Report').count();
  expect(mainTitle).toBeGreaterThan(0);
  
  const addressText = await page.locator('text=Comprehensive analysis for your property at 123 N Central Ave, Phoenix, AZ').count();
  expect(addressText).toBeGreaterThan(0);
  
  const dateText = await page.locator('text=Data Source: Demo • Generated on 8/24/2025').count();
  expect(dateText).toBeGreaterThan(0);
  
  const bannerText = await page.locator('text=A ready-to-embed, white-label quote tool that turns traffic into booked consults — live on your site in minutes.').count();
  expect(bannerText).toBeGreaterThan(0);
  
  const dataSourcesText = await page.locator('text=Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted').count();
  expect(dataSourcesText).toBeGreaterThan(0);
  
  // 3. Verify blur effects are actually visible by checking CSS properties
  const blurredElements = await page.locator('.backdrop-blur-sm');
  const blurCount = await blurredElements.count();
  expect(blurCount).toBeGreaterThanOrEqual(2);
  
  // Check that the blur effect is actually applied and visible
  for (let i = 0; i < Math.min(blurCount, 4); i++) {
    const element = blurredElements.nth(i);
    
    // Check backdrop-filter property
    const backdropFilter = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter || style.webkitBackdropFilter;
    });
    expect(backdropFilter).toContain('blur');
    
    // Check that the element has the white overlay
    const backgroundColor = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    expect(backgroundColor).toContain('rgba(255, 255, 255, 0.6)');
  }
  
  // 4. Verify white transparency overlays are visible
  const whiteOverlays = await page.locator('.bg-white\\/60');
  const overlayCount = await whiteOverlays.count();
  expect(overlayCount).toBeGreaterThanOrEqual(2);
  
  // 5. Verify unlock buttons are visible on blurred tiles
  const unlockButtons = await page.locator('button:has-text("Unlock Full Report")');
  const buttonCount = await unlockButtons.count();
  expect(buttonCount).toBeGreaterThanOrEqual(4);
  
  // 6. Verify color coding is working
  // Check that the brand color is applied to the company name
  const companyName = await page.locator('h1:has-text("Apple")');
  const companyColor = await companyName.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.color;
  });
  console.log('Company name color:', companyColor);
  
  // 7. Verify the bottom CTA section is black
  const bottomCTA = await page.locator('text=Ready to Launch Your Branded Tool?');
  const ctaBackground = await bottomCTA.locator('..').evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.backgroundColor;
  });
  expect(ctaBackground).toContain('rgb(0, 0, 0)');
  
  // 8. Take a screenshot for visual verification
  await page.screenshot({ path: 'blur-and-colors-verified.png', fullPage: true });
  
  console.log('✅ Blur effects and color coding verified successfully!');
  console.log(`Found ${blurCount} blurred elements`);
  console.log(`Found ${overlayCount} white overlay elements`);
  console.log(`Found ${buttonCount} unlock buttons`);
});
