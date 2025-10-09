import { test } from '@playwright/test';

test('Check for runtime errors on paid page', async ({ page }) => {
  const errors: string[] = [];
  const consoleMessages: string[] = [];
  
  // Capture console errors
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });
  
  console.log('Loading http://localhost:3000/paid?demo=0&company=Apple&brandColor=%23FF6B35');
  
  try {
    await page.goto('http://localhost:3000/paid?demo=0&company=Apple&brandColor=%23FF6B35', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    console.log('\n=== PAGE LOADED ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));
    
    console.log('\n=== ERRORS ===');
    if (errors.length > 0) {
      errors.forEach(err => console.log('ERROR:', err));
    } else {
      console.log('No errors detected');
    }
    
    console.log('\n=== PAGE STRUCTURE ===');
    const html = await page.content();
    console.log('Page length:', html.length);
    console.log('Has footer tag:', html.includes('<footer'));
    console.log('Has FooterPaid:', html.includes('FooterPaid'));
    console.log('Has "Something went wrong":', html.includes('Something went wrong'));
    
    await page.screenshot({ path: 'test-results/error-check.png', fullPage: true });
    
  } catch (error) {
    console.log('\n=== LOAD ERROR ===');
    console.log(error);
  }
});

