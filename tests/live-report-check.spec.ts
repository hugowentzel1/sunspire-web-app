import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Live Report Page Check @live-report', () => {
  test('Verify report page features on live site', async ({ page }) => {
    console.log('🌐 Testing LIVE report page...');
    
    // Go to report page with demo params
    await page.goto(`${LIVE_URL}/report?company=Apple&demo=1&address=1%20Apple%20Park%20Way&lat=37.3349&lng=-122.0090&placeId=test`, {
      waitUntil: 'networkidle',
    });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check sidebar CTA
    const sidebar = page.locator('[data-sidebar-cta]');
    const sidebarCount = await sidebar.count();
    console.log('Sidebar count:', sidebarCount);
    
    if (sidebarCount > 0) {
      console.log('✅ Sidebar CTA found on LIVE report page');
      const box = await sidebar.boundingBox();
      console.log('Sidebar position:', box);
    } else {
      console.log('❌ Sidebar CTA not found on LIVE report page');
    }
    
    // Check countdown timer
    const countdown = page.locator('[data-countdown]');
    const countdownCount = await countdown.count();
    console.log('Countdown count:', countdownCount);
    
    if (countdownCount > 0) {
      const text = await countdown.textContent();
      console.log('✅ Countdown text:', text);
    } else {
      console.log('❌ Countdown not found on LIVE report page');
    }
    
    // Check demo banner
    const demoBanner = page.locator('text=/Preview.*run.*left/i');
    const bannerCount = await demoBanner.count();
    console.log('Demo banner count:', bannerCount);
    
    if (bannerCount > 0) {
      const text = await demoBanner.first().textContent();
      console.log('✅ Demo banner:', text);
    }
    
    // Check CTAs work
    const cta = page.locator('[data-cta="primary"]').first();
    const ctaCount = await cta.count();
    console.log('CTA count:', ctaCount);
    
    if (ctaCount > 0) {
      console.log('✅ CTA found, testing click...');
      await cta.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      console.log('URL after CTA click:', url);
      
      if (url.includes('checkout.stripe.com')) {
        console.log('✅ STRIPE CHECKOUT WORKING ON LIVE REPORT PAGE!');
      } else {
        console.log('❌ CTA did not redirect to Stripe');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'live-report-verification.png', fullPage: true });
    console.log('📸 Screenshot saved: live-report-verification.png');
  });
});

