import { test, expect } from '@playwright/test';

test('Live Site Deployment Test - Check if new code is deployed', async ({ page }) => {
  console.log('🚀 Testing if new deployment is live...');
  
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check for deployment marker
  const hasDeploymentMarker = consoleMessages.some(msg => 
    msg.includes('[DEPLOYMENT TEST]')
  );
  console.log('🚀 Deployment marker found:', hasDeploymentMarker);
  
  // Check for hardcoded Tesla red logs
  const hasTeslaRedLog = consoleMessages.some(msg => 
    msg.includes('Using hardcoded Tesla red')
  );
  console.log('🔴 Tesla red hardcode found:', hasTeslaRedLog);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand')
    };
  });
  console.log('🎨 CSS variables:', cssVars);
  
  // Check if Tesla red is applied
  const teslaRedApplied = cssVars.brandPrimary === '#CC0000' || cssVars.brand === '#CC0000';
  console.log('🔴 Tesla red applied:', teslaRedApplied);
  
  // Check CTA button color
  const ctaButton = page.locator('button:has-text("Activate")').first();
  const ctaColor = await ctaButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.backgroundColor;
  });
  console.log('🔘 CTA button color:', ctaColor);
  
  // Check if redundant button is removed
  const redundantButtons = await page.locator('button:has-text("🚀 Activate on Your Domain")').count();
  console.log('🗑️ Redundant buttons found:', redundantButtons);
  
  // Print all console messages for debugging
  console.log('\n📝 All console messages:');
  consoleMessages.forEach(msg => console.log('  ', msg));
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-deployment-test.png' });
  console.log('📸 Deployment test screenshot saved');
  
  console.log('\n🎯 Deployment test complete!');
});
