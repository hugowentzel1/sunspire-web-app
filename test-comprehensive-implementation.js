const { chromium } = require('playwright');

async function testComprehensiveImplementation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🚀 Testing Comprehensive Implementation...');
  
  try {
    // Test 1: CTA Text Changes
    console.log('\n📝 Testing CTA Text Changes...');
    await page.goto('http://localhost:3000');
    
    // Check main page CTA
    const mainCTA = await page.locator('button:has-text("Activate on Your Domain — 24 Hours")').first();
    if (await mainCTA.isVisible()) {
      console.log('✅ Main page CTA updated correctly');
    } else {
      console.log('❌ Main page CTA not found');
    }
    
    // Check pricing page CTAs
    await page.goto('http://localhost:3000/pricing');
    const pricingCTAs = await page.locator('button:has-text("Activate on Your Domain — 24 Hours")');
    if (await pricingCTAs.count() >= 2) {
      console.log('✅ Pricing page CTAs updated correctly');
    } else {
      console.log('❌ Pricing page CTAs not found');
    }
    
    // Test 2: Security Page
    console.log('\n🔒 Testing Security Page...');
    await page.goto('http://localhost:3000/security');
    
    // Check if page loads
    const securityTitle = await page.locator('h1:has-text("Security & Compliance")');
    if (await securityTitle.isVisible()) {
      console.log('✅ Security page loads correctly');
    } else {
      console.log('❌ Security page not loading');
    }
    
    // Check sections
    const sections = ['encryption', 'soc2', 'gdpr', 'ccpa', 'breach', 'dpo'];
    for (const section of sections) {
      const sectionElement = await page.locator(`#${section}`);
      if (await sectionElement.isVisible()) {
        console.log(`✅ ${section.toUpperCase()} section present`);
      } else {
        console.log(`❌ ${section.toUpperCase()} section missing`);
      }
    }
    
    // Test 3: Footer Updates
    console.log('\n🏠 Testing Footer Updates...');
    await page.goto('http://localhost:3000');
    
    // Check address
    const address = await page.locator('text=Sunspire, 123 Main Street, San Francisco, CA 94105');
    if (await address.isVisible()) {
      console.log('✅ Company address updated');
    } else {
      console.log('❌ Company address not found');
    }
    
    // Check compliance badges
    const badges = ['GDPR', 'CCPA', 'SOC 2'];
    for (const badge of badges) {
      const badgeElement = await page.locator(`a:has-text("${badge}")`);
      if (await badgeElement.isVisible()) {
        console.log(`✅ ${badge} badge present`);
      } else {
        console.log(`❌ ${badge} badge missing`);
      }
    }
    
    // Check new footer links
    const newLinks = ['Security', 'DPA', 'Do Not Sell My Data'];
    for (const link of newLinks) {
      const linkElement = await page.locator(`a:has-text("${link}")`);
      if (await linkElement.isVisible()) {
        console.log(`✅ ${link} link present`);
      } else {
        console.log(`❌ ${link} link missing`);
      }
    }
    
    // Test 4: Do Not Sell Page
    console.log('\n🚫 Testing Do Not Sell Page...');
    await page.goto('http://localhost:3000/do-not-sell');
    
    const doNotSellTitle = await page.locator('h1:has-text("Do Not Sell My Data")');
    if (await doNotSellTitle.isVisible()) {
      console.log('✅ Do Not Sell page loads correctly');
    } else {
      console.log('❌ Do Not Sell page not loading');
    }
    
    // Test 5: Signup Page
    console.log('\n📝 Testing Signup Page...');
    await page.goto('http://localhost:3000/signup');
    
    const signupTitle = await page.locator('h1:has-text("Get Started with Sunspire")');
    if (await signupTitle.isVisible()) {
      console.log('✅ Signup page loads correctly');
    } else {
      console.log('❌ Signup page not loading');
    }
    
    // Test 6: Brand Takeover Demo
    console.log('\n🎨 Testing Brand Takeover Demo...');
    await page.goto('http://localhost:3000/?company=Amazon&demo=1');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check if brand takeover is working
    const brandCTA = await page.locator('button:has-text("Activate on Your Domain — 24 Hours")');
    if (await brandCTA.isVisible()) {
      console.log('✅ Brand takeover demo working');
    } else {
      console.log('❌ Brand takeover demo not working');
    }
    
    // Test 7: API Routes (basic connectivity)
    console.log('\n🔌 Testing API Routes...');
    
    // Test leads upsert
    const leadsResponse = await page.request.post('http://localhost:3000/api/leads/upsert', {
      data: {
        email: 'test@example.com',
        companyHandle: 'test-company'
      }
    });
    
    if (leadsResponse.ok()) {
      console.log('✅ Leads upsert API working');
    } else {
      console.log('❌ Leads upsert API not working');
    }
    
    // Test events log
    const eventsResponse = await page.request.post('http://localhost:3000/api/events/log', {
      data: {
        companyHandle: 'test-company',
        type: 'demo_open'
      }
    });
    
    if (eventsResponse.ok()) {
      console.log('✅ Events log API working');
    } else {
      console.log('❌ Events log API not working');
    }
    
    // Test geo normalize
    const geoResponse = await page.request.get('http://localhost:3000/api/geo/normalize?address=123%20Main%20St%20San%20Francisco');
    
    if (geoResponse.ok()) {
      console.log('✅ Geo normalize API working');
    } else {
      console.log('❌ Geo normalize API not working');
    }
    
    // Test unsubscribe
    const unsubscribeResponse = await page.request.get('http://localhost:3000/api/unsubscribe/test-hash');
    
    if (unsubscribeResponse.ok()) {
      console.log('✅ Unsubscribe API working');
    } else {
      console.log('❌ Unsubscribe API not working');
    }
    
    console.log('\n🎉 Comprehensive implementation test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\n🔍 Browser kept open for visual inspection. Close manually when done.');
    await new Promise(() => {}); // Keep process alive
  }
}

testComprehensiveImplementation();
