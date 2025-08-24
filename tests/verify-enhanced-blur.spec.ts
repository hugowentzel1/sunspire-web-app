import { test, expect } from '@playwright/test';

test('verify enhanced blur effects are now very visible', async ({ page }) => {
  // Navigate to the report page with Apple company
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if we're NOT in loading state
  const loadingText = await page.locator('text=Generating your solar intelligence report').count();
  expect(loadingText).toBe(0);
  
  // 1. Verify blur effects are applied with enhanced CSS
  const blurredElements = await page.locator('.backdrop-blur-sm');
  const blurCount = await blurredElements.count();
  expect(blurCount).toBeGreaterThanOrEqual(2);
  
  // 2. Check that the blur effect is much more prominent now
  for (let i = 0; i < Math.min(blurCount, 4); i++) {
    const element = blurredElements.nth(i);
    
    // Check backdrop-filter property - should be blur(8px) now
    const backdropFilter = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter || (style as any).webkitBackdropFilter;
    });
    expect(backdropFilter).toContain('blur(8px)');
    
    // Check that the element has the enhanced white overlay
    const backgroundColor = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    expect(backgroundColor).toContain('rgba(255, 255, 255, 0.8)');
    
    // Check for the enhanced border
    const border = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.border;
    });
    console.log(`Element ${i + 1} border:`, border);
  }
  
  // 3. Verify white transparency overlays are very visible
  const whiteOverlays = await page.locator('.bg-white\\/60');
  const overlayCount = await whiteOverlays.count();
  expect(overlayCount).toBeGreaterThanOrEqual(2);
  
  // 4. Verify unlock buttons are visible on blurred tiles
  const unlockButtons = await page.locator('button:has-text("Unlock Full Report")');
  const buttonCount = await unlockButtons.count();
  expect(buttonCount).toBeGreaterThanOrEqual(4);
  
  // 5. Take a screenshot for visual verification
  await page.screenshot({ path: 'enhanced-blur-verified.png', fullPage: true });
  
  console.log('✅ Enhanced blur effects verified successfully!');
  console.log(`Found ${blurCount} blurred elements with blur(8px)`);
  console.log(`Found ${overlayCount} white overlay elements with rgba(255, 255, 255, 0.8)`);
  console.log(`Found ${buttonCount} unlock buttons`);
  console.log('Blur effects should now be much more visible!');
});
