import { test, expect } from '@playwright/test';

const LIVE_BASE = process.env.LIVE_BASE!;
const DEMO_BASE = process.env.DEMO_BASE || LIVE_BASE;
const QA_TENANT_SLUG = process.env.QA_TENANT_SLUG || 'qa-acme';
const TEST_API_TOKEN = process.env.TEST_API_TOKEN;

async function see(page, tid) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toBeVisible();
}
async function notSee(page, tid) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toHaveCount(0);
}
async function seeText(page, text) {
  await expect(page.getByText(new RegExp(text, 'i'))).toBeVisible();
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
  test('shows demo CTAs/marketing/locks', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco&demo=1`, { waitUntil: 'networkidle' });
    await see(page, 'demo-cta');
    await see(page, 'pricing-section');
    await see(page, 'howitworks-section');
    // optional: await see(page, 'demo-badge');
    await notSee(page, 'live-bar');
  });
});

test.describe('DEMO via slug', () => {
  test('outreach slug redirects to demo', async ({ page }) => {
    await page.goto(`${DEMO_BASE}/o/testco-abc123`, { waitUntil: 'networkidle' });
    await see(page, 'demo-cta');
  });
});

test.describe('PAID experience', () => {
  test('no demo CTAs; shows Live bar; footer legal present; no marketing links', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, { waitUntil: 'networkidle' });
    await notSee(page, 'demo-cta');
    await notSee(page, 'pricing-section');
    await notSee(page, 'howitworks-section');
    await see(page, 'live-bar');
    await see(page, 'footer-legal-links');
    await expect(page.locator('[data-testid="footer-marketing-links"]')).toHaveCount(0);
  });

  test('lead submit shows success toast (and optionally verifies Airtable)', async ({ page, request }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, { waitUntil: 'networkidle' });
    const address = page.locator('input[name="address"], input[placeholder*="address" i]').first();
    const submit = page.getByRole('button', { name: /get quote|see estimate|calculate|quote/i }).first();
    await address.fill('1600 Pennsylvania Ave NW, Washington, DC 20500');
    await submit.click();
    await see(page, 'lead-success-toast');

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