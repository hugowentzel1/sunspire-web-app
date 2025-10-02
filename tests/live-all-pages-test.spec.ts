import { test, expect } from '@playwright/test';

test.describe('Live All Pages Test', () => {
  test('Test all pages on live site', async ({ page }) => {
    console.log('🌐 Testing ALL pages on LIVE site...');
    
    const pages = [
      { url: 'https://sunspire-web-app.vercel.app/?company=Netflix&demo=1', name: 'Home Demo' },
      { url: 'https://sunspire-web-app.vercel.app/pricing', name: 'Pricing' },
      { url: 'https://sunspire-web-app.vercel.app/support', name: 'Support' },
      { url: 'https://sunspire-web-app.vercel.app/partners', name: 'Partners' },
      { url: 'https://sunspire-web-app.vercel.app/status', name: 'Status' },
      { url: 'https://sunspire-web-app.vercel.app/activate', name: 'Activate' },
    ];
    
    for (const pageInfo of pages) {
      console.log(`\n📄 Testing ${pageInfo.name}...`);
      
      try {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
        
        // Check if page loads
        const h1 = page.locator('h1').first();
        const h1Visible = await h1.isVisible();
        console.log(`✅ ${pageInfo.name}: Page loaded (H1 visible: ${h1Visible})`);
        
        // Check for footer
        const footer = page.locator('footer');
        const footerVisible = await footer.isVisible();
        console.log(`✅ ${pageInfo.name}: Footer visible: ${footerVisible}`);
        
        // Check for any console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        // Wait a bit for any errors
        await page.waitForTimeout(2000);
        
        if (consoleErrors.length > 0) {
          console.log(`⚠️ ${pageInfo.name}: ${consoleErrors.length} console errors`);
        } else {
          console.log(`✅ ${pageInfo.name}: No console errors`);
        }
        
      } catch (error) {
        console.log(`❌ ${pageInfo.name}: Error - ${error}`);
      }
    }
    
    // Test Stripe checkout on report page
    console.log('\n💳 Testing Stripe checkout...');
    try {
      await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
      await page.waitForLoadState('networkidle');
      
      const sidebarCta = page.locator('[data-testid="sidebar-cta"]');
      const sidebarVisible = await sidebarCta.isVisible();
      console.log(`✅ Report page: Sidebar CTA visible: ${sidebarVisible}`);
      
      if (sidebarVisible) {
        const stripeButton = sidebarCta.locator('button[data-cta-button]');
        await stripeButton.click();
        console.log('✅ Report page: Clicked Stripe button');
        
        await page.waitForTimeout(3000);
        
        const checkoutUrl = page.url();
        if (checkoutUrl.includes('checkout.stripe.com')) {
          console.log('✅ Report page: Stripe checkout working!');
        } else {
          console.log('❌ Report page: Stripe checkout not working');
        }
      }
    } catch (error) {
      console.log(`❌ Report page: Error - ${error}`);
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'live-all-pages-test.png' });
    console.log('\n📸 Screenshot saved: live-all-pages-test.png');
    
    console.log('\n🎯 ALL PAGES TEST COMPLETE');
  });
});
