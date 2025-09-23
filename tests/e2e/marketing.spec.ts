import { test, expect } from '@playwright/test';

test.describe('Branded Demo Funnel', () => {
  test('Home hero shows company branding + pricing line + metrics + CTA', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check hero content
    await expect(page.locator('h1')).toContainText('Your solar quote tool — already branded for Apple');
    await expect(page.locator('text=This is what your customers will see when they request a quote')).toBeVisible();
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    await expect(page.locator('text=77 installers · 12,384 quotes run · Avg quote 42s · 99.7% uptime')).toBeVisible();
    await expect(page.locator('text=Keep this branded demo')).toBeVisible();
  });

  test('Social proof renders with quotes and metrics', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check social proof quotes
    await expect(page.locator('text="Cut quoting time from 15 minutes to 1." — Ops Manager, Texas')).toBeVisible();
    await expect(page.locator('text="Branded quotes booked 4 extra consults in month one." — Owner, Arizona')).toBeVisible();
    await expect(page.locator('text=Keep my branded Sunspire →')).toBeVisible();
  });

  test('White-label section shows features and CTA', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Scroll to white-label section
    await page.locator('#whitelabel').scrollIntoViewIfNeeded();
    
    await expect(page.locator('text=Make it permanent')).toBeVisible();
    await expect(page.locator('text=This demo is already branded for Apple')).toBeVisible();
    await expect(page.locator('text=Branded PDFs & emails')).toBeVisible();
    await expect(page.locator('text=Your domain (CNAME)')).toBeVisible();
    await expect(page.locator('text=CRM integrations (HubSpot, Salesforce)')).toBeVisible();
    await expect(page.locator('text=Setup <24 hours')).toBeVisible();
    await expect(page.locator('text=SLA & support')).toBeVisible();
  });

  test('How it works section shows 3 steps', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=How it works')).toBeVisible();
    await expect(page.locator('text=Customer requests quote')).toBeVisible();
    await expect(page.locator('text=Instant branded report')).toBeVisible();
    await expect(page.locator('text=Consultation booked')).toBeVisible();
  });

  test('Report page has sticky sidebar with ownership and CTA', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check sticky sidebar
    await expect(page.locator('[data-testid="report-sidebar"]')).toBeVisible();
    await expect(page.locator('text=This demo is already branded for Apple')).toBeVisible();
    await expect(page.locator('[data-testid="report-cta"]')).toBeVisible();
    await expect(page.locator('text=See white-label features')).toBeVisible();
  });

  test('Pricing page shows exact price wording and CTA', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=White-Label Sunspire')).toBeVisible();
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    await expect(page.locator('text=Start setup — $399 today')).toBeVisible();
    await expect(page.locator('text=Branded reports & PDFs')).toBeVisible();
    await expect(page.locator('text=Your domain (CNAME)')).toBeVisible();
    await expect(page.locator('text=CRM integrations (HubSpot, Salesforce)')).toBeVisible();
    await expect(page.locator('text=Unlimited quotes')).toBeVisible();
    await expect(page.locator('text=SLA & support')).toBeVisible();
  });

  test('Signup page shows new H1/Subhead while keeping form', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/signup?company=Apple');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Start your Apple-branded Sunspire')).toBeVisible();
    await expect(page.locator('text=Make your demo permanent — no calls required')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('text=White-Label Sunspire - $99/mo + $399 setup')).toBeVisible();
  });

  test('Mobile: hero content visible without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check hero content is visible and not cut off
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    await expect(page.locator('text=Keep this branded demo')).toBeVisible();
    
    // Ensure no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin for scrollbars
  });
});
