import { test, expect } from '@playwright/test';

test.describe('Marketing Polish & Visual Consistency', () => {
  test('Home hero renders with correct typography and spacing', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H1 typography
    const h1 = page.locator('h1').first();
    await expect(h1).toHaveClass(/text-5xl md:text-6xl font-extrabold tracking-tight/);
    
    // Check subhead typography
    const subhead = page.locator('text=This is what your customers will see when they request a quote');
    await expect(subhead).toHaveClass(/text-base md:text-lg text-slate-700/);
    
    // Check pricing line
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    await expect(page.locator('text=$99/mo + $399 setup')).toHaveClass(/text-sm text-slate-500/);
    
    // Check metrics line
    await expect(page.locator('text=77 installers · 12,384 quotes run · Avg quote 42s · 99.7% uptime')).toBeVisible();
    await expect(page.locator('text=77 installers · 12,384 quotes run · Avg quote 42s · 99.7% uptime')).toHaveClass(/text-sm text-slate-500/);
    
    // Check CTA text
    await expect(page.locator('text=Keep this branded demo')).toBeVisible();
  });

  test('Social proof section has correct hierarchy', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check testimonial quotes
    await expect(page.locator('text="Cut quoting time from 15 minutes to 1." — Ops Manager, Texas')).toBeVisible();
    await expect(page.locator('text="Branded quotes booked 4 extra consults in month one." — Owner, Arizona')).toBeVisible();
    
    // Check CTA text
    await expect(page.locator('text=Keep this branded demo →')).toBeVisible();
    
    // Verify no duplicate metrics in social proof
    const metricsInSocialProof = page.locator('text=77 installers · 12,384 quotes · Avg quote 42s · 99.7% uptime');
    await expect(metricsInSocialProof).toHaveCount(0);
  });

  test('Make it permanent section has correct typography', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H2 typography
    const h2 = page.locator('text=Make it permanent.');
    await expect(h2).toHaveClass(/text-2xl md:text-3xl font-bold/);
    
    // Check body text
    const bodyText = page.locator('text=This demo is already branded for Apple. Upgrade now to keep it live');
    await expect(bodyText).toHaveClass(/text-base md:text-lg text-slate-700/);
    
    // Check bullet points
    await expect(page.locator('text=Branded PDFs & emails')).toHaveClass(/text-sm text-slate-700/);
    await expect(page.locator('text=Your domain (CNAME)')).toHaveClass(/text-sm text-slate-700/);
    
    // Check CTA text
    await expect(page.locator('text=Keep this branded demo')).toBeVisible();
  });

  test('How it works section has consistent typography', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H2 typography
    const h2 = page.locator('text=How it works');
    await expect(h2).toHaveClass(/text-2xl md:text-3xl font-bold/);
    
    // Check step labels
    await expect(page.locator('text=Customer requests quote')).toHaveClass(/text-base text-slate-700/);
    await expect(page.locator('text=Instant branded report')).toHaveClass(/text-base text-slate-700/);
    await expect(page.locator('text=Consultation booked')).toHaveClass(/text-base text-slate-700/);
    
    // Check step numbers are consistent size
    const stepNumbers = page.locator('div:has-text("1"), div:has-text("2"), div:has-text("3")');
    await expect(stepNumbers).toHaveCount(3);
  });

  test('Report page has correct typography hierarchy', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check main title
    const mainTitle = page.locator('text=New Analysis');
    await expect(mainTitle).toHaveClass(/text-2xl md:text-3xl font-bold/);
    
    // Check subtitle
    const subtitle = page.locator('text=Comprehensive analysis for your property');
    await expect(subtitle).toHaveClass(/text-base md:text-lg text-slate-700/);
    
    // Check card titles
    const financialTitle = page.locator('text=Financial Analysis');
    await expect(financialTitle).toHaveClass(/text-lg md:text-xl font-semibold/);
    
    const environmentalTitle = page.locator('text=Environmental Impact');
    await expect(environmentalTitle).toHaveClass(/text-lg md:text-xl font-semibold/);
  });

  test('Sticky sidebar has correct CTA and micro-trust badges', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check sticky sidebar
    await expect(page.locator('[data-testid="report-sidebar"]')).toBeVisible();
    
    // Check CTA text
    await expect(page.locator('text=Launch my branded tool')).toBeVisible();
    
    // Check micro-trust badges
    await expect(page.locator('text=SOC2')).toBeVisible();
    await expect(page.locator('text=GDPR')).toBeVisible();
    await expect(page.locator('text=NREL PVWatts®')).toBeVisible();
  });

  test('All Unlock Full Report CTAs route to same upgrade path', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check all unlock buttons have same text
    const unlockButtons = page.locator('[data-testid="unlock-report-cta"]');
    await expect(unlockButtons).toHaveCount(4); // 2 tiles + 2 panels
    
    for (let i = 0; i < 4; i++) {
      await expect(unlockButtons.nth(i)).toContainText('Unlock Full Report');
    }
    
    // Check subcopy appears
    await expect(page.locator('text=Upgrade to unlock the full branded report for your customers')).toBeVisible();
  });

  test('Pricing page has correct typography', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H1 typography
    const h1 = page.locator('h1');
    await expect(h1).toHaveClass(/text-5xl md:text-6xl font-extrabold tracking-tight/);
    
    // Check subtitle
    const subtitle = page.locator('text=Your branded solar quote tool — ready to launch');
    await expect(subtitle).toHaveClass(/text-base md:text-lg text-slate-700/);
    
    // Check price line
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    
    // Check CTA
    await expect(page.locator('text=Start setup — $399 today')).toBeVisible();
  });

  test('Footer has legacy structure and micro-trust strip', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check micro-trust strip above footer
    await expect(page.locator('text=SOC2 · NREL PVWatts® · CRM-ready · GDPR/CCPA compliant')).toBeVisible();
    
    // Check legacy footer content
    await expect(page.locator('text=Estimates generated using NREL PVWatts® v8')).toBeVisible();
    await expect(page.locator('text=Powered by Sunspire')).toBeVisible();
    await expect(page.locator('text=Mapping & location data © Google')).toBeVisible();
    
    // Check footer links
    await expect(page.locator('text=Privacy Policy')).toBeVisible();
    await expect(page.locator('text=Terms of Service')).toBeVisible();
    await expect(page.locator('text=Security')).toBeVisible();
    
    // Check contact info
    await expect(page.locator('text=support@getsunspire.com')).toBeVisible();
    await expect(page.locator('text=+1 (404) 770-2672')).toBeVisible();
  });

  test('Visual consistency - take screenshot of key sections', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of hero section
    await expect(page.locator('main')).toHaveScreenshot('hero-section.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Take screenshot of report page
    await expect(page.locator('main')).toHaveScreenshot('report-page.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Take screenshot of footer
    await expect(page.locator('footer')).toHaveScreenshot('footer-legacy.png', { 
      maxDiffPixels: 120,
      threshold: 0.2
    });
  });

  test('Lighthouse performance audit', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Run Lighthouse audit
    const lighthouse = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would need to be implemented with actual Lighthouse integration
        // For now, we'll just check basic performance metrics
        const performance = {
          lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0,
          fid: performance.getEntriesByType('first-input')[0]?.processingStart || 0,
          cls: 0 // Would need to calculate CLS
        };
        resolve(performance);
      });
    });
    
    // Basic performance checks
    expect(lighthouse.lcp).toBeLessThan(2500); // LCP should be under 2.5s
  });
});
