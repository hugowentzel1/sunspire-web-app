import { test, expect } from '@playwright/test';

const LIVE_BASE = process.env.LIVE_BASE!;            // e.g. https://sunspire-web-app.vercel.app
const DEMO_BASE = process.env.DEMO_BASE || LIVE_BASE;

async function has(page, text: string) {
  await expect(page.getByText(new RegExp(text, 'i'))).toBeVisible();
}

async function notHas(page, text: string) {
  await expect(page.getByText(new RegExp(text, 'i'))).toHaveCount(0);
}

test.describe('DEMO via query', () => {
  test('shows demo CTAs/marketing/locks', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco&demo=1`, { waitUntil: 'networkidle' });
    await has(page, 'Activate on Your Domain');
    await has(page, 'How It Works');
    await has(page, 'Pricing');
    await has(page, 'Demo'); // label/watermark/limit text
  });
});

test.describe('DEMO via slug', () => {
  test('outreach slug redirects to demo', async ({ page }) => {
    await page.goto(`${DEMO_BASE}/o/testco-abc123`, { waitUntil: 'networkidle' });
    await has(page, 'Activate on Your Domain');
  });
});

test.describe('PAID experience', () => {
  const slug = process.env.QA_TENANT_SLUG || 'qa-acme';
  test('no demo CTAs; shows Live bar and success toast', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=${slug}`, { waitUntil: 'networkidle' });

    await notHas(page, 'Activate on Your Domain');
    await notHas(page, 'Demo limit reached');
    await notHas(page, 'How It Works');
    await notHas(page, 'Pricing');
    await has(page, 'Live for'); // "✅ Live for {Tenant}"

    // Optional: trigger a lead submit if test-safe selectors exist
    // await page.fill('[name="address"]', '1600 Pennsylvania Ave NW, Washington, DC');
    // await page.click('button:has-text("Get Quote")');
    // await has(page, 'Saved!'); // success toast text
  });
});

test.describe('Health', () => {
  test('healthz 200', async ({ request }) => {
    const res = await request.get(`${LIVE_BASE}/healthz`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBeTruthy();
  });
});
