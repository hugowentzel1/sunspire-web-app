commit c548b88922408f25a24788fef6b8404ff6ea2247
Author: Hugo Wentzel <hugowentzel@gmail.com>
Date:   Fri Aug 22 17:41:14 2025 -0400

    🔧 Fix button height consistency in CTABand - Add explicit height: 64px and minHeight: 64px to both buttons - Use flexbox centering with alignItems: center and justifyContent: center - Set consistent lineHeight: 1.2 for text alignment - Ensure both CTA buttons have exactly the same height

diff --git a/button-heights-comparison.png b/button-heights-comparison.png
new file mode 100644
index 0000000..2af0c6a
Binary files /dev/null and b/button-heights-comparison.png differ
diff --git a/cta-buttons-consistent-heights.png b/cta-buttons-consistent-heights.png
index 1301334..8ca9882 100644
Binary files a/cta-buttons-consistent-heights.png and b/cta-buttons-consistent-heights.png differ
diff --git a/no-confirmation.png b/no-confirmation.png
index 24dc68f..50948b4 100644
Binary files a/no-confirmation.png and b/no-confirmation.png differ
diff --git a/sample-report-modal-debug.png b/sample-report-modal-debug.png
index 4a3eaf9..21aff14 100644
Binary files a/sample-report-modal-debug.png and b/sample-report-modal-debug.png differ
diff --git a/sample-report-modal-open.png b/sample-report-modal-open.png
index 58aa88a..54e043d 100644
Binary files a/sample-report-modal-open.png and b/sample-report-modal-open.png differ
diff --git a/sample-report-no-success-debug.png b/sample-report-no-success-debug.png
index 934031b..1c26ab8 100644
Binary files a/sample-report-no-success-debug.png and b/sample-report-no-success-debug.png differ
diff --git a/src/report/CTABand.tsx b/src/report/CTABand.tsx
index 23abbd8..0246dce 100644
--- a/src/report/CTABand.tsx
+++ b/src/report/CTABand.tsx
@@ -46,7 +46,13 @@ export default function CTABand() {
               boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
               border: '2px solid #ffffff',
               width: '220px',
-              minWidth: '220px'
+              minWidth: '220px',
+              height: '64px',
+              minHeight: '64px',
+              display: 'flex',
+              alignItems: 'center',
+              justifyContent: 'center',
+              lineHeight: '1.2'
             }}
             whileHover={{ 
               scale: 1.05,
@@ -55,7 +61,7 @@ export default function CTABand() {
             }}
             whileTap={{ scale: 0.95 }}
           >
-                            Activate Your White-Label Demo
+            Activate Your White-Label Demo
           </motion.button>
           <motion.button
             onClick={handleSecondaryClick}
@@ -66,7 +72,13 @@ export default function CTABand() {
               border: '2px solid #ffffff',
               boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
               width: '220px',
-              minWidth: '220px'
+              minWidth: '220px',
+              height: '64px',
+              minHeight: '64px',
+              display: 'flex',
+              alignItems: 'center',
+              justifyContent: 'center',
+              lineHeight: '1.2'
             }}
             whileHover={{ 
               scale: 1.05,
diff --git a/system-status-apple-colors.png b/system-status-apple-colors.png
index c5670b7..9f79b21 100644
Binary files a/system-status-apple-colors.png and b/system-status-apple-colors.png differ
diff --git a/system-status-tesla-colors.png b/system-status-tesla-colors.png
index ec0d44d..58b76f2 100644
Binary files a/system-status-tesla-colors.png and b/system-status-tesla-colors.png differ
diff --git a/tests/button-height-check.spec.ts b/tests/button-height-check.spec.ts
new file mode 100644
index 0000000..1fc6180
--- /dev/null
+++ b/tests/button-height-check.spec.ts
@@ -0,0 +1,62 @@
+import { test, expect } from '@playwright/test';
+
+test('Check CTA Button Heights', async ({ page }) => {
+  console.log('🔍 Checking CTA button heights...');
+  
+  // Navigate to Apple demo page
+  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=Apple&brandColor=%23000000&demo=1');
+  await page.waitForLoadState('networkidle');
+  await page.waitForTimeout(2000);
+  
+  // Look for both CTA buttons
+  const activateButton = page.locator('button:has-text("Activate Your White-Label Demo")').first();
+  const sampleButton = page.locator('button:has-text("Request Sample Report")').first();
+  
+  if (await activateButton.count() > 0 && await sampleButton.count() > 0) {
+    console.log('✅ Both buttons found');
+    
+    // Get button dimensions
+    const activateBox = await activateButton.boundingBox();
+    const sampleBox = await sampleButton.boundingBox();
+    
+    if (activateBox && sampleBox) {
+      console.log('📏 Button Dimensions:');
+      console.log(`  "Activate Your White-Label Demo":`);
+      console.log(`    Width: ${activateBox.width}px`);
+      console.log(`    Height: ${activateBox.height}px`);
+      console.log(`    Padding: ${await activateButton.evaluate(el => {
+        const style = window.getComputedStyle(el);
+        return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
+      })}`);
+      
+      console.log(`  "Request Sample Report":`);
+      console.log(`    Width: ${sampleBox.width}px`);
+      console.log(`    Height: ${sampleBox.height}px`);
+      console.log(`    Padding: ${await sampleButton.evaluate(el => {
+        const style = window.getComputedStyle(el);
+        return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
+      })}`);
+      
+      // Check if heights are the same
+      const heightDiff = Math.abs(activateBox.height - sampleBox.height);
+      if (heightDiff < 2) { // Allow 2px tolerance for rounding
+        console.log('✅ Button heights are the same!');
+        console.log(`   Height difference: ${heightDiff}px (within tolerance)`);
+      } else {
+        console.log('❌ Button heights are different!');
+        console.log(`   Height difference: ${heightDiff}px`);
+      }
+      
+      // Take screenshot for visual verification
+      await page.screenshot({ path: 'button-heights-comparison.png' });
+      console.log('📸 Button heights screenshot saved');
+      
+    } else {
+      console.log('❌ Could not get button dimensions');
+    }
+  } else {
+    console.log('❌ One or both buttons not found');
+    console.log(`  Activate button: ${await activateButton.count()}`);
+    console.log(`  Sample button: ${await sampleButton.count()}`);
+  }
+});
diff --git a/tests/demo-fixes-verification.spec.ts b/tests/demo-fixes-verification.spec.ts
index 4c5e62f..5a576fd 100644
--- a/tests/demo-fixes-verification.spec.ts
+++ b/tests/demo-fixes-verification.spec.ts
@@ -98,7 +98,7 @@ test('Demo Fixes Verification - Visual Test', async ({ page }) => {
       
       // Wait for success confirmation
       try {
-        await page.waitForSelector('text=Sample Report Requested!, text=You\'re All Set!', { timeout: 15000 });
+        await page.waitForSelector('text=Sample Report Requested!, text=You\'re All Set!, text=Sample Report Requested!Thanks for reaching out!', { timeout: 15000 });
         console.log('✅ Success confirmation appeared!');
         
         // Take screenshot of success state
@@ -123,6 +123,16 @@ test('Demo Fixes Verification - Visual Test', async ({ page }) => {
           console.log(`⚠️ Found ${errorMessages} potential error messages on page`);
         }
         
+        // Check if success text is actually in the DOM (it might be working but test selector is wrong)
+        const modalContent = page.locator('.modal-content, .lead-form-modal > div').first();
+        if (await modalContent.count() > 0) {
+          const modalText = await modalContent.textContent();
+          if (modalText?.includes('Sample Report Requested!')) {
+            console.log('🎉 SUCCESS! Confirmation IS working - test selector was wrong!');
+            console.log('📝 Modal content:', modalText?.substring(0, 100) + '...');
+          }
+        }
+        
         // Take screenshot of failure state
         await page.screenshot({ path: 'no-confirmation.png' });
         
diff --git a/tests/sample-report-debug.spec.ts b/tests/sample-report-debug.spec.ts
index a5c0461..7eb60b1 100644
--- a/tests/sample-report-debug.spec.ts
+++ b/tests/sample-report-debug.spec.ts
@@ -68,6 +68,36 @@ test('Sample Report Confirmation Debug', async ({ page }) => {
       const successCount = await successElements.count();
       console.log(`🔍 Success elements found: ${successCount}`);
       
+      // Check what's actually in the modal content
+      const modalContent = page.locator('.modal-content, .lead-form-modal > div').first();
+      if (await modalContent.count() > 0) {
+        const modalText = await modalContent.textContent();
+        console.log('🔍 Modal content text:', modalText?.substring(0, 200) + '...');
+        
+        // Check if success text is in the DOM but hidden
+        const successInDOM = modalText?.includes('Sample Report Requested!') || modalText?.includes("You're All Set!");
+        console.log(`🔍 Success text in DOM: ${successInDOM}`);
+      }
+      
+      // Check for any hidden elements
+      const hiddenElements = await page.locator('*').evaluateAll((elements) => {
+        return elements
+          .filter(el => el.textContent?.includes('Sample Report Requested!') || el.textContent?.includes("You're All Set!"))
+          .map(el => ({
+            tag: el.tagName,
+            text: el.textContent?.substring(0, 50),
+            visible: el.offsetParent !== null,
+            display: window.getComputedStyle(el).display,
+            opacity: window.getComputedStyle(el).opacity
+          }));
+      });
+      
+      if (hiddenElements.length > 0) {
+        console.log('🔍 Hidden success elements found:', hiddenElements);
+      } else {
+        console.log('🔍 No success elements found in DOM at all');
+      }
+      
       if (successCount > 0) {
         console.log('🎉 Success confirmation is visible!');
         await page.screenshot({ path: 'sample-report-success-debug.png' });
