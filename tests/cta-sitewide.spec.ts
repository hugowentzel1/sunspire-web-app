import { test, expect } from '@playwright/test';

const CTA = 'Launch on Your Domain Now';
const microcopy = 'Launch now — live on your domain in 24 hours.';
const legalPhrase = /setup[- ]fee/i;
const legacy = [
  '14-day money-back','14 day','14-day refund','<24 hours','24h','24 hrs',
  'setup fee refund','Launch Your Branded Version','Launch on Your Domain in 24 Hours'
];

test.describe('Sunspire sitewide CTA + microcopy', () => {
  test('Hero CTA and microcopy visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByRole('button', { name: CTA })).toBeVisible();
    const html = await page.content();
    expect(html.includes(microcopy)).toBeTruthy();
  });

  test('Pricing page updated', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'networkidle' });
    const html = await page.content();
    expect(html.includes(microcopy)).toBeTruthy();
    expect(html.includes('Go live on your domain in 24 hours')).toBeTruthy();
    await expect(page.getByRole('button', { name: CTA })).toBeVisible();
  });

  test('FAQ and Terms updated', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(await page.content()).toContain('Live on your domain in 24 hours');

    await page.goto('/terms');
    const html = await page.content();
    expect(/24 hours/i.test(html)).toBeTruthy();
    expect(legalPhrase.test(html)).toBeTruthy();
  });

  test('Refund page updated', async ({ page }) => {
    await page.goto('/legal/refund');
    const html = await page.content();
    expect(/Setup[- ]Fee Refund Guarantee/i.test(html)).toBeTruthy();
    expect(/24 hours/i.test(html)).toBeTruthy();
  });

  test('No legacy phrases', async ({ page }) => {
    const pages = ['/', '/pricing', '/terms', '/legal/refund'];
    for (const p of pages) {
      await page.goto(p);
      const html = await page.content();
      legacy.forEach((phrase) => {
        expect(new RegExp(phrase, 'i').test(html)).toBeFalsy();
      });
    }
  });
});
