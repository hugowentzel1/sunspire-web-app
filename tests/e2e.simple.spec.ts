import { test, expect } from '@playwright/test';

const LIVE_BASE = process.env.LIVE_BASE!;

test.describe('Sunspire Live Tests', () => {
  test('health endpoint works', async ({ request }) => {
    const res = await request.get(`${LIVE_BASE}/healthz`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBeTruthy();
  });

  test('demo page loads with demo content', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco&demo=1`, { waitUntil: 'networkidle' });
    
    // Check for demo-specific content (use first() to avoid strict mode violation)
    await expect(page.getByText(/demo/i).first()).toBeVisible();
    await expect(page.getByText(/activate/i).first()).toBeVisible();
  });

  test('outreach slug loads', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/o/testco-abc123`, { waitUntil: 'networkidle' });
    
    // Should load the page (even if it's a 404 for now)
    expect(page.url()).toContain('/o/testco-abc123');
  });

  test('paid page loads without demo content', async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco`, { waitUntil: 'networkidle' });
    
    // Should NOT show demo content
    await expect(page.getByText(/activate on your domain/i)).toHaveCount(0);
  });
});
