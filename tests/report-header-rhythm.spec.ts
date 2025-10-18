import { test, expect } from '@playwright/test';
const base = process.env.BASE_URL ?? 'http://localhost:3000';

const addrShort = '123 Absalom Rd, Mauldin, SC 29680, USA';
const addrLong = '12345 Sassafras Lane Southwest, Mountain Park, GA 30047, United States';

const px = async (el: any) => parseFloat(await el.evaluate((n: any) => getComputedStyle(n).fontSize));

async function gap(page: any, aSel: string, bSel: string) {
  const a = page.locator(aSel);
  const b = page.locator(bSel);
  const ab = await a.boundingBox();
  const bb = await b.boundingBox();
  return Math.round(bb!.y - (ab!.y + ab!.height)); // vertical gap in px
}

test.describe('Report header – rhythm lock & readability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${base}/report?address=${encodeURIComponent(addrShort)}&runsLeft=0&demo=1`);
    await expect(page.locator('[data-testid="hdr"]')).toBeVisible();
  });

  test('spacing matches site grid (24/16/8/16/24)', async ({ page }) => {
    const g1 = await gap(page, '[data-testid="hdr-h1"]', '[data-testid="hdr-logo"]');
    const g2 = await gap(page, '[data-testid="hdr-logo"]', '[data-testid="hdr-sub"]');
    const g3 = await gap(page, '[data-testid="hdr-sub"]', '[data-testid="hdr-address"]');
    const g4 = await gap(page, '[data-testid="hdr-address"]', '[data-testid="hdr-meta"]');
    const g5 = await gap(page, '[data-testid="hdr-meta"]', '[data-testid="tile-systemSize"]');

    expect(g1).toBeGreaterThanOrEqual(24);
    expect(g1).toBeLessThanOrEqual(24);
    expect(g2).toBeGreaterThanOrEqual(16);
    expect(g2).toBeLessThanOrEqual(16);
    expect(g3).toBeGreaterThanOrEqual(8);
    expect(g3).toBeLessThanOrEqual(8);
    expect(g4).toBeGreaterThanOrEqual(16);
    expect(g4).toBeLessThanOrEqual(16);
    expect(g5).toBeGreaterThanOrEqual(24);
    expect(g5).toBeLessThanOrEqual(24);
  });

  test('type hierarchy & weight (H1/Sub bold, Address regular)', async ({ page }) => {
    const h1 = page.locator('[data-testid="hdr-h1"]');
    const sub = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');

    expect(await px(h1)).toBeGreaterThanOrEqual(36); // clamp tops at ~40
    expect(await px(sub)).toBeGreaterThanOrEqual(19);
    expect(await px(addr)).toBeGreaterThanOrEqual(17);

    const w = async (el: any) => parseInt(await el.evaluate((n: any) => getComputedStyle(n).fontWeight), 10);
    expect(await w(h1)).toBeGreaterThanOrEqual(600);
    expect(await w(sub)).toBeGreaterThanOrEqual(600);
    expect(await w(addr)).toBeLessThan(600);
  });

  test('"Preview: 0 runs left" value+unit share SAME tone (single span)', async ({ page }) => {
    const runs = page.locator('[data-testid="meta-runs"]');
    await expect(runs.locator('span')).toHaveCount(1);
    await expect(runs).toContainText('Preview: 0 runs left');
  });

  test('address wraps nicely (≤2 lines), no ellipsis', async ({ page }) => {
    await page.goto(`${base}/report?address=${encodeURIComponent(addrLong)}&runsLeft=2&demo=1`);
    const addr = page.locator('[data-testid="hdr-address"]');
    await expect(addr).toBeVisible();
    const containsEllipsis = await addr.evaluate((n: any) => n.textContent!.includes('…'));
    expect(containsEllipsis).toBeFalsy();

    // rough line count by height / line-height
    const lines = await addr.evaluate((node: any) => {
      const cs = getComputedStyle(node);
      const lh = parseFloat(cs.lineHeight);
      const h = (node as HTMLElement).getBoundingClientRect().height;
      return Math.round(h / lh);
    });
    expect(lines).toBeLessThanOrEqual(2);
  });

  test('mobile keeps rhythm & readability', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${base}/report?address=${encodeURIComponent(addrLong)}&runsLeft=1&demo=1`);
    const h1 = page.locator('[data-testid="hdr-h1"]');
    const sub = page.locator('[data-testid="hdr-sub"]');
    const addr = page.locator('[data-testid="hdr-address"]');

    expect(await px(h1)).toBeGreaterThanOrEqual(28);
    expect(await px(sub)).toBeGreaterThanOrEqual(18);
    expect(await px(addr)).toBeGreaterThanOrEqual(17);

    // key gaps still match scaled rhythm (allow ±2px tolerance on mobile rendering)
    const g1 = await gap(page, '[data-testid="hdr-h1"]', '[data-testid="hdr-logo"]');
    const g2 = await gap(page, '[data-testid="hdr-logo"]', '[data-testid="hdr-sub"]');
    expect(Math.abs(g1 - 24)).toBeLessThanOrEqual(2);
    expect(Math.abs(g2 - 16)).toBeLessThanOrEqual(2);
  });
});
