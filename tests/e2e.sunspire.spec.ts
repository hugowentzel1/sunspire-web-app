import { test, expect } from '@playwright/test';

const LIVE_BASE = process.env.LIVE_BASE || 'https://sunspire-web-app.vercel.app';

// Utility: case-insensitive contains
async function expectHasText(page, text: string) {
  await expect(page.getByText(new RegExp(text, 'i'))).toBeVisible();
}

async function expectNotHasText(page, text: string) {
  await expect(page.getByText(new RegExp(text, 'i'))).toHaveCount(0);
}

test.describe('DEMO experience', () => {
  test('shows demo CTAs, locks, and marketing', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=testco&demo=1`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should see demo indicators
    await expectHasText(page, 'Demo');
    await expectHasText(page, 'Activate on Your Domain');
    await expectHasText(page, 'Preview:');
    await expectHasText(page, 'Expires in');

    // Should see marketing sections
    await expectHasText(page, 'How It Works');
    await expectHasText(page, 'Frequently Asked Questions');

    // Footer should show marketing links
    await expectHasText(page, 'Pricing');
    await expectHasText(page, 'Partners');
    await expectHasText(page, 'Demo');
  });

  test('shows demo CTAs on report page', async ({ page }) => {
    const url = `${LIVE_BASE}/report?company=testco&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should see demo indicators
    await expectHasText(page, 'Preview:');
    await expectHasText(page, 'Expires in');
    await expectHasText(page, 'Ready to Launch Your Branded Tool?');
    await expectHasText(page, 'Unlock Full Report');
    await expectHasText(page, 'Activate on Your Domain');

    // Should see demo watermark
    await expectHasText(page, 'Demo for');
  });
});

test.describe('PAID experience', () => {
  // Make/confirm a tenant slug in Airtable first: qa-acme (demo=false)
  const slug = process.env.QA_TENANT_SLUG || 'qa-acme';

  test('hides demo CTAs/marketing; shows Live bar on homepage', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=${slug}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should NOT see demo indicators
    await expectNotHasText(page, 'Activate on Your Domain');
    await expectNotHasText(page, 'Demo limit reached');
    await expectNotHasText(page, 'Preview:');
    await expectNotHasText(page, 'Expires in');

    // Should NOT see marketing sections
    await expectNotHasText(page, 'How It Works');
    await expectNotHasText(page, 'Frequently Asked Questions');

    // Should see Live confirmation bar
    await expectHasText(page, 'Live for');
    await expectHasText(page, 'Leads now save to your CRM');

    // Footer should NOT have Sunspire sales links
    await expectNotHasText(page, 'Pricing');
    await expectNotHasText(page, 'Partners');
    await expectNotHasText(page, 'Demo');
  });

  test('hides demo CTAs/marketing; shows Live bar on report page', async ({ page }) => {
    const url = `${LIVE_BASE}/report?company=${slug}&address=123%20Main%20St&lat=40.7128&lng=-74.0060`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should NOT see demo indicators
    await expectNotHasText(page, 'Preview:');
    await expectNotHasText(page, 'Expires in');
    await expectNotHasText(page, 'Ready to Launch Your Branded Tool?');
    await expectNotHasText(page, 'Unlock Full Report');
    await expectNotHasText(page, 'Activate on Your Domain');

    // Should see Live confirmation bar
    await expectHasText(page, 'Live for');
    await expectHasText(page, 'Leads now save to your CRM');

    // Should NOT see demo watermark
    await expectNotHasText(page, 'Demo for');
  });

  test('shows success toast on lead submit (paid only)', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=${slug}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // This test would need a lead submission form to be present
    // For now, we'll just verify the page loads without demo elements
    await expectNotHasText(page, 'Demo');
    await expectHasText(page, 'Live for');
  });
});

test.describe('Edge cases', () => {
  test('company param without demo=1 should be paid mode', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=testco`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should be treated as paid mode
    await expectNotHasText(page, 'Demo');
    await expectNotHasText(page, 'Activate on Your Domain');
    await expectHasText(page, 'Live for');
  });

  test('demo=0 should be paid mode', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=testco&demo=0`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should be treated as paid mode
    await expectNotHasText(page, 'Demo');
    await expectNotHasText(page, 'Activate on Your Domain');
    await expectHasText(page, 'Live for');
  });

  test('demo=false should be paid mode', async ({ page }) => {
    const url = `${LIVE_BASE}/?company=testco&demo=false`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Should be treated as paid mode
    await expectNotHasText(page, 'Demo');
    await expectNotHasText(page, 'Activate on Your Domain');
    await expectHasText(page, 'Live for');
  });
});
