import { test, expect } from '@playwright/test';

test('Debug Brand Colors - Investigate Status Page Issues', async ({ page }) => {
  console.log('🔍 Debugging brand color issues...');
  
  // Test 1: Check if brand takeover is working at all
  console.log('\n🔍 Test 1: Check Brand Takeover Hook');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if the header shows Apple branding
  const headerText = await page.locator('h1').first().textContent();
  console.log(`📝 Header text: ${headerText}`);
  
  // Check if brand-primary CSS variable is set
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log(`🎨 CSS --brand-primary: ${brandPrimary}`);
  
  // Test 2: Check status page with same parameters
  console.log('\n🔍 Test 2: Check Status Page Brand Colors');
  await page.goto('https://sunspire-web-app.vercel.app/status?company=Apple&brandColor=%23000000&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if brand-primary CSS variable is set on status page
  const statusPageBrandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log(`🎨 Status page --brand-primary: ${statusPageBrandPrimary}`);
  
  // Check the actual 24/7 text element
  const monitoringElement = page.locator('text=24/7').first();
  if (await monitoringElement.count() > 0) {
    const elementStyle = await monitoringElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        className: el.className,
        inlineStyle: el.getAttribute('style')
      };
    });
    
    console.log('🎯 24/7 Monitoring Element:');
    console.log(`  Computed Color: ${elementStyle.color}`);
    console.log(`  Class Name: ${elementStyle.className}`);
    console.log(`  Inline Style: ${elementStyle.inlineStyle}`);
    
    // Check if the inline style is overriding our dynamic color
    if (elementStyle.inlineStyle?.includes('#7c3aed')) {
      console.log('❌ Inline style is hardcoded to purple fallback');
    } else if (elementStyle.color.includes('rgb(0, 0, 0)')) {
      console.log('✅ Element is using Apple brand color (black)');
    } else {
      console.log('⚠️ Element color is neither purple nor black');
    }
  }
  
  // Test 3: Check if the useBrandTakeover hook is working
  console.log('\n🔍 Test 3: Check useBrandTakeover Hook State');
  
  // Look for any console logs or errors
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });
  
  // Wait a bit more for any console output
  await page.waitForTimeout(2000);
  
  console.log('📝 Console logs:', consoleLogs);
  
  // Test 4: Check if the page is actually using the correct component
  console.log('\n🔍 Test 4: Check Component Source');
  
  // Look for the specific text in the HTML source
  const pageSource = await page.content();
  if (pageSource.includes('style="color:#7c3aed"')) {
    console.log('❌ HTML still contains hardcoded purple color');
  } else {
    console.log('✅ HTML does not contain hardcoded purple color');
  }
  
  if (pageSource.includes('useBrandTakeover')) {
    console.log('✅ HTML contains useBrandTakeover reference');
  } else {
    console.log('❌ HTML does not contain useBrandTakeover reference');
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'debug-brand-colors-status-page.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
  
  console.log('\n🎯 Debug Summary:');
  console.log(`- Brand Primary CSS Variable: ${statusPageBrandPrimary}`);
  console.log(`- 24/7 Element Color: ${await page.locator('text=24/7').first().evaluate(el => window.getComputedStyle(el).color)}`);
  console.log(`- Page Source Contains Hardcoded Color: ${pageSource.includes('style="color:#7c3aed"')}`);
});
