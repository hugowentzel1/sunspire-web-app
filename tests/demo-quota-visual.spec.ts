import { test, expect } from '@playwright/test';

test.describe('Demo Quota Visual Test', () => {
  
  test('visual check - demo runs counter and lockout', async ({ page }) => {
    // Clear storage and start fresh
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('📸 Taking screenshot 1: Initial state with 2 runs');
    await page.screenshot({ 
      path: 'tests/screenshots/demo-1-initial-2-runs.png', 
      fullPage: true 
    });

    // Look for the runs counter
    const body = await page.content();
    console.log('Page contains "runs left":', body.includes('runs left'));
    console.log('Page contains "run left":', body.includes('run left'));
    console.log('Page contains "Preview:":', body.includes('Preview:'));

    // Try to find any demo-related text
    const demoText = page.locator('text=/Preview|runs|Demo/i').first();
    if (await demoText.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Found demo text:', await demoText.textContent());
    } else {
      console.log('⚠️ No demo text found on initial load');
    }

    // Manually set quota to 1 run left
    await page.evaluate(() => {
      const key = 'demo_quota_v5';
      const url = new URL(window.location.href);
      const essentialParams = ["company", "demo"];
      const newUrl = new URL(url.origin + "/");
      essentialParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          newUrl.searchParams.set(param, url.searchParams.get(param) || "");
        }
      });
      const link = newUrl.toString();
      localStorage.setItem(key, JSON.stringify({ [link]: 1 }));
      console.log('🔧 Set quota to 1 for:', link);
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('📸 Taking screenshot 2: After setting quota to 1 run');
    await page.screenshot({ 
      path: 'tests/screenshots/demo-2-one-run-left.png', 
      fullPage: true 
    });

    // Set quota to 0 runs (exhausted)
    await page.evaluate(() => {
      const key = 'demo_quota_v5';
      const url = new URL(window.location.href);
      const essentialParams = ["company", "demo"];
      const newUrl = new URL(url.origin + "/");
      essentialParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          newUrl.searchParams.set(param, url.searchParams.get(param) || "");
        }
      });
      const link = newUrl.toString();
      localStorage.setItem(key, JSON.stringify({ [link]: 0 }));
      console.log('🔧 Set quota to 0 for:', link);
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('📸 Taking screenshot 3: Quota exhausted (0 runs)');
    await page.screenshot({ 
      path: 'tests/screenshots/demo-3-zero-runs.png', 
      fullPage: true 
    });

    // Check for "Demo limit reached" message
    const limitText = page.locator('text=/Demo limit reached/i');
    if (await limitText.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Found "Demo limit reached" message');
    } else {
      console.log('⚠️ "Demo limit reached" message not found');
    }

    // Now try to click Generate Report with 0 quota to trigger lock overlay
    const addressInput = page.locator('input[placeholder*="address"]').first();
    if (await addressInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Found address input, filling it');
      await addressInput.click();
      await addressInput.fill('123 Main St, San Francisco, CA');
      await page.waitForTimeout(1500);

      // Try to click the Generate button
      const generateBtn = page.locator('button:has-text("Generate Solar Report")').first();
      if (await generateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('🔹 Clicking Generate Report with 0 quota...');
        await generateBtn.click();
        await page.waitForTimeout(3000);

        console.log('📸 Taking screenshot 4: After clicking with 0 quota (should show lock overlay)');
        await page.screenshot({ 
          path: 'tests/screenshots/demo-4-lock-overlay.png', 
          fullPage: true 
        });

        // Check if lock overlay appeared
        const lockOverlay = page.locator('text="Ready to Launch Your Branded, Customer-Facing Tool?"');
        if (await lockOverlay.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('✅ Lock overlay appeared!');
          
          // Verify we didn't navigate
          const url = page.url();
          if (url.includes('/?company=Tesla&demo=1') && !url.includes('/report')) {
            console.log('✅ Stayed on homepage (no navigation)');
          } else {
            console.log('⚠️ URL changed unexpectedly:', url);
          }
        } else {
          console.log('❌ Lock overlay did not appear');
          console.log('Current URL:', page.url());
        }
      } else {
        console.log('⚠️ Generate button not found');
      }
    } else {
      console.log('⚠️ Address input not found');
    }

    console.log('\n✅ Visual test complete! Check screenshots in tests/screenshots/');
    console.log('   - demo-1-initial-2-runs.png');
    console.log('   - demo-2-one-run-left.png');
    console.log('   - demo-3-zero-runs.png');
    console.log('   - demo-4-lock-overlay.png');
  });

  test('visual check - navigate to report and verify lock overlay on report page', async ({ page }) => {
    // Set quota to 0 and go directly to report
    await page.goto('http://localhost:3001/?company=Google&demo=1');
    await page.evaluate(() => {
      localStorage.clear();
      const key = 'demo_quota_v5';
      const url = new URL(window.location.href);
      const essentialParams = ["company", "demo"];
      const newUrl = new URL(url.origin + "/");
      essentialParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          newUrl.searchParams.set(param, url.searchParams.get(param) || "");
        }
      });
      const link = newUrl.toString();
      localStorage.setItem(key, JSON.stringify({ [link]: 0 }));
    });

    // Navigate to report page with 0 quota
    await page.goto('http://localhost:3001/report?company=Google&demo=1&address=123+Main+St&lat=37.7749&lng=-122.4194');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('📸 Taking screenshot: Report page with 0 quota (should show lock overlay)');
    await page.screenshot({ 
      path: 'tests/screenshots/demo-report-lock-overlay.png', 
      fullPage: true 
    });

    // Check if lock overlay is visible on report page
    const lockOverlay = page.locator('text="Ready to Launch Your Branded, Customer-Facing Tool?"');
    if (await lockOverlay.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Lock overlay appeared on report page!');
    } else {
      console.log('⚠️ Lock overlay not visible on report page');
    }
  });
});

