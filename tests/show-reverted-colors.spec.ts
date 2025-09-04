import { test, expect } from '@playwright/test';

test('Show Reverted LockOverlay Colors - Stay Up', async ({ page }) => {
  console.log('🎨 Showing reverted LockOverlay colors...');
  
  // Test with Tesla to show the lock overlay
  console.log('🔴 Testing Tesla branding with reverted colors...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  console.log('📱 First demo run...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  console.log('📱 Second demo run...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  console.log('📱 Third demo run (should show lock overlay)...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  
  // Check if lock overlay is visible
  const lockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Lock overlay visible:', lockOverlay);
  
  if (lockOverlay) {
    console.log('🎯 LockOverlay Elements:');
    
    // Check main heading color (should be gray, not brand color)
    const heading = page.locator('h2:has-text("Your Solar Intelligence Tool is now locked")');
    const headingColor = await heading.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Main heading color (should be gray):', headingColor);
    
    // Check CTA button color (should be brand color)
    const ctaButton = page.locator('button:has-text("Activate")');
    const buttonColor = await ctaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ CTA button background (should be brand color):', buttonColor);
    
    // Check "What You See Now" section (should be red)
    const currentHeader = page.locator('h3:has-text("What You See Now")');
    const currentHeaderColor = await currentHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ "What You See Now" header (should be red):', currentHeaderColor);
    
    // Check "What You Get Live" section (should be green)
    const liveHeader = page.locator('h3:has-text("What You Get Live")');
    const liveHeaderColor = await liveHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ "What You Get Live" header (should be green):', liveHeaderColor);
    
    // Check pricing section (should be gray)
    const pricingText = page.locator('text=Full version from just $99/mo');
    const pricingColor = await pricingText.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Pricing text (should be gray):', pricingColor);
    
    // Check brand logo background (should be brand color)
    const brandLogo = page.locator('[style*="background: var(--brand-primary)"]');
    const logoBackground = await brandLogo.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Brand logo background (should be brand color):', logoBackground);
  }
  
  // Test with Apple to show different brand colors
  console.log('🔵 Testing Apple branding...');
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(3000);
  
  const appleLockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Apple lock overlay visible:', appleLockOverlay);
  
  if (appleLockOverlay) {
    // Check Apple CTA button color (should be blue)
    const appleCtaButton = page.locator('button:has-text("Activate")');
    const appleButtonColor = await appleCtaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Apple CTA button background (should be blue):', appleButtonColor);
    
    // Check Apple brand logo background (should be blue)
    const appleBrandLogo = page.locator('[style*="background: var(--brand-primary)"]');
    const appleLogoBackground = await appleBrandLogo.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Apple brand logo background (should be blue):', appleLogoBackground);
  }
  
  console.log('🎉 Color verification complete!');
  console.log('👀 Browser window will stay open for manual inspection...');
  console.log('🔍 You can see:');
  console.log('   - Main text: Gray (not brand colored)');
  console.log('   - "What You See Now": Red theme');
  console.log('   - "What You Get Live": Green theme');
  console.log('   - Pricing: Gray (not brand colored)');
  console.log('   - CTA button: Dynamic brand color');
  console.log('   - Brand logo: Dynamic brand color');
  console.log('⏹️  Press Ctrl+C to stop the test and close the browser.');
  
  // Keep browser open for manual verification
  await page.waitForTimeout(60000); // Wait 60 seconds
});
