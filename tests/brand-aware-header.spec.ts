import { test, expect } from '@playwright/test';
const base = process.env.BASE_URL ?? 'http://localhost:3000';

const shortAddr = '1232 Virginia Ct, Atlanta, GA 30306, USA';
const longAddr  = '12345 Sassafras Lane Southwest, Mountain Park, GA 30047, United States of America';

const toPx = (s: string) => parseFloat(s);

async function lineCount(locator: any) {
  return await locator.evaluate((node: HTMLElement) => {
    const cs = getComputedStyle(node);
    const lh = parseFloat(cs.lineHeight);
    const h  = node.getBoundingClientRect().height;
    return Math.round(h / lh);
  });
}

test.describe('Brand-aware header with automatic contrast safety', () => {
  test('H1 above logo and brand color applied safely', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=Acme&brandColor=%23A8E0FF&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const h1 = page.getByTestId('hdr-h1');
    const logo = page.getByTestId('hdr-logo');
    const brandSpan = h1.locator('span').first(); // "Acme"

    // Order
    const h1Y = (await h1.boundingBox())!.y;
    const logoY = (await logo.boundingBox())!.y;
    expect(h1Y).toBeLessThan(logoY);

    // Brand color variable present
    const hasVar = await page.locator('section[style*="--brand-ink"]').count();
    expect(hasVar).toBeGreaterThan(0);

    // Contrast sanity: computed color should not be near white
    const color = await brandSpan.evaluate(n => getComputedStyle(n).color);
    // Very light text will be rgb values > 200; we assert it's darker
    const nums = color.match(/\d+/g)!.map(Number);
    expect(Math.max(...nums)).toBeLessThan(230);
  });

  test('Typography ladder and spacing rhythm', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const h1 = page.getByTestId('hdr-h1');
    const sub = page.getByTestId('hdr-sub');
    const addr = page.getByTestId('hdr-address');
    const meta = page.getByTestId('hdr-meta');

    const toPx = async (el: any) =>
      parseFloat(await el.evaluate(n => getComputedStyle(n).fontSize));

    expect(await toPx(h1)).toBeGreaterThanOrEqual(36); // clamps to 42 on desktop
    expect(await toPx(sub)).toBeGreaterThanOrEqual(20);
    expect(await toPx(addr)).toBeGreaterThanOrEqual(18);
    expect(await toPx(meta)).toBeGreaterThanOrEqual(14);

    // spacing spot checks (approx):
    const logo = page.getByTestId('hdr-logo');
    const rect = async (el: any) => (await el.boundingBox())!.y;
    expect((await rect(logo)) - (await rect(h1))).toBeGreaterThanOrEqual(14); // mt-4 (16px)
  });

  test('Brand color contrast safety with light colors', async ({ page }) => {
    // Test with a very light color that should be automatically darkened
    await page.goto(`${base}/report?demo=1&company=LightBrand&brandColor=%23FFFF00&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const brandSpan = page.getByTestId('hdr-h1').locator('span').first();
    const color = await brandSpan.evaluate(n => getComputedStyle(n).color);
    
    // Should be darkened from bright yellow to meet contrast requirements
    const nums = color.match(/\d+/g)!.map(Number);
    expect(Math.max(...nums)).toBeLessThan(250); // Not pure bright yellow
  });

  test('Logo styling matches original spec', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-logo"]');

    const logo = page.getByTestId('hdr-logo');
    
    // Check logo container styling (original 96px)
    const logoBox = await logo.boundingBox();
    expect(logoBox!.width).toBeCloseTo(96, 5); // 96px width
    expect(logoBox!.height).toBeCloseTo(96, 5); // 96px height
    
    // Check for proper styling classes on the actual image or fallback div
    const imageElement = logo.locator('img').first();
    const fallbackElement = logo.locator('div.brand-gradient').first();
    
    // Check if image exists and has correct styling
    const imageCount = await imageElement.count();
    if (imageCount > 0) {
      const className = await imageElement.evaluate(n => n.className);
      expect(className).toContain('rounded-2xl');
      expect(className).toContain('shadow-[0_8px_30px_rgba(0,0,0,.08)]');
    } else {
      // Check fallback div styling
      const className = await fallbackElement.evaluate(n => n.className);
      expect(className).toContain('rounded-full');
      expect(className).toContain('shadow-[0_8px_30px_rgba(0,0,0,.08)]');
    }
  });

  test('Address wrapping and balance maintained', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-address"]');
    
    const addr = page.locator('[data-testid="hdr-address"]');
    await expect(addr).toBeVisible();
    expect(await addr.innerText()).not.toContain('…');
    const lines = await lineCount(addr);
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('Meta stack structure and single-tone values', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta.locator('div')).toHaveCount(3);

    const runs = page.locator('[data-testid="hdr-meta"] div').nth(1);
    // Check that "X runs left" is wrapped as a single span (same tone)
    const spanCount = await runs.locator('span').count();
    expect(spanCount).toBe(1);
    await expect(runs.locator('span')).toContainText('run');
  });

  test('Mobile responsiveness with brand colors', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const h1   = page.locator('[data-testid="hdr-h1"]');
    const sub  = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');

    const h1Size = toPx(await h1.evaluate(n => getComputedStyle(n).fontSize));
    const subSize = toPx(await sub.evaluate(n => getComputedStyle(n).fontSize));
    const addrSize = toPx(await addr.evaluate(n => getComputedStyle(n).fontSize));

    expect(h1Size).toBeGreaterThanOrEqual(30); // clamp minimum
    expect(subSize).toBeGreaterThanOrEqual(18); // clamp minimum
    expect(addrSize).toBeGreaterThanOrEqual(17); // clamp minimum

    const addrLines = await lineCount(addr);
    expect(addrLines).toBeLessThanOrEqual(2);
  });

  test('Paid mode shows only one meta row', async ({ page }) => {
    await page.goto(`${base}/report?company=apple&brandColor=%2300FF00&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta.locator('div')).toHaveCount(1);
    await expect(page.locator('[data-testid="hdr-meta"] div').first()).toBeVisible();
  });
});
