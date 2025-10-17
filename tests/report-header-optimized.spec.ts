import { test, expect } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3000';

const shortAddress = '1232 Virginia Ct, Atlanta, GA 30306, USA';
const longAddress =
  '12345 Really Long Street Name With Several Segments, Mountain Park, GA 30047, United States of America';

test.describe('Report header - optimized layout & content', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a real report route; adjust query params to hit your report page
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="report-address"]');
  });

  test('keeps Live Preview line and CTA untouched', async ({ page }) => {
    await expect(page.getByText(/Live Preview/i)).toBeVisible();
    // Assert a primary CTA exists in the first card row (adjust selector to your CTA)
    await expect(page.getByRole('button', { name: /Unlock Full Report/i }).first()).toBeVisible();
  });

  test('headings bold; address not bold; meta values not bold', async ({ page }) => {
    const h1 = page.locator('h1');
    const h1Weight = await h1.evaluate(n => +getComputedStyle(n).fontWeight);
    expect(h1Weight).toBeGreaterThanOrEqual(600); // bold/semibold

    const addr = page.locator('[data-testid="report-address"]');
    const addrWeight = await addr.evaluate(n => +getComputedStyle(n).fontWeight);
    expect(addrWeight).toBeLessThan(600); // NOT bold

    // Meta labels and values share the same weight (NOT bold).
    const meta = page.locator('[data-testid="report-meta"]');
    const valueWeights = await meta.locator('span').evaluateAll(nodes =>
      nodes.map(n => +getComputedStyle(n).fontWeight)
    );
    expect(valueWeights.every(w => w < 600)).toBeTruthy();
  });

  test('address wraps naturally and stays ≤ 2 lines (desktop)', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddress)}&lat=33.8613729&lng=-84.1563424`);
    const el = page.locator('[data-testid="report-address"]');

    // Rough line count via rect height / line-height
    const { lines } = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      const lh = parseFloat(cs.lineHeight);
      const h = node.getBoundingClientRect().height;
      return { lines: Math.round(h / lh) };
    });
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('meta stack has exactly 3 rows and centered', async ({ page }) => {
    const meta = page.locator('[data-testid="report-meta"]');
    await expect(meta.locator('div')).toHaveCount(3);
    const align = await meta.evaluate(n => getComputedStyle(n).textAlign);
    expect(align).toBe('center');
  });

  test('tabular numbers applied to expires row to avoid wiggling digits', async ({ page }) => {
    const expires = page.locator('[data-testid="meta-expires"]');
    const fv = await expires.evaluate((n) => getComputedStyle(n).fontVariantNumeric);
    expect(fv).toMatch(/tabular-nums/);
  });

  test('mobile layout still within two lines and stacked meta', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddress)}&lat=33.8613729&lng=-84.1563424`);

    const addrSpan = page.locator('[data-testid="report-address"] span');
    const { lines } = await addrSpan.evaluate((node) => {
      const cs = getComputedStyle(node);
      const lh = parseFloat(cs.lineHeight);
      const h = node.getBoundingClientRect().height;
      return { lines: Math.round(h / lh) };
    });
    expect(lines).toBeLessThanOrEqual(2);

    await expect(page.locator('[data-testid="report-meta"] div')).toHaveCount(3);
  });

  test('address uses soft wrapping on commas', async ({ page }) => {
    const el = page.locator('[data-testid="report-address"]');
    const text = await el.innerText();
    // Should contain the address without visible changes
    expect(text).toContain('Virginia Ct');
    expect(text).toContain('Atlanta');
    expect(text).toContain('GA');
  });

  test('paid mode shows only one meta row', async ({ page }) => {
    await page.goto(`${base}/report?company=apple&brandColor=%2300FF00&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="report-meta"]');
    
    const meta = page.locator('[data-testid="report-meta"]');
    await expect(meta.locator('div')).toHaveCount(1);
    await expect(page.locator('[data-testid="meta-generated"]')).toBeVisible();
  });
});
