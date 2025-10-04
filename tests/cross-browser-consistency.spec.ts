import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Consistency Tests', () => {
  const browsers = ['chromium', 'safari', 'firefox'];
  const testPages = [
    { name: 'Home', url: 'https://sunspire-web-app.vercel.app/?company=tesla&demo=1' },
    { name: 'Pricing', url: 'https://sunspire-web-app.vercel.app/pricing?company=tesla&demo=1' },
    { name: 'Partners', url: 'https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1' },
    { name: 'Support', url: 'https://sunspire-web-app.vercel.app/support?company=tesla&demo=1' },
    { name: 'Report', url: 'https://sunspire-web-app.vercel.app/report?company=tesla&demo=1' },
  ];

  for (const browserName of browsers) {
    for (const page of testPages) {
      test(`${browserName}: ${page.name} page - Tesla colors and functionality`, async ({ page: browserPage }) => {
        console.log(`🌐 Testing ${browserName} - ${page.name} page...`);
        
        // Navigate to page
        await browserPage.goto(page.url);
        await browserPage.waitForLoadState('networkidle');
        await browserPage.waitForTimeout(2000); // Wait for CSS injection
        
        // Reset demo runs for this browser
        await browserPage.evaluate(() => {
          localStorage.clear();
          const brandData = {
            enabled: true,
            brand: "tesla",
            primary: "#CC0000",
            logo: null,
            domain: "tesla",
            city: null,
            rep: null,
            firstName: null,
            role: null,
            expireDays: 7,
            runs: 999,
            blur: true,
            pilot: false,
            isDemo: true,
            _timestamp: Date.now()
          };
          localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
        });
        
        // Test Tesla red colors on Partners page
        if (page.name === 'Partners') {
          await browserPage.click('text=Partners');
          await browserPage.waitForLoadState('networkidle');
          
          const partnersColors = await browserPage.evaluate(() => {
            const elements = ['$30/mo', '$120', '30 days', '$30/client', '$120/client'];
            const results = {};
            elements.forEach(text => {
              const element = Array.from(document.querySelectorAll('*')).find(el => 
                el.textContent?.trim() === text
              );
              if (element) {
                results[text] = getComputedStyle(element).color;
              }
            });
            return results;
          });
          
          console.log(`🎨 ${browserName} Partners Colors:`, partnersColors);
          
          // Verify all Tesla red colors
          const allTeslaRed = Object.values(partnersColors).every(color => color === 'rgb(204, 0, 0)');
          expect(allTeslaRed).toBe(true);
        }
        
        // Test Tesla red colors on Support page
        if (page.name === 'Support') {
          await browserPage.click('text=Support');
          await browserPage.waitForLoadState('networkidle');
          
          const supportColors = await browserPage.evaluate(() => {
            const elements = ['Setup Guide', 'CRM Integration Tutorial', 'Branding Customization', 'API Documentation'];
            const results = {};
            elements.forEach(text => {
              const element = Array.from(document.querySelectorAll('*')).find(el => 
                el.textContent?.trim() === text
              );
              if (element) {
                results[text] = getComputedStyle(element).color;
              }
            });
            return results;
          });
          
          console.log(`🎨 ${browserName} Support Colors:`, supportColors);
          
          // Verify all Tesla red colors
          const allTeslaRed = Object.values(supportColors).every(color => color === 'rgb(204, 0, 0)');
          expect(allTeslaRed).toBe(true);
        }
        
        // Test demo runs functionality
        if (page.name === 'Report') {
          await browserPage.click('text=Report');
          await browserPage.waitForLoadState('networkidle');
          
          const quotaMessage = browserPage.locator('text=Demo quota exceeded');
          const quotaVisible = await quotaMessage.isVisible();
          
          console.log(`🚫 ${browserName} Quota Exceeded Visible:`, quotaVisible);
          expect(quotaVisible).toBe(false);
        }
        
        // Test footer consistency
        const footer = browserPage.locator('footer[data-testid="footer"]');
        const footerExists = await footer.isVisible();
        
        console.log(`📄 ${browserName} ${page.name} Footer Exists:`, footerExists);
        expect(footerExists).toBe(true);
        
        // Take screenshot for visual verification
        await browserPage.screenshot({ 
          path: `test-results/${browserName}-${page.name.toLowerCase()}-consistency.png`,
          fullPage: true 
        });
        
        console.log(`✅ ${browserName} ${page.name} page consistency verified!`);
      });
    }
  }
});
