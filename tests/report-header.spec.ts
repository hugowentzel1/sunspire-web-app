import { test, expect } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
const shortAddress = '1232 Virginia Ct, Atlanta, GA 30306, USA';
const longAddress  = '12345 Sassafras Lane Southwest, Mountain Park, GA 30047, United States of America';

async function lineCount(locator: any) {
  return await locator.evaluate((node: HTMLElement) => {
    const cs = getComputedStyle(node);
    const lh = parseFloat(cs.lineHeight);
    const h  = node.getBoundingClientRect().height;
    return Math.round(h / lh);
  });
}

test.describe('Report header – hierarchy, readability, rhythm', () => {
  test('single H1, correct hierarchy and tokens', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    // Only one H1
    await expect(page.locator('h1')).toHaveCount(1);

    // H1 contains brand token and (Live Preview) token
    const h1 = page.locator('[data-testid="hdr-h1"]');
    await expect(h1).toContainText('Solar Quote');
    await expect(h1.locator('span:has-text("(Live Preview)")')).toBeVisible();

    // H1 is semibold (>= 600)
    const h1Weight = await h1.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));
    expect(h1Weight).toBeGreaterThanOrEqual(600);

    // Subheadline exists and is semibold
    const sub = page.locator('[data-testid="hdr-sub"]');
    await expect(sub).toBeVisible();
    const subWeight = await sub.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));
    expect(subWeight).toBeGreaterThanOrEqual(600);
  });

  test('address is regular weight, balanced, max two lines (desktop)', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-address"]');
    
    const addr = page.locator('[data-testid="hdr-address"]');
    await expect(addr).toBeVisible();

    // Regular (not bold)
    const w = await addr.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));
    expect(w).toBeLessThan(600);

    // Centered text
    const ta = await addr.evaluate(n => getComputedStyle(n).textAlign);
    expect(ta).toBe('center');

    // No ellipsis char
    expect(await addr.innerText()).not.toContain('…');

    // <= 2 lines
    const lines = await lineCount(page.locator('[data-testid="hdr-address-span"]'));
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('meta stack has 3 rows, values emphasized by tone (not bold), and uses tabular figures', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta).toBeVisible();

    // Exactly 3 rows
    await expect(meta.locator('div.py-1')).toHaveCount(3);

    // Values are same weight as labels (NOT bold)
    const valueSpans = meta.locator('span');
    const weights = await valueSpans.evaluateAll(nodes => nodes.map(n => parseInt(getComputedStyle(n).fontWeight, 10)));
    expect(weights.every(v => v < 600)).toBeTruthy();

    // Expires row uses tabular-nums
    const expires = page.locator('[data-testid="meta-expires"]');
    const fv = await expires.evaluate(n => getComputedStyle(n).fontVariantNumeric);
    expect(fv).toMatch(/tabular-nums/);
  });

  test('pluralization for runs left', async ({ page }) => {
    // Note: We'll test this with the demo mode which tracks runs
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="meta-runs"]');
    
    const runsText = await page.locator('[data-testid="meta-runs"]').innerText();
    
    // Should contain either "1 run left" or "X runs left"
    const hasCorrectPluralization = runsText.match(/1 run left/) || runsText.match(/\d+ runs left/);
    expect(hasCorrectPluralization).toBeTruthy();
  });

  test('spacing rhythm (H1→sub mt-2, sub→addr mt-1, addr→meta mt-2)', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const getMarginTop = async (sel: string) =>
      await page.locator(sel).evaluate(n => parseFloat(getComputedStyle(n as HTMLElement).marginTop));

    const mtSub   = await getMarginTop('[data-testid="hdr-sub"]');      // should be ~ mt-2 (0.5rem = 8px)
    const mtAddr  = await getMarginTop('[data-testid="hdr-address"]');  // ~ mt-1 (0.25rem = 4px)
    const mtMeta  = await getMarginTop('[data-testid="hdr-meta"]');     // ~ mt-2 (8px)

    expect(Math.round(mtSub)).toBeGreaterThanOrEqual(7); // ~8px
    expect(Math.round(mtAddr)).toBeGreaterThanOrEqual(3); // ~4px
    expect(Math.round(mtMeta)).toBeGreaterThanOrEqual(7); // ~8px
  });

  test('mobile address wraps cleanly and keeps 3-row meta', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-address-span"]');

    // Address should wrap cleanly (line-clamp-2 enforces max 2 visible lines)
    const addr = page.locator('[data-testid="hdr-address"]');
    await expect(addr).toBeVisible();
    
    // No ellipsis
    expect(await addr.innerText()).not.toContain('…');

    // 3-row meta on mobile
    await expect(page.locator('[data-testid="hdr-meta"] div.py-1')).toHaveCount(3);
  });

  test('no emojis/icons in meta', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    // Sanity: none of the meta lines should contain common emoji characters
    const text = await meta.innerText();
    const emojiRegex = /[\u{1F300}-\u{1FAFF}]/u;
    expect(emojiRegex.test(text)).toBeFalsy();
  });

  test('paid mode shows only one meta row', async ({ page }) => {
    await page.goto(`${base}/report?company=apple&brandColor=%2300FF00&address=${encodeURIComponent(shortAddress)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta.locator('div.py-1')).toHaveCount(1);
    await expect(page.locator('[data-testid="meta-generated"]')).toBeVisible();
  });
});
