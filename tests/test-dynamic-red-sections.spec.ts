import { test, expect } from '@playwright/test';

test('Verify Red Sections Change Dynamically with URL', async ({ page }) => {
  console.log('🎨 Testing dynamic red sections in LockOverlay...');
  
  // Test with Tesla (red color)
  console.log('🔴 Testing Tesla (red) - red sections should be red...');
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/report?company=Tesla&demo=true');
  await page.waitForTimeout(3000);
  
  const teslaLockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Tesla lock overlay visible:', teslaLockOverlay);
  
  if (teslaLockOverlay) {
    // Check "What You See Now" header color (should be Tesla red)
    const teslaCurrentHeader = page.locator('h3:has-text("What You See Now")');
    const teslaCurrentColor = await teslaCurrentHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Tesla "What You See Now" header color:', teslaCurrentColor);
    
    // Check "What You See Now" box color (should be Tesla red tinted)
    const teslaCurrentBox = page.locator('text=Blurred Data').locator('..');
    const teslaBoxColor = await teslaCurrentBox.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Tesla "What You See Now" box text color:', teslaBoxColor);
    
    // Check CTA button color (should be Tesla red)
    const teslaCtaButton = page.locator('button:has-text("Activate")');
    const teslaButtonColor = await teslaCtaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Tesla CTA button color:', teslaButtonColor);
    
    // Check brand logo color (should be Tesla red)
    const teslaBrandLogo = page.locator('[style*="background: var(--brand-primary)"]').first();
    const teslaLogoColor = await teslaBrandLogo.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Tesla brand logo color:', teslaLogoColor);
  }
  
  // Test with Apple (blue color)
  console.log('🔵 Testing Apple (blue) - red sections should be blue...');
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
    // Check "What You See Now" header color (should be Apple blue)
    const appleCurrentHeader = page.locator('h3:has-text("What You See Now")');
    const appleCurrentColor = await appleCurrentHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Apple "What You See Now" header color:', appleCurrentColor);
    
    // Check "What You See Now" box color (should be Apple blue tinted)
    const appleCurrentBox = page.locator('text=Blurred Data').locator('..');
    const appleBoxColor = await appleCurrentBox.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Apple "What You See Now" box text color:', appleBoxColor);
    
    // Check CTA button color (should be Apple blue)
    const appleCtaButton = page.locator('button:has-text("Activate")');
    const appleButtonColor = await appleCtaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Apple CTA button color:', appleButtonColor);
    
    // Check brand logo color (should be Apple blue)
    const appleBrandLogo = page.locator('[style*="background: var(--brand-primary)"]').first();
    const appleLogoColor = await appleBrandLogo.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Apple brand logo color:', appleLogoColor);
  }
  
  // Test with Netflix (red color)
  console.log('🔴 Testing Netflix (red) - red sections should be Netflix red...');
  await page.goto('http://localhost:3000/report?company=Netflix&demo=true');
  await page.waitForTimeout(2000);
  
  // Exhaust demo quota to show lock overlay
  await page.goto('http://localhost:3000/report?company=Netflix&demo=true');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/report?company=Netflix&demo=true');
  await page.waitForTimeout(3000);
  
  const netflixLockOverlay = await page.locator('[style*="position: fixed"]').isVisible();
  console.log('✅ Netflix lock overlay visible:', netflixLockOverlay);
  
  if (netflixLockOverlay) {
    // Check "What You See Now" header color (should be Netflix red)
    const netflixCurrentHeader = page.locator('h3:has-text("What You See Now")');
    const netflixCurrentColor = await netflixCurrentHeader.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    console.log('✅ Netflix "What You See Now" header color:', netflixCurrentColor);
    
    // Check CTA button color (should be Netflix red)
    const netflixCtaButton = page.locator('button:has-text("Activate")');
    const netflixButtonColor = await netflixCtaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('✅ Netflix CTA button color:', netflixButtonColor);
  }
  
  console.log('🎉 Dynamic red sections test complete!');
  console.log('👀 Browser window will stay open for manual inspection...');
  console.log('🔍 You can see:');
  console.log('   - "What You See Now" sections change color with URL');
  console.log('   - CTA button changes color with URL');
  console.log('   - Brand logo changes color with URL');
  console.log('   - Other sections stay the same (gray text, green "What You Get Live")');
  console.log('⏹️  Press Ctrl+C to stop the test and close the browser.');
  
  // Keep browser open for manual verification
  await page.waitForTimeout(60000); // Wait 60 seconds
});
