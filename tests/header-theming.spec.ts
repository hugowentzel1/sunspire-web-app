import { test, expect } from '@playwright/test';
import { addrs, tenancies, lineCount, gap } from './_utils';

test.describe('Header & theming', () => {
  for (const mode of ['demo', 'paid'] as const) {
    test(`H1 before logo; brand color; spacing — ${mode}`, async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + (mode === 'demo' ? tenancies.demo(addrs.short) : tenancies.paid(addrs.short)));

      const h1 = page.getByTestId('hdr-h1');
      const logo = page.getByTestId('hdr-logo');
      const sub = page.getByTestId('hdr-sub');
      const addr = page.getByTestId('hdr-address');
      const meta = page.getByTestId('hdr-meta');

      await expect(h1).toBeVisible();
      await expect(logo).toBeVisible();
      await expect(sub).toBeVisible();
      await expect(addr).toBeVisible();
      await expect(meta).toBeVisible();

      // Visual order check: H1 above logo
      const h1Box = await h1.boundingBox();
      const logoBox = await logo.boundingBox();
      expect(h1Box!.y).toBeLessThan(logoBox!.y);

      // Type sizes (desktop targets)
      const toPx = async (loc: any) => parseFloat(await loc.evaluate((n: HTMLElement) => getComputedStyle(n).fontSize));
      expect(await toPx(h1)).toBeGreaterThanOrEqual(28); // clamp minimum
      expect(await toPx(sub)).toBeGreaterThanOrEqual(18); // clamp minimum  
      expect(await toPx(addr)).toBeGreaterThanOrEqual(17);

      // Address: balanced wrap, ≤ 2 lines, no ellipsis
      await expect(addr).toContainText(', AZ');
      expect(await addr.innerText()).not.toContain('…');
      expect(await lineCount(addr)).toBeLessThanOrEqual(2);

      // Demo shows "(Live Preview)", Paid does not
      const badge = page.getByText('(Live Preview)');
      if (mode === 'demo') {
        await expect(badge).toBeVisible();
      } else {
        await expect(badge).toHaveCount(0);
      }

      // Brand color applied to H1 company name
      if (mode === 'paid') {
        const brandSpan = h1.locator('span');
        const brandColor = await brandSpan.evaluate((n: HTMLElement) => getComputedStyle(n).color);
        expect(brandColor).not.toBe('rgb(0, 0, 0)'); // Should be brand color, not black
      }
    });

    test(`Header spacing matches 8px rhythm — ${mode}`, async ({ page, baseURL }) => {
      await page.goto((baseURL ?? '') + (mode === 'demo' ? tenancies.demo(addrs.short) : tenancies.paid(addrs.short)));

      // Check key spacing relationships
      const h1 = page.getByTestId('hdr-h1');
      const logo = page.getByTestId('hdr-logo');
      const sub = page.getByTestId('hdr-sub');
      const addr = page.getByTestId('hdr-address');
      const meta = page.getByTestId('hdr-meta');

      // H1 → Logo = 24px
      const g1 = await gap(page, '[data-testid="hdr-h1"]', '[data-testid="hdr-logo"]');
      expect(g1).toBeGreaterThanOrEqual(24);
      expect(g1).toBeLessThanOrEqual(24);

      // Logo → Sub = 16px  
      const g2 = await gap(page, '[data-testid="hdr-logo"]', '[data-testid="hdr-sub"]');
      expect(g2).toBeGreaterThanOrEqual(16);
      expect(g2).toBeLessThanOrEqual(16);

      // Sub → Address = 8px
      const g3 = await gap(page, '[data-testid="hdr-sub"]', '[data-testid="hdr-address"]');
      expect(g3).toBeGreaterThanOrEqual(8);
      expect(g3).toBeLessThanOrEqual(8);

      // Address → Meta = 16px
      const g4 = await gap(page, '[data-testid="hdr-address"]', '[data-testid="hdr-meta"]');
      expect(g4).toBeGreaterThanOrEqual(16);
      expect(g4).toBeLessThanOrEqual(16);

      // Meta → Cards = 32px
      const g5 = await gap(page, '[data-testid="hdr-meta"]', '[data-testid="tile-systemSize"]');
      expect(g5).toBeGreaterThanOrEqual(32);
      expect(g5).toBeLessThanOrEqual(32);
    });
  }
});
