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

test.describe('Header — structure, sizing, spacing, tone', () => {
  test('H1 appears before logo (DOM and visually) and there is only one H1', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    await expect(page.locator('h1')).toHaveCount(1);
    const h1   = page.locator('[data-testid="hdr-h1"]');
    const logo = page.locator('[data-testid="hdr-logo"]');
    await expect(h1).toBeVisible();
    await expect(logo).toBeVisible();

    const h1Box = await h1.boundingBox();
    const logoBox = await logo.boundingBox();
    expect(h1Box!.y).toBeLessThan(logoBox!.y);
  });

  test('font sizes hit targets (desktop) and hierarchy holds', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const h1   = page.locator('[data-testid="hdr-h1"]');
    const sub  = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');
    const meta = page.locator('[data-testid="hdr-meta"] div.py-1').first();

    const h1Size = toPx(await h1.evaluate(n => getComputedStyle(n).fontSize));
    const subSize = toPx(await sub.evaluate(n => getComputedStyle(n).fontSize));
    const addrSize = toPx(await addr.evaluate(n => getComputedStyle(n).fontSize));
    const metaSize = toPx(await meta.evaluate(n => getComputedStyle(n).fontSize));

    expect(h1Size).toBeGreaterThanOrEqual(40); // ~42px target
    expect(subSize).toBeGreaterThanOrEqual(20); // ~20px target
    expect(addrSize).toBeGreaterThanOrEqual(18); // 18px
    expect(metaSize).toBeGreaterThanOrEqual(15); // 15px

    // Weights: H1/Sub bold; address regular
    const h1Weight  = await h1.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));
    const subWeight = await sub.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));
    const addrWeight = await addr.evaluate(n => parseInt(getComputedStyle(n).fontWeight, 10));

    expect(h1Weight).toBeGreaterThanOrEqual(600);
    expect(subWeight).toBeGreaterThanOrEqual(600);
    expect(addrWeight).toBeLessThan(600);
  });

  test('address wraps nicely (≤2 lines) with balance and no ellipsis', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-address"]');
    
    const addr = page.locator('[data-testid="hdr-address"]');
    await expect(addr).toBeVisible();
    expect(await addr.innerText()).not.toContain('…');
    const lines = await lineCount(addr);
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('meta stack uses 3 rows; "Preview: {x} runs left" has value + unit same tone; countdown tabular', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta.locator('div.py-1')).toHaveCount(3);

    const runs = page.locator('[data-testid="meta-runs"]');
    // Check that "X runs left" is wrapped as a single span (same tone)
    const spanCount = await runs.locator('span').count();
    expect(spanCount).toBe(1);
    await expect(runs.locator('span')).toContainText('run');

    // Expires row uses tabular-nums
    const expires = page.locator('[data-testid="meta-expires"]');
    const fv = await expires.evaluate(n => getComputedStyle(n).fontVariantNumeric);
    expect(fv).toMatch(/tabular-nums/);
  });

  test('mobile keeps hierarchy and readable sizes', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(longAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const h1   = page.locator('[data-testid="hdr-h1"]');
    const sub  = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');

    const h1Size = toPx(await h1.evaluate(n => getComputedStyle(n).fontSize));
    const subSize = toPx(await sub.evaluate(n => getComputedStyle(n).fontSize));
    const addrSize = toPx(await addr.evaluate(n => getComputedStyle(n).fontSize));

    expect(h1Size).toBeGreaterThanOrEqual(28);
    expect(subSize).toBeGreaterThanOrEqual(18);
    expect(addrSize).toBeGreaterThanOrEqual(17);

    const addrLines = await lineCount(addr);
    expect(addrLines).toBeLessThanOrEqual(2);
  });

  test('spacing rhythm works with stat cards', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');

    const getMarginTop = async (sel: string) =>
      await page.locator(sel).evaluate(n => parseFloat(getComputedStyle(n as HTMLElement).marginTop));

    const mtLogo   = await getMarginTop('[data-testid="hdr-logo"]');      // should be ~ mt-6 (1.5rem = 24px)
    const mtSub   = await getMarginTop('[data-testid="hdr-sub"]');      // should be ~ mt-4 (1rem = 16px)
    const mtAddr  = await getMarginTop('[data-testid="hdr-address"]');  // ~ mt-2 (0.5rem = 8px)
    const mtMeta  = await getMarginTop('[data-testid="hdr-meta"]');     // ~ mt-4 (16px)

    expect(Math.round(mtLogo)).toBeGreaterThanOrEqual(22); // ~24px
    expect(Math.round(mtSub)).toBeGreaterThanOrEqual(14); // ~16px
    expect(Math.round(mtAddr)).toBeGreaterThanOrEqual(6); // ~8px
    expect(Math.round(mtMeta)).toBeGreaterThanOrEqual(14); // ~16px
  });

  test('paid mode shows only one meta row', async ({ page }) => {
    await page.goto(`${base}/report?company=apple&brandColor=%2300FF00&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-meta"]');
    
    const meta = page.locator('[data-testid="hdr-meta"]');
    await expect(meta.locator('div.py-1')).toHaveCount(1);
    await expect(page.locator('[data-testid="meta-generated"]')).toBeVisible();
  });

  test('header sizing/spacing matches industry-standard spec', async ({ page }) => {
    await page.goto(`${base}/report?demo=1&company=tesla&brandColor=%23CC0000&address=${encodeURIComponent(shortAddr)}&lat=33.8613729&lng=-84.1563424`);
    await page.waitForSelector('[data-testid="hdr-h1"]');
    
    const h1 = page.locator('[data-testid="hdr-h1"]');
    const logo = page.locator('[data-testid="hdr-logo"]');
    const sub = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');

    const toPx = async (locator: any) =>
      parseFloat(await locator.evaluate((n: HTMLElement) => getComputedStyle(n).fontSize));

    // Size checks - industry standard typography ladder
    expect(await toPx(h1)).toBeGreaterThanOrEqual(40);   // 42px target
    expect(await toPx(sub)).toBeGreaterThanOrEqual(20);  // 20px target  
    expect(await toPx(addr)).toBeGreaterThanOrEqual(18); // 18px target

    // Spacing rhythm - visual balance with stat cards
    const box = async (locator: any) => await locator.boundingBox();
    const y = {
      h1: (await box(h1))!.y,
      logo: (await box(logo))!.y,
      sub: (await box(sub))!.y,
      addr: (await box(addr))!.y,
    };
    expect(y.logo - y.h1).toBeGreaterThanOrEqual(20); // H1 → Logo: mt-6 (24px)
    expect(y.sub - y.logo).toBeGreaterThanOrEqual(16); // Logo → Sub: mt-4 (16px)
    expect(y.addr - y.sub).toBeGreaterThanOrEqual(8);  // Sub → Address: mt-2 (8px)
  });
});
