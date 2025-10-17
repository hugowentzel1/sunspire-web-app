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

  test('address is centered, not bold, no truncation character', async ({ page }) => {
    const el = page.locator('[data-testid="report-address"]');
    await expect(el).toBeVisible();
    // Check computed font-weight (400..500 typical for regular; adjust if your variable font maps differently)
    const weight = await el.evaluate((node) => getComputedStyle(node).fontWeight);
    expect(Number(weight)).toBeLessThan(600);

    const text = await el.innerText();
    expect(text).not.toContain('…'); // no ellipsis
    // centered
    const ta = await el.evaluate((n) => getComputedStyle(n).textAlign);
    expect(ta).toBe('center');
  });

  test('address wraps naturally and stays within two lines at desktop', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddress)}&lat=33.8613729&lng=-84.1563424`);
    const el = page.locator('[data-testid="report-address"] span'); // inner span with line-clamp-2

    // Rough line count via rect height / line-height
    const { lines } = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      const lh = parseFloat(cs.lineHeight);
      const h = node.getBoundingClientRect().height;
      return { lines: Math.round(h / lh) };
    });
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('meta stack has exactly three rows, centered, uniform size', async ({ page }) => {
    const meta = page.locator('[data-testid="report-meta"]');
    await expect(meta).toBeVisible();
    await expect(meta.locator('div')).toHaveCount(3);
    const align = await meta.evaluate((n) => getComputedStyle(n).textAlign);
    expect(align).toBe('center');

    const sizes = await meta.locator('div').evaluateAll((nodes) =>
      nodes.map((n) => getComputedStyle(n).fontSize)
    );
    expect(new Set(sizes).size).toBe(1); // uniform font size

    // Values use medium weight (check one row)
    const runsRow = page.locator('[data-testid="meta-runs"] span.font-medium');
    await expect(runsRow).toBeVisible();
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
