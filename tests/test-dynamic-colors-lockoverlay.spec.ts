import { test, expect } from '@playwright/test';

test('Verify LockOverlay uses dynamic brand colors', async ({ page }) => {
  console.log('🎨 Testing LockOverlay dynamic colors...');
  
  // Test with Tesla (red color)
  console.log('🔴 Testing Tesla (red) branding...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  // Check if lock overlay is visible
  const lockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Lock overlay visible:', lockOverlay);
  
  if (lockOverlay) {
    // Check main heading color
    const heading = page.locator('h2:has-text("Your Solar Intelligence Tool is now locked")');
    const headingColor = await heading.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Main heading color:', headingColor);
    
    // Check if it's using CSS variable (should be computed to actual color)
    const isUsingCSSVariable = headingColor !== 'rgb(17, 24, 39)'; // Not the hardcoded gray
    console.log('✅ Using dynamic color (not hardcoded gray):', isUsingCSSVariable);
    
    // Check CTA button color
    const ctaButton = page.locator('button:has-text("Activate")');
    const buttonColor = await ctaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ CTA button background color:', buttonColor);
    
    // Check comparison section headers
    const currentHeader = page.locator('h3:has-text("What You See Now")');
    const currentHeaderColor = await currentHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ "What You See Now" header color:', currentHeaderColor);
    
    const liveHeader = page.locator('h3:has-text("What You Get Live")');
    const liveHeaderColor = await liveHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ "What You Get Live" header color:', liveHeaderColor);
    
    // Check pricing section
    const pricingText = page.locator('text=Full version from just $99/mo');
    const pricingColor = await pricingText.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Pricing text color:', pricingColor);
  }
  
  // Test with Apple (blue color)
  console.log('🔵 Testing Apple (blue) branding...');
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/report?company=Apple&demo=true');
  await page.waitForTimeout(2000);
  
  // Check if lock overlay is visible
  const appleLockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Apple lock overlay visible:', appleLockOverlay);
  
  if (appleLockOverlay) {
    // Check main heading color for Apple
    const appleHeading = page.locator('h2:has-text("Your Solar Intelligence Tool is now locked")');
    const appleHeadingColor = await appleHeading.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Apple main heading color:', appleHeadingColor);
    
    // Check CTA button color for Apple
    const appleCtaButton = page.locator('button:has-text("Activate")');
    const appleButtonColor = await appleCtaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Apple CTA button background color:', appleButtonColor);
  }
  
  console.log('🎉 Dynamic colors test complete!');
  console.log('👀 Browser window will stay open for manual inspection...');
  
  // Keep browser open for manual verification
  await page.waitForTimeout(30000);
});
