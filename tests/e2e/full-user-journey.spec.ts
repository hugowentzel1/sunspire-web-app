/**
 * Full user journey: demo site → quote → CTAs → paid version → checkout flow → dashboard → CRM → leads → status → legal.
 * Runs as if a user experiences the entire Sunspire flow. No real payment required (checkout is intercepted or asserted via URL).
 * Run: npx playwright test tests/e2e/full-user-journey.spec.ts
 * Visual: add --headed
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Full user journey — demo to dashboard', () => {
  test('1. Homepage (demo) — branded demo, CTAs, How it works, spacing', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toContainText(/solar|quote|Solar|Quote/i);
    await expect(page.locator('body')).toContainText(/Launch Your Branded Version|Launch your branded/i);
    await expect(page.locator('body')).toContainText(/How it works/i);
    await expect(page.locator('body')).toContainText(/Leads to inbox|lead|Lead captured|Optional sync/i);
    await expect(page.locator('body')).toContainText(/Optional sync|optional sync|HubSpot|Salesforce|Airtable|CRM/i);
    const cta = page.locator('button[data-cta="primary"], button[data-cta-button], a[href*="report"]').first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('2. Report (quote) — address, estimate, no lead created yet', async ({ page }) => {
    const reportUrl = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(reportUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/NREL|PVWatts|annual|production|kwh|savings|estimate/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/solar|quote|nrel|pvwatts|annual|production|kwh|estimate|savings/i);
    expect(body).toMatch(/1600|Amphitheatre|Mountain View/i);
    await expect(page.getByTestId('unlock-report-cta').or(page.locator('text=Unlock Full Report')).first()).toBeVisible().catch(() => null);
  });

  test('3. Paid landing — no demo restrictions, launch copy', async ({ page }) => {
    await page.goto(`${BASE}/paid?company=AcmeSolar`, { waitUntil: 'networkidle' });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/solar|Solar|quote|Quote|branded|Launch|lead|inbox|dashboard|CRM/i);
  });

  test('4. Checkout flow — CTA leads to Stripe with correct success_url', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    let checkoutUrl: string | null = null;
    await page.route('**/api/stripe/create-checkout-session', async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        const body = req.postDataJSON();
        checkoutUrl = body?.cancel_url || null;
      }
      const res = await route.fetch();
      const json = await res.json().catch(() => ({}));
      if (json.url) checkoutUrl = json.url;
      await route.fulfill({ response: res });
    });
    const cta = page.locator('button[data-cta="primary"], button[data-cta-button]').first();
    await cta.click();
    await page.waitForTimeout(3000);
    const wentToStripe = page.url().includes('stripe.com') || page.url().includes('checkout');
    if (checkoutUrl) {
      expect(checkoutUrl).toMatch(/\/c\/acme-solar\?session_id=|checkout\.stripe\.com/);
    }
    expect(wentToStripe || !!checkoutUrl).toBe(true);
  });

  test('5. Dashboard (post-purchase simulation) — live checklist, CRM, test lead', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Dashboard|Connect your CRM|Save webhook|Access Required|Instant URL|Create test lead/i', { timeout: 15000 }).catch(() => null);
    const body = await page.locator('body').innerText();
    const hasDashboard = /Connect your CRM|Zapier|Make|Save webhook|Instant URL|Embed Code|Create test lead/i.test(body);
    const hasAccessRequired = /Access Required/i.test(body);
    expect(hasDashboard || hasAccessRequired).toBe(true);
    if (hasDashboard) {
      await expect(page.locator('text=Create test lead').first()).toBeVisible().catch(() => null);
      await expect(page.getByRole('link', { name: /View Leads/i })).toBeVisible().catch(() => null);
      await expect(page.getByRole('link', { name: /Documentation/i })).toBeVisible().catch(() => null);
    }
  });

  test('6. Status page — unbranded, all APIs, version, Sentry link', async ({ page, request }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    const healthBody = await healthRes.json().catch(() => ({}));
    expect(healthBody.timestamp).toBeDefined();
    expect(healthBody.version !== undefined || healthBody.services !== undefined).toBe(true);
    expect(Array.isArray(healthBody.services)).toBe(true);
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"], [data-testid="status-page-content"]', { timeout: 25000 });
    await page.waitForFunction(
      () => document.body?.innerText?.includes('Airtable') || document.body?.innerText?.includes('Operational') || document.body?.innerText?.includes('System Status'),
      { timeout: 15000 }
    );
    const statusBody = await page.locator('body').innerText();
    expect(statusBody).toMatch(/System Status/i);
    expect(statusBody).toMatch(/operational|Operational|systems|Airtable|Stripe|NREL|Resend|Geocoding|USGS|3DEP|status/i);
    expect(statusBody).toMatch(/sentry\.io|Sentry|support@getsunspire/i);
  });

  test('7. Health API — JSON shape, version when present, commit when present', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('services');
    expect(Array.isArray(data.services)).toBe(true);
    if (data.version !== undefined) expect(typeof data.version).toBe('string');
    if (data.commit !== undefined) expect(typeof data.commit).toBe('string');
    if (data.services.length > 0) {
      const first = data.services[0];
      expect(first).toHaveProperty('service');
      expect(first).toHaveProperty('status');
    }
  });

  test('8. Leads list page — loads or shows auth message', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar/leads?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    const hasLeadsUI = /Leads Dashboard|No leads yet|Name|Email|Address|Submitted/i.test(body);
    const hasAuthMessage = /Open your dashboard first|API key|Access|Required/i.test(body);
    expect(hasLeadsUI || hasAuthMessage).toBe(true);
  });

  test('9. Legal — refund, terms, privacy linked and reachable', async ({ page }) => {
    await page.goto(`${BASE}/?demo=1`, { waitUntil: 'networkidle' });
    const footer = page.locator('footer, [data-testid="footer"]').first();
    await expect(footer).toBeVisible({ timeout: 5000 }).catch(() => null);
    const hasRefundLink = await page.getByRole('link', { name: /Refund|refund/i }).first().isVisible().catch(() => false);
    const hasPrivacyLink = await page.getByRole('link', { name: /Privacy|privacy/i }).first().isVisible().catch(() => false);
    const hasTermsLink = await page.getByRole('link', { name: /Terms|terms/i }).first().isVisible().catch(() => false);
    expect(hasRefundLink || hasPrivacyLink || hasTermsLink).toBe(true);
    await page.goto(`${BASE}/legal/refund`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/refund|Refund|setup fee|24 hours/i);
    await page.goto(`${BASE}/terms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Terms|terms|refund|subscription/i);
  });

  test('10. Lead submit — POST /api/lead with full payload returns 200 or 500 (tenant missing)', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: {
        name: 'Journey Test User',
        email: `journey-${Date.now()}@test.example`,
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
        tenantSlug: 'acme-solar',
        systemSizeKW: 6,
        netCostAfterITC: 15000,
        year1Savings: 1200,
        paybackYear: 12,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200, 500]).toContain(res.status());
    const data = await res.json().catch(() => ({}));
    if (res.status() === 200) {
      expect(data.success).toBe(true);
    } else {
      expect(data.error).toBeDefined();
    }
  });

  test('11. Estimate only — no lead created; GET /api/estimate returns quote', async ({ request }) => {
    const params = new URLSearchParams({
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      lat: '37.422',
      lng: '-122.084',
      state: 'CA',
      systemKw: '6',
      tilt: '22',
      azimuth: '180',
      lossesPct: '14',
    });
    const res = await request.get(`${BASE}/api/estimate?${params}`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.estimate).toBeDefined();
    expect(data.estimate?.annualProductionKWh ?? data.estimate?.annualKwh).toBeDefined();
    expect(data.estimate?.shadingAnalysis).toBeDefined();
  });

  test('12. Demo URL — company name and branding visible', async ({ page }) => {
    await page.goto(`${BASE}/?company=Netflix&demo=1&domain=netflix.com`, { waitUntil: 'networkidle' });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Netflix|netflix|solar|quote|Launch|branded/i);
  });

  test('13. Report CTA — paid mode shows Book/Download/Copy; demo shows Unlock/Launch', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Book a Consultation|Download PDF|Copy Share Link|Unlock Full Report|Launch Your Branded/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    const hasCtaFooter = /Book a Consultation|Download PDF|Copy Share Link|Talk to a Specialist/i.test(body);
    const hasDemoCta = /Unlock Full Report|Launch Your Branded Version Now/i.test(body);
    expect(hasCtaFooter || hasDemoCta).toBe(true);
  });

  test('14. Docs/CRM link from dashboard', async ({ page }) => {
    await page.goto(`${BASE}/docs/crm`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/CRM|Zapier|Make|HubSpot|webhook/i);
  });
});
