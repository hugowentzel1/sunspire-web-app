import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const DEMO = `${BASE_URL}/?company=facebook&demo=1`;
const PAID = `${BASE_URL}/?company=microsoft&demo=0`;
const DEMO_REPORT = `${BASE_URL}/report?company=facebook&demo=1`;
const PAID_REPORT = `${BASE_URL}/report?company=microsoft&demo=0`;
const SAMPLE_ADDR = '465%20Page%20Pl%2C%20Roswell%2C%20GA';

test.describe('Navigation differences', () => {
  test('paid hides Pricing/Partners/Support', async ({ page }) => {
    await page.goto(PAID);
    for (const label of ['Pricing', 'Partners', 'Support']) {
      await expect(page.getByRole('link', { name: label, exact: true })).toHaveCount(0);
    }
  });

  test('demo shows Pricing/Partners/Support and activation button', async ({ page }) => {
    await page.goto(DEMO);
    // Use .first() to avoid strict mode violations (nav + footer both have these links)
    await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Partners' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Support' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Activate on Your Domain/i })).toBeVisible();
  });
});

test.describe('Report page affordances', () => {
  test('paid report shows Back to Home + New Analysis', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    await expect(page.getByTestId('back-home-link')).toBeVisible();
    await expect(page.getByTestId('new-analysis-button')).toBeVisible();
  });

  test('demo report shows Back to Home + New Analysis', async ({ page }) => {
    await page.goto(`${DEMO_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    await expect(page.getByTestId('back-home-link')).toBeVisible();
    await expect(page.getByTestId('new-analysis-button')).toBeVisible();
  });

  test('demo report nav shows Pricing/Partners/Support in report header', async ({ page }) => {
    await page.goto(`${DEMO_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    // In report header, these should be visible in demo mode
    const nav = page.locator('header nav');
    await expect(nav.getByText('Pricing')).toBeVisible();
    await expect(nav.getByText('Partners')).toBeVisible();
    await expect(nav.getByText('Support')).toBeVisible();
  });

  test('paid report nav hides Pricing/Partners/Support in report header', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    // In report header, these should NOT be visible in paid mode
    const nav = page.locator('header nav');
    await expect(nav.getByText('Pricing')).toHaveCount(0);
    await expect(nav.getByText('Partners')).toHaveCount(0);
    await expect(nav.getByText('Support')).toHaveCount(0);
  });
});

test.describe('Paid homeowner CTAs', () => {
  test('paid has top/bottom CTAs + download/share', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    // Top CTA
    await expect(page.getByTestId('paid-cta-top')).toBeVisible();
    const topCta = page.getByTestId('paid-cta-top');
    await expect(topCta.getByRole('link', { name: /Book a Consultation/i })).toBeVisible();
    await expect(topCta.getByRole('link', { name: /Talk to a Specialist/i })).toBeVisible();
    
    // Bottom CTA
    await expect(page.getByTestId('paid-cta-bottom')).toBeVisible();
    const bottomCta = page.getByTestId('paid-cta-bottom');
    await expect(bottomCta.getByRole('link', { name: /Book a Consultation/i })).toBeVisible();
    await expect(bottomCta.getByRole('link', { name: /Talk to a Specialist/i })).toBeVisible();
    await expect(bottomCta.getByRole('button', { name: /Download PDF/i })).toBeVisible();
    await expect(bottomCta.getByRole('button', { name: /Copy Share Link/i })).toBeVisible();
  });

  test('demo does NOT show paid CTAs', async ({ page }) => {
    await page.goto(`${DEMO_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    await expect(page.getByTestId('paid-cta-top')).toHaveCount(0);
    await expect(page.getByTestId('paid-cta-bottom')).toHaveCount(0);
  });
});

test.describe('Demo artifacts absent on paid', () => {
  test('paid has no activation/pricing/refund/demo ribbon/etc.', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('domcontentloaded');
    
    const forbidden = [
      'Activate on Your Domain — 24 Hours',
      '$99/mo',
      '$399 setup',
      '14-day refund',
      'Comparable tools cost $2,500+/mo',
      'Unlock Full Report',
      'Private demo for',
      'System Status',
      'Support Center',
      'Partner Program',
      'support@getsunspire.com',
      'billing@getsunspire.com'
    ];
    
    for (const s of forbidden) {
      const count = await page.locator(`text="${s}"`).count();
      expect(count).toBe(0);
    }
  });

  test('demo DOES show activation/pricing', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForLoadState('domcontentloaded');
    
    // At least one of these demo artifacts should be visible
    const hasActivation = await page.getByText('Activate on Your Domain').count();
    expect(hasActivation).toBeGreaterThan(0);
  });
});

test.describe('Minimal legal/attribution and no duplicates', () => {
  test('address input has Google attribution (demo and paid)', async ({ page }) => {
    for (const url of [DEMO, PAID]) {
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');
      
      // Find the address input and trigger the dropdown
      const addressInput = page.locator('input[type="text"]').first();
      await addressInput.click();
      await addressInput.fill('123 Main');
      await page.waitForTimeout(1000); // Wait for autocomplete
      
      // Check if "Powered by Google" appears in the dropdown or as a label
      const poweredByGoogle = await page.locator('text=/Powered by Google/i').count();
      expect(poweredByGoogle).toBeGreaterThan(0);
    }
  });

  test('report data sources line appears exactly once on paid', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    const dataSourcesLine = page.getByTestId('data-sources-line');
    await expect(dataSourcesLine).toBeVisible();
    
    // Ensure it contains the expected text
    await expect(dataSourcesLine).toContainText('Data sources: NREL PVWatts, U.S. EIA, and Google Maps');
    await expect(dataSourcesLine).toContainText('Last validated');
  });

  test('report data sources line appears exactly once on demo', async ({ page }) => {
    await page.goto(`${DEMO_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    const dataSourcesLine = page.getByTestId('data-sources-line');
    await expect(dataSourcesLine).toBeVisible();
  });

  test('PVWatts trademark line appears at most once', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    const count = await page.locator('text=/PVWatts.*registered trademark/i').count();
    expect(count).toBeLessThanOrEqual(1);
    expect(count).toBeGreaterThanOrEqual(1); // Should appear exactly once
  });

  test('cookie banner is off by default on paid', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('domcontentloaded');
    
    // Cookie banner should NOT appear on paid by default
    await expect(page.getByRole('button', { name: /Accept/i })).toHaveCount(0);
  });

  test('cookie banner may appear on demo', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForLoadState('domcontentloaded');
    
    // Cookie banner might appear on demo (it's allowed)
    // This test just ensures it doesn't crash
    const acceptButton = await page.getByRole('button', { name: /Accept/i }).count();
    expect(acceptButton).toBeGreaterThanOrEqual(0);
  });
});

test.describe('View Methodology affordance', () => {
  test('report page has View Methodology link (paid)', async ({ page }) => {
    await page.goto(`${PAID_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    // Look for View Methodology link or button
    const methodologyLink = page.getByText(/View Methodology/i);
    await expect(methodologyLink).toBeVisible();
  });

  test('report page has View Methodology link (demo)', async ({ page }) => {
    await page.goto(`${DEMO_REPORT}&address=${SAMPLE_ADDR}`);
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 10000 });
    
    const methodologyLink = page.getByText(/View Methodology/i);
    await expect(methodologyLink).toBeVisible();
  });
});

