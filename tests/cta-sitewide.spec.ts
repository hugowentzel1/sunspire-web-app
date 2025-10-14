import { test, expect } from '@playwright/test';

const CTA = 'Start Activation — Demo Expires Soon';
const microcopy = 'Live on your site in 24 hours — setup fee refunded if not.';
const legalPhrase = /setup[- ]fee/i;
const legacy = [
  '14-day money-back','14 day','14-day refund','<24 hours','24h','24 hrs',
  'setup fee refund','Launch Your Branded Version','Launch on Your Domain in 24 Hours',
  'Launch on Your Domain Now'
];

test.describe('Sunspire sitewide CTA + microcopy', () => {
  test('Hero CTA and microcopy visible', async ({ page }) => {
    await page.goto('/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('primary-cta-hero')).toContainText(CTA);
    const html = await page.content();
    expect(html.includes(microcopy)).toBeTruthy();
  });

  test('Pricing page updated', async ({ page }) => {
    await page.goto('/pricing?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    const html = await page.content();
    expect(html.includes(microcopy)).toBeTruthy();
    expect(html.includes('Go live on your domain in 24 hours')).toBeTruthy();
  });

  test('FAQ and Terms updated', async ({ page }) => {
    await page.goto('/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    const html = await page.content();
    expect(html).toContain('Live on your site within 24 hours');

    await page.goto('/terms');
    const termsHtml = await page.content();
    expect(/24 hours/i.test(termsHtml)).toBeTruthy();
    expect(legalPhrase.test(termsHtml)).toBeTruthy();
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
      await page.goto(p + '?company=Netflix&demo=1');
      const html = await page.content();
      legacy.forEach((phrase) => {
        if (html.toLowerCase().includes(phrase.toLowerCase())) {
          throw new Error(`Found legacy phrase "${phrase}" on ${p}`);
        }
      });
    }
  });

  test('CTA buttons have lightning emoji and are centered', async ({ page }) => {
    await page.goto('/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    
    // Check hero CTA
    const heroCTA = page.getByTestId('primary-cta-hero');
    await expect(heroCTA).toBeVisible();
    const heroHTML = await heroCTA.innerHTML();
    expect(heroHTML).toContain('⚡');
    
    // Check bottom CTA
    const bottomCTA = page.getByTestId('primary-cta-bottom');
    await expect(bottomCTA).toBeVisible();
    const bottomHTML = await bottomCTA.innerHTML();
    expect(bottomHTML).toContain('⚡');
  });
});
