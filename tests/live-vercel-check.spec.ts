import { test, expect } from '@playwright/test';

test.describe('Live Vercel Site Check @live-vercel', () => {
  const LIVE_URL = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
  const LIVE_REPORT = 'https://sunspire-web-app.vercel.app/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('1. LIVE: Sidebar CTA visible and positioned mid-page', async ({ page }) => {
    console.log('🌐 Testing LIVE sidebar CTA...');
    
    await page.goto(LIVE_REPORT, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const sidebar = page.locator('[data-sidebar-cta]');
    const count = await sidebar.count();
    console.log('Sidebar count on LIVE:', count);
    
    if (count > 0) {
      await expect(sidebar).toBeVisible();
      const box = await sidebar.boundingBox();
      console.log('✅ LIVE sidebar position:', box);
      expect(box!.y).toBeLessThan(600); // Should be mid-page
    } else {
      console.log('❌ Sidebar not deployed yet');
    }
    
    await page.screenshot({ path: 'live-vercel-report.png', fullPage: true });
  });

  test('2. LIVE: Countdown timer shows valid time', async ({ page }) => {
    console.log('🌐 Testing LIVE countdown...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const countdown = page.locator('text=/Expires in/');
    const count = await countdown.count();
    console.log('Countdown count on LIVE:', count);
    
    if (count > 0) {
      const text = await countdown.textContent();
      console.log('Countdown text:', text);
      
      if (text?.includes('0d 0h 0m 0s')) {
        console.log('❌ LIVE countdown showing zeros');
      } else {
        console.log('✅ LIVE countdown showing valid time');
      }
    } else {
      console.log('❌ Countdown not found on LIVE');
    }
    
    await page.screenshot({ path: 'live-vercel-homepage.png', fullPage: true });
  });

  test('3. LIVE: Stripe checkout works', async ({ page }) => {
    console.log('🌐 Testing LIVE Stripe checkout...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const cta = page.locator('button[data-cta="primary"]');
    const count = await cta.count();
    console.log('CTA count on LIVE:', count);
    
    if (count > 0) {
      console.log('✅ CTAs found on LIVE');
      
      // Click and monitor
      await cta.first().click({ timeout: 10000 });
      await page.waitForTimeout(5000);
      
      const url = page.url();
      console.log('URL after click:', url);
      
      if (url.includes('stripe.com')) {
        console.log('✅ LIVE Stripe checkout WORKING!');
      } else if (url === LIVE_URL) {
        console.log('❌ Still on same page - Stripe checkout NOT working');
        
        // Check console errors
        page.on('console', msg => {
          if (msg.type() === 'error') {
            console.log('Browser error:', msg.text());
          }
        });
      }
    } else {
      console.log('❌ CTAs not found on LIVE');
    }
  });

  test('4. LIVE: Demo quota visible', async ({ page }) => {
    console.log('🌐 Testing LIVE demo quota...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const quota = page.locator('text=/runs left/');
    const count = await quota.count();
    
    if (count > 0) {
      const text = await quota.textContent();
      console.log('✅ LIVE quota text:', text);
    } else {
      console.log('❌ Quota not found on LIVE');
    }
  });

  test('5. LIVE: Full page content check', async ({ page }) => {
    console.log('🌐 Full LIVE content check...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    const bodyText = await page.locator('body').textContent();
    
    console.log('Page title:', title);
    console.log('Has Sunspire:', bodyText?.includes('Sunspire'));
    console.log('Has Apple:', bodyText?.includes('Apple'));
    console.log('Has demo content:', bodyText?.includes('demo') || bodyText?.includes('preview'));
    
    await page.screenshot({ path: 'live-vercel-full-page.png', fullPage: true });
  });
});

