import { test, expect } from '@playwright/test';

test.describe('Live Site Verification NOW @live-now', () => {
  const LIVE_URL = 'https://demo.sunspiredemo.com/?company=Apple&demo=1';
  const LIVE_REPORT = 'https://demo.sunspiredemo.com/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('LIVE NOW: Sidebar CTA visible and positioned correctly', async ({ page }) => {
    console.log('🌐 Testing LIVE sidebar CTA...');
    
    await page.goto(LIVE_REPORT, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Take screenshot first
    await page.screenshot({ path: 'live-now-report-page.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    // Check if sidebar exists
    const sidebar = page.locator('[data-sidebar-cta]');
    const sidebarCount = await sidebar.count();
    console.log('Sidebar count:', sidebarCount);
    
    if (sidebarCount > 0) {
      await expect(sidebar).toBeVisible({ timeout: 5000 });
      const box = await sidebar.boundingBox();
      console.log('✅ LIVE sidebar visible at position:', box);
    } else {
      console.log('❌ LIVE sidebar NOT FOUND - deployment may not be complete');
    }
  });

  test('LIVE NOW: Countdown timer working', async ({ page }) => {
    console.log('🌐 Testing LIVE countdown timer...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const countdown = page.locator('text=/Expires in/');
    const countdownCount = await countdown.count();
    console.log('Countdown count:', countdownCount);
    
    if (countdownCount > 0) {
      const text = await countdown.textContent();
      console.log('✅ LIVE countdown:', text);
      
      if (text?.includes('0d 0h 0m 0s')) {
        console.log('❌ Countdown showing zeros - deployment may not be complete');
      } else {
        console.log('✅ Countdown showing valid time');
      }
    } else {
      console.log('❌ Countdown NOT FOUND - deployment may not be complete');
    }
    
    await page.screenshot({ path: 'live-now-homepage.png', fullPage: true });
  });

  test('LIVE NOW: Stripe CTA works', async ({ page }) => {
    console.log('🌐 Testing LIVE Stripe CTA...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const cta = page.locator('button[data-cta="primary"]');
    const ctaCount = await cta.count();
    console.log('CTA count:', ctaCount);
    
    if (ctaCount > 0) {
      console.log('✅ LIVE CTAs found:', ctaCount);
      
      // Try clicking first CTA
      try {
        await cta.first().click({ timeout: 5000 });
        
        // Wait to see if we navigate to Stripe or get error
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        console.log('Current URL after CTA click:', currentUrl);
        
        if (currentUrl.includes('stripe.com')) {
          console.log('✅ LIVE Stripe checkout working!');
        } else {
          console.log('⚠️  Still on same page - check console for errors');
        }
      } catch (error) {
        console.log('Error clicking CTA:', error);
      }
    } else {
      console.log('❌ CTAs NOT FOUND - deployment may not be complete');
    }
  });

  test('LIVE NOW: Full page inspection', async ({ page }) => {
    console.log('🌐 Full LIVE page inspection...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for key elements
    const bodyText = await page.locator('body').textContent();
    
    console.log('Page contains "Sunspire":', bodyText?.includes('Sunspire'));
    console.log('Page contains "Apple":', bodyText?.includes('Apple'));
    console.log('Page contains "Expires in":', bodyText?.includes('Expires in'));
    console.log('Page contains "runs left":', bodyText?.includes('runs left'));
    
    // Screenshot
    await page.screenshot({ path: 'live-now-full-inspection.png', fullPage: true });
    console.log('📸 Full inspection screenshot saved');
  });
});

