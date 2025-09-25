import { test, expect } from '@playwright/test';

test('Quick Visual Check', async ({ page }) => {
  console.log('🚀 Quick Visual Check Starting...');
  
  // Demo page
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(1000);
  
  console.log('📋 Checking demo page elements...');
  
  // Check key elements
  const heroText = await page.locator('h1').textContent();
  console.log('Hero text:', heroText?.substring(0, 50));
  
  const socialProof = await page.locator('text=Trusted by 100+ installers').isVisible();
  console.log('Social proof visible:', socialProof);
  
  const testimonials = await page.locator('text=Cut quoting time').isVisible();
  console.log('Testimonials visible:', testimonials);
  
  const stats = await page.locator('text=28,417 quotes').isVisible();
  console.log('Stats visible:', stats);
  
  const ctaButton = await page.locator('[data-cta-button]').isVisible();
  console.log('CTA button visible:', ctaButton);
  
  // Take screenshot
  await page.screenshot({ path: 'demo-check.png' });
  console.log('📸 Demo screenshot saved');
  
  // Pricing page
  await page.goto('http://localhost:3001/pricing?company=Apple&demo=1');
  await page.waitForTimeout(500);
  
  const proofSidebar = await page.locator('text=Why Installers Switch').isVisible();
  console.log('Proof sidebar visible:', proofSidebar);
  
  await page.screenshot({ path: 'pricing-check.png' });
  console.log('📸 Pricing screenshot saved');
  
  console.log('✅ Quick check complete!');
});
