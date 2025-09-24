const { chromium } = require('playwright');

async function fastCheck() {
  console.log('🚀 FAST THOROUGH CHECK - Starting...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('📋 Step 1: Loading demo page...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(2000);
  
  console.log('📋 Step 2: Taking screenshot of demo page...');
  await page.screenshot({ path: 'demo-page.png', fullPage: true });
  
  console.log('📋 Step 3: Checking key elements...');
  
  // Check hero text
  const heroText = await page.locator('h1').textContent();
  console.log('✅ Hero text:', heroText?.substring(0, 50) + '...');
  
  // Check social proof
  const socialProof = await page.locator('text=Trusted by 100+ installers').isVisible();
  console.log('✅ Social proof visible:', socialProof);
  
  // Check testimonials
  const testimonials = await page.locator('text=Cut quoting time').isVisible();
  console.log('✅ Testimonials visible:', testimonials);
  
  // Check stats
  const stats = await page.locator('text=28,417 quotes').isVisible();
  console.log('✅ Stats visible:', stats);
  
  // Check CTA button
  const ctaButton = await page.locator('[data-cta-button]').isVisible();
  console.log('✅ CTA button visible:', ctaButton);
  
  console.log('📋 Step 4: Testing pricing page...');
  await page.goto('http://localhost:3001/pricing?company=Apple&demo=1');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'pricing-page.png', fullPage: true });
  
  const proofSidebar = await page.locator('text=Why Installers Switch').isVisible();
  console.log('✅ Proof sidebar visible:', proofSidebar);
  
  console.log('📋 Step 5: Testing address input...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(1000);
  
  const addressInput = page.locator('input[placeholder*="address"]');
  await addressInput.fill('1600 Amphitheatre Parkway');
  await page.waitForTimeout(500);
  
  const suggestions = await page.locator('.pac-container .pac-item').count();
  console.log('✅ Address autocomplete suggestions:', suggestions);
  
  console.log('🎉 FAST CHECK COMPLETE! Screenshots saved.');
  
  await browser.close();
}

fastCheck().catch(console.error);
