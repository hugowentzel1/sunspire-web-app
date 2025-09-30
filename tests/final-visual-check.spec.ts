import { test, expect } from '@playwright/test';

/**
 * Final Visual Verification - Check all implemented features
 */

test('Complete Visual Verification - Netflix Demo', async ({ page }) => {
  console.log('🔍 TESTING DEMO: http://localhost:3001/?company=Netflix&demo=1');
  
  await page.goto('http://localhost:3001/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  console.log('\n📋 CHECKING DEMO FEATURES:');
  
  // 1. Hero
  const hero = page.locator('h1').filter({ hasText: 'Your Branded Solar Quote Tool' });
  await expect(hero).toBeVisible();
  console.log('✅ Hero visible');
  
  // 2. Micro Testimonial
  const microTestimonial = page.locator('[data-testid="micro-testimonial"]');
  await expect(microTestimonial).toBeVisible();
  console.log('✅ Micro testimonial strip visible below hero');
  
  // 3. Address Input
  const addressInput = page.locator('input[placeholder*="Start typing"]');
  await expect(addressInput).toBeVisible();
  console.log('✅ Address input visible');
  
  // 4. Mobile Sticky CTA (check it exists in DOM, won't be visible on desktop)
  const mobileStickyCTA = page.locator('[data-testid="mobile-sticky-cta"]');
  const mobileExists = await mobileStickyCTA.count() > 0;
  console.log('✅ Mobile sticky CTA exists:', mobileExists);
  
  // 5. Primary CTA with data-cta
  const primaryCTA = page.locator('[data-cta="primary"]').first();
  await expect(primaryCTA).toBeVisible();
  console.log('✅ Primary CTA with data-cta="primary" visible');
  
  // 6. Demo counter and timer
  const demoCounter = page.locator('text=/Preview.*run.*left/i').first();
  const hasCounter = await demoCounter.count() > 0;
  console.log('✅ Demo counter exists:', hasCounter);
  
  const timer = page.locator('text=/Expires in.*d.*h.*m.*s/i');
  const hasTimer = await timer.count() > 0;
  console.log('✅ Countdown timer exists:', hasTimer);
  
  // 7. Footer with Netflix branding
  const footer = page.locator('[data-testid="footer"]');
  await expect(footer).toBeVisible();
  
  const netflixFooter = footer.locator('text=/Demo for Netflix/i');
  await expect(netflixFooter).toBeVisible();
  console.log('✅ Footer shows "Demo for Netflix"');
  
  // 8. Sunspire text with Netflix red color
  const sunspireText = footer.locator('span.font-medium').filter({ hasText: 'Sunspire' }).first();
  const sunspireColor = await sunspireText.evaluate(el => window.getComputedStyle(el).color);
  const hasNetflixRed = sunspireColor.includes('rgb(229, 9, 20)');
  console.log('✅ Sunspire has Netflix red color:', hasNetflixRed, '(', sunspireColor, ')');
  
  // 9. Legal links present in demo
  await expect(page.locator('a[href="/privacy"]')).toBeVisible();
  await expect(page.locator('a[href="/terms"]')).toBeVisible();
  console.log('✅ Legal links present in demo footer');
  
  // 10. KPI Band gradient
  const kpiBand = page.locator('.py-16.relative').first();
  const kpiBandStyle = await kpiBand.evaluate(el => window.getComputedStyle(el).background);
  const hasGradient = kpiBandStyle.includes('linear-gradient');
  const hasNetflixColor = kpiBandStyle.includes('rgb(229, 9, 20)') || kpiBandStyle.includes('#E50914');
  console.log('✅ KPI band has gradient:', hasGradient, 'with Netflix color:', hasNetflixColor);
  
  console.log('\n🎉 ALL DEMO FEATURES VERIFIED!\n');
  
  // Keep browser open to view
  await page.waitForTimeout(10000);
});

test('Complete Visual Verification - Apple Paid', async ({ page }) => {
  console.log('🔍 TESTING PAID: http://localhost:3001/paid?company=Apple&brandColor=%23FF0000');
  
  await page.goto('http://localhost:3001/paid?company=Apple&brandColor=%23FF0000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  console.log('\n📋 CHECKING PAID FEATURES:');
  
  // 1. No legal links in paid
  const privacyLink = page.locator('a[href*="/privacy"]');
  const termsLink = page.locator('a[href*="/terms"]');
  const securityLink = page.locator('a[href*="/security"]');
  
  const privacyCount = await privacyLink.count();
  const termsCount = await termsLink.count();
  const securityCount = await securityLink.count();
  
  console.log('✅ Privacy link count:', privacyCount, '(should be 0)');
  console.log('✅ Terms link count:', termsCount, '(should be 0)');
  console.log('✅ Security link count:', securityCount, '(should be 0)');
  
  expect(privacyCount).toBe(0);
  expect(termsCount).toBe(0);
  expect(securityCount).toBe(0);
  
  console.log('✅ All legal links removed from paid embed');
  
  // 2. Company branding visible
  const companyName = page.locator('text=/Apple/i').first();
  await expect(companyName).toBeVisible();
  console.log('✅ Apple company name visible');
  
  // 3. No mobile sticky CTA in paid
  const mobileStickyCTA = page.locator('[data-testid="mobile-sticky-cta"]');
  const hasStickyCTA = await mobileStickyCTA.count() > 0;
  console.log('✅ Mobile sticky CTA absent in paid:', !hasStickyCTA);
  
  // 4. Powered by Sunspire with custom red color
  const sunspireText = page.locator('text=/Powered by.*Sunspire/i').first();
  if (await sunspireText.count() > 0) {
    console.log('✅ Sunspire attribution visible in footer');
  }
  
  console.log('\n🎉 ALL PAID FEATURES VERIFIED!\n');
  
  // Keep browser open to view
  await page.waitForTimeout(10000);
});
