import { test, expect } from '@playwright/test';

const PAID_REPORT = 'http://localhost:3001/report?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194';

test.describe('Paid Report CTA consolidation', () => {
  test('no mid-page CTA rows', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForSelector('text=Calculation Details & Data Sources', { timeout: 15000 });

    // Check that there are no CTAs before the Calculation Details section
    const calculationDetails = await page.locator('text=Calculation Details & Data Sources').first();
    const calculationBox = await calculationDetails.boundingBox();
    
    if (calculationBox) {
      const readyToGoSolar = await page.locator('text=Ready to Go Solar\\?').all();
      let midPageCTAs = 0;
      for (const cta of readyToGoSolar) {
        const box = await cta.boundingBox();
        if (box && box.y < calculationBox.y) {
          midPageCTAs++;
        }
      }
      expect(midPageCTAs).toBe(0);
    }
  });

  test('single consolidated CTA appears after report content', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForSelector('text=Calculation Details & Data Sources', { timeout: 15000 });
    
    // Wait for the CTA block to be visible
    await page.waitForSelector('[data-testid="report-cta"]', { timeout: 10000 });
    
    await page.keyboard.press('End');

    await expect(page.locator('text=Ready to Start Your Solar Journey')).toBeVisible();
    await expect(page.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Talk to a Specialist/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF Report|Download PDF/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Share Link/i })).toBeVisible();

    await expect(page.locator('text=Data sources:')).toBeVisible();
  });

  test('only one data-sources footnote and one footer', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForSelector('text=Data sources:');
    const footnotes = await page.locator('text=Data sources:').count();
    expect(footnotes).toBe(1);

    const footersPrivacyLinks = await page.getByRole('link', { name: /Privacy Policy/i }).count();
    expect(footersPrivacyLinks).toBeLessThanOrEqual(1);
  });

  test('mobile sticky CTA shows on small viewport and hides on desktop', async ({ browser }) => {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mp = await mobile.newPage();
    await mp.goto(PAID_REPORT);
    await mp.waitForSelector('text=Calculation Details & Data Sources');
    await expect(mp.locator('[data-testid="mobile-sticky-cta"]')).toBeVisible();
    await mobile.close();

    const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const dp = await desktop.newPage();
    await dp.goto(PAID_REPORT);
    await dp.waitForSelector('text=Calculation Details & Data Sources');
    // Check if the sticky CTA is hidden on desktop (it might be present but not visible)
    const stickyCTA = dp.locator('[data-testid="mobile-sticky-cta"]');
    const isVisible = await stickyCTA.isVisible();
    expect(isVisible).toBe(false);
    await desktop.close();
  });
});
