import { test, expect } from '@playwright/test';

const LIVE_URL = process.env.LIVE_URL;
const BASE_URL = LIVE_URL || 'http://localhost:3000';

const DEMO_HOME_URL = `${BASE_URL}/?company=Acme&logo=/logos/acme.svg&demo=1`;
const DEMO_REPORT_URL = `${BASE_URL}/report?company=Acme&logo=/logos/acme.svg&demo=1`;

test.describe('Trust Signals Tests', () => {
  test('LogoWall has at least 2 logos', async ({ page }) => {
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Wait for LogoWall to load
    await page.waitForSelector('[data-testid="logo-wall"]', { timeout: 10000 });
    
    // Check that we have at least 2 logo elements
    const logoElements = await page.locator('[data-testid="logo-item"]').count();
    expect(logoElements).toBeGreaterThanOrEqual(2);
  });

  test('Testimonial shows quote and company name', async ({ page }) => {
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Check for testimonial quote
    await expect(page.locator('text="Sunspire made it simple"')).toBeVisible();
    
    // Check for company name
    await expect(page.locator('text="Acme Solar"')).toBeVisible();
    
    // Check for metric
    await expect(page.locator('text="31% increase"')).toBeVisible();
  });

  test('MetricsBar shows all 3 stats', async ({ page }) => {
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Check for all three metrics
    await expect(page.locator('text="47"')).toBeVisible(); // Installers live
    await expect(page.locator('text="12,384"')).toBeVisible(); // Quotes generated
    await expect(page.locator('text="31%"')).toBeVisible(); // Average increase
  });

  test('Footer contains support email and guarantee text', async ({ page }) => {
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Check for support email
    await expect(page.locator('a[href="mailto:support@sunspire.app"]')).toBeVisible();
    
    // Check for guarantee text
    await expect(page.locator('text="30-day money-back guarantee"')).toBeVisible();
    
    // Check for Stripe mention
    await expect(page.locator('text="Secure payments via Stripe"')).toBeVisible();
  });

  test('AboutBlock shows heading and body', async ({ page }) => {
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Check for about heading
    await expect(page.locator('text="Why We Built Sunspire"')).toBeVisible();
    
    // Check for about body text
    await expect(page.locator('text="We started Sunspire to give solar companies"')).toBeVisible();
  });

  test('Report page has all trust signals', async ({ page }) => {
    await page.goto(DEMO_REPORT_URL, { waitUntil: 'networkidle' });
    
    // Check for LogoWall
    await expect(page.locator('[data-testid="logo-wall"]')).toBeVisible();
    
    // Check for Testimonial
    await expect(page.locator('[data-testid="hero-testimonial"]')).toBeVisible();
    await expect(page.locator('text="Acme Solar"')).toBeVisible();
    
    // Check for MetricsBar
    await expect(page.locator('[data-testid="metrics-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-item"]')).toHaveCount(3);
    
    // Check for AboutBlock
    await expect(page.locator('[data-testid="about-block"]')).toBeVisible();
    
    // Check for TrustFooterLine
    await expect(page.locator('[data-testid="trust-footer-line"]')).toBeVisible();
    await expect(page.locator('text="support@sunspire.app"')).toBeVisible();
  });

  test('Desktop viewport (1280x800)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Take screenshot
    await page.screenshot({ path: 'trust-desktop.png', fullPage: true });
    
    // Basic checks
    await expect(page.locator('[data-testid="logo-wall"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-testimonial"]')).toBeVisible();
  });

  test('Mobile viewport (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(DEMO_HOME_URL, { waitUntil: 'networkidle' });
    
    // Take screenshot
    await page.screenshot({ path: 'trust-mobile.png', fullPage: true });
    
    // Basic checks
    await expect(page.locator('[data-testid="logo-wall"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-testimonial"]')).toBeVisible();
  });
});