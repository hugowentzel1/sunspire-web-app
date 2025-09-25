import { test, expect } from '@playwright/test';

test('Sunspire Final Dream - Fast Check', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // 1. Only ONE KPI band present, showing: 28,417 / 31% / 113+
  const kpiBands = await page.locator('[data-testid="kpi-band"], .bg-gray-50').count();
  expect(kpiBands).toBe(1);
  
  // Check for correct KPI numbers
  await expect(page.locator('text=28,417')).toBeVisible();
  await expect(page.locator('text=31%')).toBeVisible();
  await expect(page.locator('text=113+')).toBeVisible();
  
  // 2. Only ONE testimonial block with exactly 4 unique quotes
  const testimonialCards = await page.locator('.bg-white.rounded-2xl').filter({ hasText: /".*"/ }).count();
  expect(testimonialCards).toBe(4);
  
  // 3. Only ONE features row (3 cards) - check for NREL, CRM, Encryption
  await expect(page.locator('text=NREL PVWatts® v8')).toBeVisible();
  await expect(page.locator('text=CRM Integration')).toBeVisible();
  await expect(page.locator('text=End-to-End Encryption')).toBeVisible();
  
  // 4. Only ONE final CTA section near the bottom
  const finalCtaSections = await page.locator('text=Activate on Your Domain — 24 Hours').count();
  expect(finalCtaSections).toBe(2); // One in hero, one in final section
  
  // 5. "Powered by Google" NOT under the address input
  const addressModule = page.locator('text=Enter Your Property Address').locator('..');
  await expect(addressModule.locator('text=Powered by Google')).not.toBeVisible();
  
  // 6. Footer matches specification - three columns + bottom attributions
  await expect(page.locator('text=Sunspire Solar Intelligence')).toBeVisible();
  await expect(page.locator('text=Quick Links')).toBeVisible();
  await expect(page.locator('text=Legal & Support')).toBeVisible();
  await expect(page.locator('text=Estimates generated using NREL PVWatts® v8')).toBeVisible();
  await expect(page.locator('text=Mapping & location data © Google')).toBeVisible();
  await expect(page.locator('text=Powered by Sunspire')).toBeVisible();
  
  // 7. No GDPR/CCPA/SOC2 pills in footer
  await expect(page.locator('text=GDPR')).not.toBeVisible();
  await expect(page.locator('text=CCPA')).not.toBeVisible();
  await expect(page.locator('text=SOC 2')).not.toBeVisible();
  
  // 8. No "As seen in" bar
  await expect(page.locator('text=As seen in')).not.toBeVisible();
  
  // 9. No duplicate compliance mentions
  await expect(page.locator('text=SOC2 · NREL PVWatts® · CRM-ready · GDPR/CCPA compliant')).not.toBeVisible();
  
  // 10. Check for proper spacing and typography
  const heroH1 = page.locator('h1').first();
  await expect(heroH1).toHaveClass(/text-5xl/);
  await expect(heroH1).toHaveClass(/font-extrabold/);
  
  console.log('✅ Sunspire Final Dream - All checks passed!');
});
