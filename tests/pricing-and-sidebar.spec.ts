import { test, expect } from '@playwright/test';

test.describe('Pricing Page & Sidebar Verification', () => {
  test('Pricing page has all required elements', async ({ page }) => {
    console.log('🔍 Testing pricing page structure...');
    
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check headline
    const headline = await page.locator('h1:has-text("White-Label Sunspire")').count();
    console.log('   ✅ Headline present:', headline > 0);
    expect(headline).toBe(1);
    
    // Check subhead
    const subhead = await page.locator('text=/Your branded solar quote tool/i').count();
    console.log('   ✅ Subhead present:', subhead > 0);
    expect(subhead).toBeGreaterThan(0);
    
    // Check pricing
    const price = await page.locator('text=/\\$99\\/mo \\+ \\$399 setup/i').count();
    console.log('   ✅ Price display:', price > 0);
    expect(price).toBeGreaterThan(0);
    
    // Check feature bullets
    const features = await page.locator('text=/Branded reports/i, text=/Your domain/i, text=/CRM integrations/i').count();
    console.log('   ✅ Feature bullets found:', features);
    expect(features).toBeGreaterThan(0);
    
    // Check CTA button
    const ctaButton = await page.locator('button:has-text("Start setup")').count();
    console.log('   ✅ CTA buttons found:', ctaButton);
    expect(ctaButton).toBeGreaterThan(0);
    
    // Check timeline
    const timeline = await page.locator('text=/Connect domain/i').count();
    console.log('   ✅ Timeline present:', timeline > 0);
    expect(timeline).toBeGreaterThan(0);
    
    // Check FAQ
    const faq = await page.locator('text=/Frequently Asked Questions/i').count();
    console.log('   ✅ FAQ section:', faq > 0);
    expect(faq).toBeGreaterThan(0);
    
    // Check mobile sticky bar (resize to mobile)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    const stickyBar = await page.locator('.lg\\:hidden.fixed.bottom-0').isVisible();
    console.log('   ✅ Mobile sticky bar:', stickyBar);
    expect(stickyBar).toBe(true);
    
    console.log('   ✅ All pricing page elements verified!');
  });
  
  test('Sidebar is positioned mid-screen', async ({ page }) => {
    console.log('🔍 Testing sidebar positioning...');
    
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1&brandColor=%23E50914');
    
    // Wait for sidebar to load
    await page.waitForSelector('[data-testid="report-sidebar"]', { timeout: 15000 });
    
    // Get sidebar position
    const sidebar = await page.locator('[data-testid="report-sidebar"]');
    const box = await sidebar.boundingBox();
    
    if (box) {
      const viewportHeight = 1080;
      const sidebarCenter = box.y + (box.height / 2);
      const viewportCenter = viewportHeight / 2;
      const difference = Math.abs(sidebarCenter - viewportCenter);
      
      console.log('   📊 Sidebar center Y:', sidebarCenter);
      console.log('   📊 Viewport center Y:', viewportCenter);
      console.log('   📊 Difference:', difference, 'px');
      
      // Should be within 100px of true center
      expect(difference).toBeLessThan(100);
      console.log('   ✅ Sidebar is properly centered!');
    }
  });
  
  test('FAQ accordions work', async ({ page }) => {
    console.log('🔍 Testing FAQ accordions...');
    
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForSelector('text=/Frequently Asked Questions/i', { timeout: 10000 });
    
    // Click first FAQ
    const firstFAQ = page.locator('button:has-text("Accuracy & data sources")');
    await firstFAQ.click();
    await page.waitForTimeout(300);
    
    // Check if answer is visible
    const answer = await page.locator('text=/NREL PVWatts/i').isVisible();
    console.log('   ✅ FAQ expands:', answer);
    expect(answer).toBe(true);
    
    // Click again to collapse
    await firstFAQ.click();
    await page.waitForTimeout(300);
    
    console.log('   ✅ FAQ accordions working!');
  });
  
  test('Animations are present', async ({ page }) => {
    console.log('🔍 Testing animations on pricing page...');
    
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check for animation classes
    const buttonPress = await page.locator('.button-press').count();
    const hoverLift = await page.locator('.hover-lift').count();
    
    console.log('   ✅ Button press animations:', buttonPress);
    console.log('   ✅ Hover lift animations:', hoverLift);
    
    expect(buttonPress).toBeGreaterThan(0);
    
    console.log('   ✅ Animations verified!');
  });
});

