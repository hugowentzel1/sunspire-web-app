import { test, expect } from '@playwright/test';

test.describe('Final Demo-to-Lease Funnel', () => {
  test('Home page hero hierarchy and single CTA', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H1 is one text block
    const h1 = page.locator('h1').first();
    await expect(h1).toHaveText(/Your solar quote tool — already branded for Apple\./);
    await expect(h1).toHaveClass(/text-5xl md:text-6xl font-extrabold tracking-tight/);
    
    // Check subhead
    const subhead = page.locator('text=This is what your customers will see when they request a quote');
    await expect(subhead).toHaveClass(/text-lg text-slate-600/);
    
    // Check pricing line
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    await expect(page.locator('text=$99/mo + $399 setup')).toHaveClass(/text-sm text-slate-500/);
    
    // Check metrics line
    await expect(page.locator('text=77 installers · 12,384 quotes run · Avg quote 42s · 99.7% uptime')).toBeVisible();
    
    // Check single primary CTA
    const primaryCTA = page.locator('text=Keep this branded demo');
    await expect(primaryCTA).toHaveCount(1);
  });

  test('Social proof placed at friction point below address card', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check address card is visible
    await expect(page.locator('text=Enter Your Property Address')).toBeVisible();
    
    // Check social proof is directly below address card
    const addressCard = page.locator('.bg-white\\/80.backdrop-blur-xl.rounded-3xl');
    const socialProof = page.locator('text="Cut quoting time from 15 minutes to 1."');
    
    // Verify social proof comes after address card
    const addressCardBox = await addressCard.boundingBox();
    const socialProofBox = await socialProof.boundingBox();
    
    expect(socialProofBox?.y).toBeGreaterThan((addressCardBox?.y || 0) + (addressCardBox?.height || 0));
    
    // Check two outcome quotes
    await expect(page.locator('text="Cut quoting time from 15 minutes to 1." — Ops Manager, Texas')).toBeVisible();
    await expect(page.locator('text="Branded quotes booked 4 extra consults in month one." — Owner, Arizona')).toBeVisible();
    
    // Check metrics line in social proof
    await expect(page.locator('text=77 installers · 12,384 quotes · Avg quote 42s · 99.7% uptime')).toBeVisible();
    
    // Check mini CTA
    await expect(page.locator('text=Keep this branded demo →')).toBeVisible();
  });

  test('Single row of 4 trust badges with methodology link', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check trust badges are in single row
    const trustRow = page.locator('.grid.grid-cols-2.md\\:grid-cols-4.gap-4');
    await expect(trustRow).toBeVisible();
    
    // Check 4 badges
    await expect(page.locator('text=NREL v8')).toBeVisible();
    await expect(page.locator('text=SOC 2')).toBeVisible();
    await expect(page.locator('text=CRM Ready')).toBeVisible();
    await expect(page.locator('text=24/7')).toBeVisible();
    
    // Check methodology link
    await expect(page.locator('text=View methodology')).toBeVisible();
    await expect(page.locator('a[href="/methodology"]')).toBeVisible();
  });

  test('Make it permanent section - single instance only', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check only one "Make it permanent" section
    const makeItPermanent = page.locator('text=Make it permanent.');
    await expect(makeItPermanent).toHaveCount(1);
    
    // Check H2 typography
    await expect(makeItPermanent).toHaveClass(/text-2xl md:text-3xl font-bold/);
    
    // Check bullets (max 5)
    const bullets = page.locator('.flex.items-center.space-x-3');
    await expect(bullets).toHaveCount(5);
    
    // Check specific bullet points
    await expect(page.locator('text=Branded PDFs & emails')).toBeVisible();
    await expect(page.locator('text=Your domain (CNAME)')).toBeVisible();
    await expect(page.locator('text=CRM integrations (HubSpot, Salesforce)')).toBeVisible();
    await expect(page.locator('text=Setup <24 hours')).toBeVisible();
    await expect(page.locator('text=SLA & support')).toBeVisible();
    
    // Check single CTA
    await expect(page.locator('text=Keep this branded demo')).toHaveCount(1);
  });

  test('How it works - 3 steps on single row', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H2
    const h2 = page.locator('text=How it works');
    await expect(h2).toHaveClass(/text-2xl md:text-3xl font-bold/);
    
    // Check 3 steps
    await expect(page.locator('text=Customer requests quote')).toBeVisible();
    await expect(page.locator('text=Instant branded report')).toBeVisible();
    await expect(page.locator('text=Consultation booked')).toBeVisible();
    
    // Check step numbers
    await expect(page.locator('text=1')).toBeVisible();
    await expect(page.locator('text=2')).toBeVisible();
    await expect(page.locator('text=3')).toBeVisible();
  });

  test('Report page sticky sidebar - desktop and mobile', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Check sticky sidebar
    await expect(page.locator('[data-testid="report-sidebar"]')).toBeVisible();
    
    // Check ownership line
    await expect(page.locator('text=This demo is already branded for Apple. Upgrade now to keep it live.')).toBeVisible();
    
    // Check metrics line
    await expect(page.locator('text=77 installers · 12,384 quotes · Avg quote 42s · 99.7% uptime')).toBeVisible();
    
    // Check primary CTA
    await expect(page.locator('text=Keep my branded Sunspire')).toBeVisible();
    
    // Check secondary link
    await expect(page.locator('text=See white-label features')).toBeVisible();
    
    // Check micro-trust badges
    await expect(page.locator('text=SOC2')).toBeVisible();
    await expect(page.locator('text=GDPR')).toBeVisible();
    await expect(page.locator('text=NREL PVWatts®')).toBeVisible();
  });

  test('Pricing page - single plan only', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check H1 typography
    const h1 = page.locator('h1');
    await expect(h1).toHaveClass(/text-5xl md:text-6xl font-extrabold tracking-tight/);
    
    // Check single plan card
    await expect(page.locator('text=White-Label Sunspire')).toBeVisible();
    
    // Check exact price
    await expect(page.locator('text=$99/mo + $399 setup')).toBeVisible();
    
    // Check inclusions
    await expect(page.locator('text=Branded reports & PDFs')).toBeVisible();
    await expect(page.locator('text=Your domain (CNAME)')).toBeVisible();
    await expect(page.locator('text=CRM integrations (HubSpot, Salesforce)')).toBeVisible();
    await expect(page.locator('text=Unlimited quotes')).toBeVisible();
    await expect(page.locator('text=SLA & support')).toBeVisible();
    
    // Check CTA
    await expect(page.locator('text=Start setup — $399 today')).toBeVisible();
    
    // Check only one plan card
    const planCards = page.locator('.bg-white\\/80.backdrop-blur-sm.rounded-3xl');
    await expect(planCards).toHaveCount(1);
  });

  test('Footer - restored legacy structure with proper left column', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check micro-trust strip above footer
    await expect(page.locator('text=SOC2 · NREL PVWatts® · CRM-ready · GDPR/CCPA compliant')).toBeVisible();
    
    // Check left column content
    await expect(page.locator('text=Estimates generated using NREL PVWatts® v8')).toBeVisible();
    await expect(page.locator('text=Powered by Sunspire')).toBeVisible();
    await expect(page.locator('text=Mapping & location data © Google')).toBeVisible();
    
    // Check middle column
    await expect(page.locator('text=Privacy Policy')).toBeVisible();
    await expect(page.locator('text=Terms of Service')).toBeVisible();
    await expect(page.locator('text=Security')).toBeVisible();
    await expect(page.locator('text=DPA')).toBeVisible();
    await expect(page.locator('text=Do Not Sell My Data')).toBeVisible();
    
    // Check right column
    await expect(page.locator('text=support@getsunspire.com')).toBeVisible();
    await expect(page.locator('text=+1 (404) 770-2672')).toBeVisible();
  });

  test('Visual consistency - take screenshots at different breakpoints', async ({ page }) => {
    // Test at 390px (mobile)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('main')).toHaveScreenshot('home-mobile-390px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Test at 768px (tablet)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('main')).toHaveScreenshot('home-tablet-768px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Test at 1280px (desktop)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('main')).toHaveScreenshot('home-desktop-1280px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });

  test('Report page visual consistency', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Enter address to generate report
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    // Test at 390px (mobile)
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('main')).toHaveScreenshot('report-mobile-390px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Test at 1280px (desktop)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.fill('input[placeholder*="address"]', '123 Main St, Austin, TX');
    await page.click('text=Keep this branded demo');
    await page.waitForURL('**/report**');
    
    await expect(page.locator('main')).toHaveScreenshot('report-desktop-1280px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });

  test('Pricing page visual consistency', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test at 390px (mobile)
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('main')).toHaveScreenshot('pricing-mobile-390px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
    
    // Test at 1280px (desktop)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('main')).toHaveScreenshot('pricing-desktop-1280px.png', { 
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });

  test('No duplicate sections or blocks', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check only one "Make it permanent" section
    const makeItPermanent = page.locator('text=Make it permanent.');
    await expect(makeItPermanent).toHaveCount(1);
    
    // Check only one primary CTA
    const primaryCTA = page.locator('text=Keep this branded demo');
    await expect(primaryCTA).toHaveCount(1);
    
    // Check only one trust row
    const trustRow = page.locator('.grid.grid-cols-2.md\\:grid-cols-4.gap-4');
    await expect(trustRow).toHaveCount(1);
    
    // Check no duplicate metrics lines
    const metricsLines = page.locator('text=77 installers · 12,384 quotes run · Avg quote 42s · 99.7% uptime');
    await expect(metricsLines).toHaveCount(1);
  });

  test('Performance - Lighthouse audit', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Basic performance checks
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0
      };
    });
    
    // Performance assertions
    expect(performance.loadTime).toBeLessThan(3000); // Load time under 3s
    expect(performance.domContentLoaded).toBeLessThan(1500); // DOM ready under 1.5s
    expect(performance.lcp).toBeLessThan(2500); // LCP under 2.5s
  });
});
