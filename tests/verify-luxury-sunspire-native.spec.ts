import { test, expect } from '@playwright/test';

test('Verify luxury Sunspire-native sticky CTA styling', async ({ page }) => {
  // Go to the report page with Tesla demo
  await page.goto('http://localhost:3000/report?company=tesla&demo=1');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for any animations
  await page.waitForTimeout(2000);
  
  // Take a focused screenshot of the StickyCTA area
  await page.screenshot({ 
    path: 'luxury-sunspire-native.png',
    fullPage: false,
    clip: { x: 800, y: 400, width: 500, height: 400 }
  });
  
  // Check if StickyCTA exists and is visible
  const stickyCTA = page.locator('[data-testid="sticky-cta"]');
  await expect(stickyCTA).toBeVisible();
  
  // Check the main container has proper z-index and transitions
  const containerStyles = await stickyCTA.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      zIndex: computed.zIndex,
      transition: computed.transition,
      position: computed.position
    };
  });
  
  console.log('Container styles:', containerStyles);
  
  // Should have proper z-index and transitions
  expect(containerStyles.zIndex).toBe('50');
  expect(containerStyles.transition).toContain('0.2s');
  expect(containerStyles.position).toBe('fixed');
  
  // Check the card container has Sunspire-native styling
  const cardContainer = stickyCTA.locator('div.rounded-2xl').first();
  const cardStyles = await cardContainer.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      backgroundColor: computed.backgroundColor,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      backdropFilter: computed.backdropFilter,
      border: computed.border
    };
  });
  
  console.log('Card container styles:', cardStyles);
  
  // Should have Sunspire-native styling
  expect(cardStyles.backgroundColor).toContain('rgba(255, 255, 255, 0.92)'); // bg-white/92
  expect(cardStyles.borderRadius).toBe('16px'); // rounded-2xl
  expect(cardStyles.boxShadow).toContain('rgba(16, 24, 40, 0.08)'); // Sunspire shadow
  expect(cardStyles.backdropFilter).toContain('blur(6px)'); // backdrop-blur-[6px]
  
  // Check CTA button has luxury gradient styling
  const ctaButton = stickyCTA.locator('a').first();
  const buttonStyles = await ctaButton.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      background: computed.background,
      backgroundImage: computed.backgroundImage,
      borderRadius: computed.borderRadius,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      minHeight: computed.minHeight,
      boxShadow: computed.boxShadow
    };
  });
  
  console.log('CTA button styles:', buttonStyles);
  
  // Should have luxury gradient styling
  expect(buttonStyles.background).toContain('linear-gradient');
  expect(buttonStyles.borderRadius).toBe('9999px'); // rounded-full
  expect(buttonStyles.fontWeight).toBe('600'); // font-semibold
  expect(buttonStyles.minHeight).toBe('52px'); // min-h-[52px] mobile
  
  // Check trust badges have luxury styling
  const trustChips = stickyCTA.locator('span[role="listitem"]');
  const chipCount = await trustChips.count();
  console.log('Trust chips found:', chipCount);
  expect(chipCount).toBeGreaterThan(0);
  
  // Check first trust chip for luxury styling
  const firstChip = trustChips.first();
  const chipStyles = await firstChip.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      background: computed.background,
      backgroundImage: computed.backgroundImage,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      border: computed.border,
      fontSize: computed.fontSize,
      height: computed.height,
      width: computed.width
    };
  });
  
  console.log('First chip styles:', chipStyles);
  
  // Should have luxury styling
  expect(chipStyles.background).toContain('linear-gradient');
  expect(chipStyles.borderRadius).toBe('9999px'); // rounded-full
  expect(chipStyles.boxShadow).toContain('inset'); // inset shadow for depth
  expect(chipStyles.fontSize).toBe('14px'); // text-[14px]
  expect(chipStyles.height).toBe('40px'); // h-10 mobile
  
  // Check subcopy has proper neutral styling
  const subcopy = stickyCTA.locator('p, div').filter({ hasText: SUBCOPY }).first();
  const subcopyStyles = await subcopy.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      color: computed.color,
      textAlign: computed.textAlign
    };
  });
  
  console.log('Subcopy styles:', subcopyStyles);
  
  // Should have proper neutral styling
  expect(subcopyStyles.fontSize).toBe('14px'); // text-[14px]
  expect(subcopyStyles.color).toContain('rgba(30, 41, 59, 0.9)'); // text-slate-800/90
  expect(subcopyStyles.textAlign).toBe('center');
  
  console.log('✅ Luxury Sunspire-native sticky CTA styling is working!');
});
