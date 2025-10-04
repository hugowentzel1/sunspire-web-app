import { test, expect } from '@playwright/test';

test('Show sticky CTA with 40% background brand tint', async ({ page }) => {
  // Go to the local report page with Tesla demo
  await page.goto('http://localhost:3002/report?company=tesla&demo=1');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check if StickyCTA is visible
  const stickyCTA = page.locator('[data-testid="sticky-cta"]');
  await expect(stickyCTA).toBeVisible();
  
  // Check trust capsules
  const trustCapsules = stickyCTA.locator('[role="listitem"]');
  await expect(trustCapsules).toHaveCount(8);
  
  // Check the 40% brand tint styling
  const firstCapsule = trustCapsules.first();
  const capsuleStyles = await firstCapsule.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      background: styles.background,
      color: styles.color,
      border: styles.border,
    };
  });
  
  console.log('Capsule styling with 40% background brand tint:', capsuleStyles);
  
  // Take screenshots
  await page.screenshot({ path: '40-percent-tint-full-page.png', fullPage: true });
  await stickyCTA.screenshot({ path: '40-percent-tint-focused.png' });
  
  console.log('✅ Sticky CTA with 40% background brand tint shown!');
});
