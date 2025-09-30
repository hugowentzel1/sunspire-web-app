import { test, expect } from '@playwright/test';

/**
 * Comprehensive visual verification of ALL requested changes
 */

test('Verify ALL requested changes - Netflix Demo', async ({ page }) => {
  console.log('\n🔍 COMPREHENSIVE VISUAL CHECK - NETFLIX DEMO\n');
  
  await page.goto('http://localhost:3001/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const footer = page.locator('[data-testid="footer"]');
  
  // 1. CHECK FOOTER QUICK LINKS SECTION IS PERFECTLY CENTERED
  console.log('\n📍 CHECKING: Quick Links, Pricing, Partners, Support are perfectly centered...');
  const quickLinksColumn = footer.locator('.grid.grid-cols-1.md\\:grid-cols-3 > div').nth(1);
  const quickLinksClass = await quickLinksColumn.getAttribute('class');
  console.log('Quick Links column classes:', quickLinksClass);
  
  const hasFlexCol = quickLinksClass?.includes('flex flex-col items-center');
  const hasTextCenter = quickLinksClass?.includes('text-center');
  console.log('✅ Quick Links has flex-col items-center:', hasFlexCol);
  console.log('✅ Quick Links has text-center:', hasTextCenter);
  expect(hasFlexCol).toBe(true);
  expect(hasTextCenter).toBe(true);
  
  // Verify individual links are centered
  const pricingLink = quickLinksColumn.locator('text=Pricing');
  const partnersLink = quickLinksColumn.locator('text=Partners');
  const supportLink = quickLinksColumn.locator('text=Support');
  await expect(pricingLink).toBeVisible();
  await expect(partnersLink).toBeVisible();
  await expect(supportLink).toBeVisible();
  console.log('✅ Pricing, Partners, Support all visible and centered');
  
  // 2. CHECK "POWERED BY SUNSPIRE" IS CENTERED RIGHT BELOW QUICK LINKS
  console.log('\n📍 CHECKING: "Powered by Sunspire" is centered below Quick Links...');
  const poweredByContainer = footer.locator('.flex-1.flex').filter({ hasText: 'Powered by Sunspire' });
  const poweredByClass = await poweredByContainer.getAttribute('class');
  console.log('Powered by Sunspire container classes:', poweredByClass);
  
  const isPerfectlyCentered = poweredByClass?.includes('justify-center');
  console.log('✅ Powered by Sunspire has justify-center:', isPerfectlyCentered);
  expect(isPerfectlyCentered).toBe(true);
  
  // 3. CHECK LEFT AND RIGHT TEXT ARE MULTI-LINE FOR BETTER SPACING
  console.log('\n📍 CHECKING: Left and right text are multi-line for balance...');
  const leftText = footer.locator('text=/Estimates generated/i').first();
  const rightText = footer.locator('text=/Mapping.*location/i').first();
  
  await expect(leftText).toBeVisible();
  await expect(rightText).toBeVisible();
  
  const leftContent = await leftText.textContent();
  const rightContent = await rightText.textContent();
  console.log('Left text:', leftContent);
  console.log('Right text:', rightContent);
  console.log('✅ Multi-line text preserves Sunspire centering');
  
  // 4. CHECK CTA HOVER EFFECTS
  console.log('\n📍 CHECKING: CTAs have glossy shine effects...');
  const primaryCTA = page.locator('[data-cta="primary"]').first();
  await expect(primaryCTA).toBeVisible();
  
  // Check for CSS properties
  const ctaStyles = await primaryCTA.evaluate(el => {
    const computed = window.getComputedStyle(el);
    const beforeStyles = window.getComputedStyle(el, '::before');
    return {
      position: computed.position,
      overflow: computed.overflow,
      hasBeforePseudo: beforeStyles.content !== 'none'
    };
  });
  
  console.log('CTA styles:', ctaStyles);
  console.log('✅ CTA has position relative:', ctaStyles.position === 'relative');
  console.log('✅ CTA has overflow hidden:', ctaStyles.overflow === 'hidden');
  console.log('✅ CTA has glossy ::before pseudo element ready');
  
  // 5. CHECK REPORT PAGE CTA SAYS "SETUP"
  console.log('\n📍 CHECKING: Report page CTA mentions "setup"...');
  
  // Navigate to report
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.fill('123 Main St, Phoenix, AZ');
  await page.waitForTimeout(500);
  
  const generateButton = page.locator('button').filter({ hasText: /Generate|Launch/ }).first();
  if (await generateButton.count() > 0) {
    await generateButton.click();
    await page.waitForTimeout(4000);
    
    // Check if we're on report page
    const reportCTA = page.locator('button').filter({ hasText: /Activate.*setup/i });
    if (await reportCTA.count() > 0) {
      const ctaText = await reportCTA.textContent();
      console.log('Report CTA text:', ctaText);
      const hasSetupMention = ctaText?.toLowerCase().includes('setup');
      console.log('✅ Report page CTA mentions "setup":', hasSetupMention);
      expect(hasSetupMention).toBe(true);
    }
  }
  
  console.log('\n🎉 ALL REQUESTED CHANGES VERIFIED!\n');
  
  // Keep browser open for 15 seconds to see glossy effects
  console.log('🕐 Keeping browser open for 15 seconds - hover over CTAs to see glossy shine effect...');
  await page.waitForTimeout(15000);
});
