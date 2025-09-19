import { test, expect } from '@playwright/test';

test('Debug legal footer brand state', async ({ page }) => {
  // Navigate to privacy page with paid version
  await page.goto('https://sunspire-web-app.vercel.app/privacy?company=Apple&brandColor=#FF0000&logo=https://logo.clearbit.com/apple.com');
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for brand state to load
  await page.waitForTimeout(3000);
  
  // Check console logs for brand takeover
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('useBrandTakeover') || msg.text().includes('Apple') || msg.text().includes('logo')) {
      consoleLogs.push(msg.text());
    }
  });
  
  // Check if there are any images on the page
  const images = await page.locator('img').all();
  console.log('Images found:', images.length);
  
  for (let i = 0; i < images.length; i++) {
    const src = await images[i].getAttribute('src');
    console.log(`Image ${i}: ${src}`);
  }
  
  // Check if the footer has the company name
  const companyName = page.locator('text=Apple');
  const isVisible = await companyName.isVisible();
  console.log('Company name visible:', isVisible);
  
  // Check if the footer has the logo condition
  const footer = page.locator('footer');
  const footerHTML = await footer.innerHTML();
  console.log('Footer HTML length:', footerHTML.length);
  console.log('Footer contains logo condition:', footerHTML.includes('!isDemo && b.logo'));
  
  // Check brand state from localStorage
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    return stored ? JSON.parse(stored) : null;
  });
  
  console.log('Brand state from localStorage:', brandState);
  
  // Take a screenshot
  await page.screenshot({ path: 'legal-debug.png', fullPage: true });
});


