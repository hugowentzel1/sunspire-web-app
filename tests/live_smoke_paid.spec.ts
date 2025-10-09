import { test, expect } from '@playwright/test';

const LIVE_PAID = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0';

test('live paid smoke: footer links & attribution present; vendor links absent', async ({ page }) => {
  await page.goto(LIVE_PAID, { waitUntil: 'networkidle' });
  
  const footerSection = page.locator('footer');
  
  // Check for required paid links  
  for (const label of ['Privacy Policy','Terms of Service','Cookie Preferences']) {
    const link = footerSection.locator('a, button').filter({ hasText: new RegExp(label, 'i') });
    const count = await link.count();
    console.log(`${label}: ${count}`);
    expect(count).toBeGreaterThan(0);
  }
  
  // Check for Google attribution
  await expect(page.locator('text=/Mapping.*Google|© Google/i')).toBeVisible();
  console.log('✅ Google attribution found');
  
  // Check that vendor/B2B links are NOT in footer
  await expect(footerSection.getByRole('link', { name: /Pricing/i })).toHaveCount(0);
  await expect(footerSection.getByRole('link', { name: /Partner/i })).toHaveCount(0);
  await expect(footerSection.getByRole('link', { name: /Support/i })).toHaveCount(0);
  console.log('✅ Vendor links absent from paid footer');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/live-paid-smoke.png', fullPage: true });
  console.log('✅ Live paid smoke test passed!');
});
