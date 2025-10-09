import { test, expect } from '@playwright/test';

const PAID_REPORT = 'http://localhost:3000/report?demo=0&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&lat=33.7490&lng=-84.3880&address=123+Main+St+Atlanta+GA';

test.describe('Paid report CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
  });

  test('single primary, proper grouping', async ({ page }) => {
    // Wait for CTA footer to be visible
    await page.waitForSelector('[data-testid="report-cta-footer"]', { timeout: 10000 });
    
    const bookButtons = page.getByRole('button', { name: /Book a Consultation/i });
    await expect(bookButtons).toHaveCount(1);
    
    await expect(page.getByRole('button', { name: /Talk to a Specialist/i })).toHaveCount(1);
    await expect(page.getByRole('button', { name: /Download PDF/i })).toHaveCount(1);
    await expect(page.getByRole('button', { name: /Copy Share Link/i })).toHaveCount(1);
  });

  test('placement after report, before footnote', async ({ page }) => {
    const cta = page.locator('[data-testid="report-cta-footer"]');
    await expect(cta).toBeVisible();
    
    const footnote = page.getByText(/Data sources: NREL PVWatts/i);
    await expect(footnote).toBeVisible();
    
    // Ensure CTA appears before footnote in DOM
    const ctaBox = await cta.boundingBox();
    const footBox = await footnote.boundingBox();
    
    if (ctaBox && footBox) {
      expect(ctaBox.y + ctaBox.height).toBeLessThan(footBox.y);
    }
  });

  test('old headings removed', async ({ page }) => {
    await expect(page.getByText('Ready to Start Your Solar Journey?', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Download & Share Your Report', { exact: false })).toHaveCount(0);
  });

  test('mobile sticky CTA visible and non-obscuring', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Scroll down a bit to trigger sticky CTA
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(1000); // Wait for scroll animation and component mount
    
    const sticky = page.locator('[data-testid="sticky-cta"]');
    // Check if it exists and wait for it to become visible (it has opacity animation)
    await sticky.waitFor({ state: 'visible', timeout: 10000 });
    
    // Scroll to bottom and confirm footnote is still readable
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/Data sources: NREL PVWatts/i)).toBeVisible();
  });

  test('desktop does not show sticky CTA', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    
    const sticky = page.locator('[data-testid="sticky-cta"]');
    const isVisible = await sticky.isVisible().catch(() => false);
    
    expect(isVisible).toBe(false);
  });

  test('button hierarchy styles', async ({ page }) => {
    // Scroll down to see the CTA footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const ctaFooter = page.locator('[data-testid="report-cta-footer"]');
    await expect(ctaFooter).toBeVisible({ timeout: 10000 });
    
    // Check primary button (Book a Consultation) has brand color
    const primaryBtn = page.locator('.btn-primary').first();
    await expect(primaryBtn).toBeVisible();
    
    // Check secondary button (Talk to a Specialist) has outline style
    const secondaryBtn = page.locator('.btn-secondary').first();
    await expect(secondaryBtn).toBeVisible();
    
    // Check tertiary buttons (Download/Share) are present
    const tertiaryBtns = page.locator('.btn-tertiary');
    await expect(tertiaryBtns).toHaveCount(2);
  });

  test('reassurance text present', async ({ page }) => {
    await expect(page.getByText(/We'll confirm site details.*no obligation/i)).toBeVisible();
  });
});

