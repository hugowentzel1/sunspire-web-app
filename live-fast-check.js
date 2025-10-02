const { chromium } = require('playwright');

async function liveFastCheck() {
  console.log('🚀 LIVE SITE FAST CHECK - Starting comprehensive verification...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('📋 Step 1: Loading LIVE demo page...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  await page.waitForTimeout(3000);
  
  console.log('📋 Step 2: Taking screenshot of LIVE demo page...');
  await page.screenshot({ path: 'live-demo-page.png', fullPage: true });
  
  console.log('📋 Step 3: Checking key elements on LIVE site...');
  
  // Check hero text (use first h1 to avoid strict mode violation)
  const heroText = await page.locator('h1').first().textContent();
  console.log('✅ Hero text:', heroText?.substring(0, 50) + '...');
  
  // Check micro testimonial strip
  const microTestimonial = await page.locator('[data-testid="micro-testimonial"]').isVisible();
  console.log('✅ Micro testimonial strip visible:', microTestimonial);
  
  // Check mobile sticky CTA
  const mobileStickyCta = await page.locator('[data-testid="mobile-sticky-cta"]').isVisible();
  console.log('✅ Mobile sticky CTA visible:', mobileStickyCta);
  
  // Check social proof
  const socialProof = await page.locator('text=Trusted by').isVisible();
  console.log('✅ Social proof visible:', socialProof);
  
  // Check testimonials
  const testimonials = await page.locator('text=Cut quoting time').isVisible();
  console.log('✅ Testimonials visible:', testimonials);
  
  // Check stats
  const stats = await page.locator('text=quotes').isVisible();
  console.log('✅ Stats visible:', stats);
  
  // Check CTA button
  const ctaButton = await page.locator('[data-cta-button]').isVisible();
  console.log('✅ CTA button visible:', ctaButton);
  
  console.log('📋 Step 4: Testing address autocomplete on LIVE site...');
  const addressInput = page.locator('input[placeholder*="address"]');
  await addressInput.fill('123 Main St San Francisco CA');
  await page.waitForTimeout(2000);
  
  const autocomplete = page.locator('[data-autosuggest]');
  const suggestions = await autocomplete.locator('div').count();
  console.log('✅ Address autocomplete suggestions:', suggestions);
  
  if (suggestions > 0) {
    await autocomplete.locator('div').first().click();
    console.log('✅ Clicked first suggestion');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page!');
      
      // Check report page header navigation
      const pricingLink = await page.locator('nav a[href*="/pricing"]').isVisible();
      const partnersLink = await page.locator('nav a[href*="/partners"]').isVisible();
      const supportLink = await page.locator('nav a[href*="/support"]').isVisible();
      
      console.log('✅ Pricing link visible:', pricingLink);
      console.log('✅ Partners link visible:', partnersLink);
      console.log('✅ Support link visible:', supportLink);
      
      // Check sidebar CTA
      const sidebarCta = await page.locator('[data-testid="sidebar-cta"]').isVisible();
      console.log('✅ Sidebar CTA visible:', sidebarCta);
      
      // Check demo banner
      const demoBanner = await page.locator('[data-testid="demo-banner"]').isVisible();
      console.log('✅ Demo banner visible:', demoBanner);
      
      if (demoBanner) {
        const bannerText = await page.locator('[data-testid="demo-banner"]').textContent();
        console.log('✅ Demo banner text:', bannerText);
      }
      
      await page.screenshot({ path: 'live-report-page.png', fullPage: true });
    } else {
      console.log('❌ Did not navigate to report page');
    }
  }
  
  console.log('📋 Step 5: Testing pricing page on LIVE site...');
  await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'live-pricing-page.png', fullPage: true });
  
  const proofSidebar = await page.locator('text=Why Installers Switch').isVisible();
  console.log('✅ Proof sidebar visible:', proofSidebar);
  
  const backToHomeButton = await page.locator('text=Back to Home').isVisible();
  console.log('✅ Back to Home button visible:', backToHomeButton);
  
  console.log('📋 Step 6: Testing support page on LIVE site...');
  await page.goto('https://sunspire-web-app.vercel.app/support?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'live-support-page.png', fullPage: true });
  
  const supportFaq = await page.locator('[data-testid="support-faq"]').isVisible();
  const partnerInquiry = await page.locator('[data-testid="partner-inquiry-form"]').isVisible();
  
  console.log('✅ Support FAQ visible:', supportFaq);
  console.log('✅ Partner inquiry form visible:', partnerInquiry);
  
  console.log('📋 Step 7: Testing partners page on LIVE site...');
  await page.goto('https://sunspire-web-app.vercel.app/partners?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'live-partners-page.png', fullPage: true });
  
  const partnersForm = await page.locator('form').isVisible();
  console.log('✅ Partners form visible:', partnersForm);
  
  console.log('📋 Step 8: Testing Stripe checkout on LIVE site...');
  await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  
  const stripeButton = page.locator('button[data-cta-button]').first();
  if (await stripeButton.isVisible()) {
    await stripeButton.click();
    console.log('✅ Clicked Stripe button');
    await page.waitForTimeout(3000);
    
    const checkoutUrl = page.url();
    if (checkoutUrl.includes('checkout.stripe.com')) {
      console.log('✅ Stripe checkout working!');
    } else {
      console.log('❌ Stripe checkout not working');
    }
  }
  
  console.log('🎉 LIVE SITE FAST CHECK COMPLETE! All screenshots saved.');
  console.log('📸 Screenshots: live-demo-page.png, live-report-page.png, live-pricing-page.png, live-support-page.png, live-partners-page.png');
  
  await browser.close();
}

liveFastCheck().catch(console.error);
