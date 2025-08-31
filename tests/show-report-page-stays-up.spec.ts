import { test, expect } from '@playwright/test';

test('Show Report Page - Stays Open for Inspection', async ({ page }) => {
  console.log('🚀 Loading report page for visual inspection...');
  
  // Navigate to report page with demo parameters
  await page.goto('http://localhost:3000/report?demo=1&company=TestCompany');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded successfully!');
  console.log('🔍 Browser will stay open for visual inspection...');
  console.log('📱 You can now see:');
  console.log('   - No popups or modals');
  console.log('   - "ready-to-deploy solar intelligence tool — live on your site within 24 hours"');
  console.log('   - "Not affiliated with TestCompany"');
  console.log('   - All metric tiles with blur overlays and unlock buttons');
  console.log('   - Chart section');
  console.log('   - Three-column layout');
  
  // Verify key elements are present
  await expect(page.locator('h1:has-text("New Analysis")')).toBeVisible();
  await expect(page.locator('[data-testid="report-page"]')).toBeVisible();
  
  // Check the ready-to text section
  const readyToSection = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-2xl:has-text("ready-to-deploy")');
  await expect(readyToSection).toBeVisible();
  console.log('✅ Ready-to text section verified');
  
  // Check for "within 24 hours" text
  await expect(page.locator('text=within 24 hours')).toBeVisible();
  console.log('✅ "within 24 hours" text verified');
  
  // Check for "Not affiliated with TestCompany" text
  await expect(page.locator('text=Not affiliated with TestCompany')).toBeVisible();
  console.log('✅ "Not affiliated with TestCompany" text verified');
  
  // Verify no popups
  const modals = page.locator('[role="dialog"], .modal, .popup, [data-modal]');
  await expect(modals).toHaveCount(0);
  console.log('✅ No popups or modals found');
  
  console.log('🎉 All verifications passed!');
  console.log('🔍 Now scrolling down to show you the ready-to section...');
  
  // Scroll down to show the ready-to section
  await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const readyToSection = allDivs.find(el => 
      el.textContent?.includes('ready-to-deploy')
    );
    if (readyToSection) {
      readyToSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000); // Wait for scroll animation
  
  console.log('✅ Scrolled to ready-to section!');
  console.log('🔍 You should now see:');
  console.log('   - "A ready-to-deploy solar intelligence tool — live on your site within 24 hours"');
  console.log('   - "Not affiliated with TestCompany"');
  console.log('⏰ Browser will stay open for 5 minutes for visual inspection...');
  console.log('🔍 You can scroll around and inspect the page');
  console.log('📸 Take screenshots if needed');
  
  // Keep browser open for 5 minutes for inspection
  await page.waitForTimeout(300000); // 5 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
