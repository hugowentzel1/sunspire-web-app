import { test, expect } from '@playwright/test';

const LIVE_BASE = process.env.LIVE_BASE!;
const DEMO_BASE = process.env.DEMO_BASE || LIVE_BASE;
const QA_TENANT_SLUG = process.env.QA_TENANT_SLUG || 'qa-acme';
const TEST_API_TOKEN = process.env.TEST_API_TOKEN; // optional

async function see(page, tid: string) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toBeVisible();
}

async function notSee(page, tid: string) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toHaveCount(0);
}

async function seeText(page, text: string | RegExp) {
  await expect(page.getByText(text instanceof RegExp ? text : new RegExp(text, 'i'))).toBeVisible();
}

async function notSeeText(page, text: string | RegExp) {
  await expect(page.getByText(text instanceof RegExp ? text : new RegExp(text, 'i'))).toHaveCount(0);
}

test.describe('Health', () => {
  test('healthz 200', async ({ request }) => {
    const res = await request.get(`${LIVE_BASE}/healthz`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBeTruthy();
  });
});

test.describe('DEMO via query', () => {
  test('demo CTAs/marketing/locks appear; paid UI absent', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco&demo=1`, { waitUntil: 'networkidle' });

    // Demo should show…
    await see(page, 'demo-cta');
    await see(page, 'pricing-section');
    await see(page, 'howitworks-section');
    // If you have a demo badge:
    // await see(page, 'demo-badge');

    // And NOT show paid-only
    await notSee(page, 'live-bar');
  });
});

test.describe('DEMO via slug redirect', () => {
  test('outreach slug redirects to demo view', async ({ page }) => {
    await page.goto(`${DEMO_BASE}/o/testco-abc123`, { waitUntil: 'networkidle' });
    await see(page, 'demo-cta');
  });
});

test.describe('PAID experience', () => {
  test('no demo CTAs; shows Live bar; footer legal present; no marketing links', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, { waitUntil: 'networkidle' });

    // Paid should NOT show demo/sales content
    await notSee(page, 'demo-cta');
    await notSee(page, 'pricing-section');
    await notSee(page, 'howitworks-section');

    // Paid should show the Live bar
    await see(page, 'live-bar');

    // Footer differences
    await see(page, 'footer-legal-links');
    await notSee(page, 'footer-marketing-links');
  });

  test('lead submit shows success toast (and optionally verifies Airtable)', async ({ page, request }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, { waitUntil: 'networkidle' });

    // Adjust selectors to your actual form:
    // If address autocomplete is used, pick a stable selector on the input and submit button
    const address = page.locator('input[name="address"], input[placeholder*="address" i]').first();
    const submit = page.getByRole('button', { name: /get quote|see estimate|calculate/i }).first();

    // If your flow requires a full address string, use a known static address
    await address.fill('1600 Pennsylvania Ave NW, Washington, DC 20500');
    await submit.click();

    // Expect the paid success toast
    await see(page, 'lead-success-toast');

    // Optional: verify last lead in Airtable via QA endpoint
    if (TEST_API_TOKEN) {
      const res = await request.get(`${LIVE_BASE}/api/test/last-lead?tenant=${QA_TENANT_SLUG}`, {
        headers: { 'x-test-token': TEST_API_TOKEN }
      });
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.ok).toBeTruthy();
      expect(json.last).toBeTruthy();
    }
  });
});