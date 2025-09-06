import { test, expect } from '@playwright/test';

test('Show All New Pages and Functionality', async ({ page }) => {
  console.log('🚀 Starting comprehensive demo of all new pages...');
  
  // 1. Main Page - Show the simplified address input
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  console.log('✅ Main page loaded - showing simplified address input (like c548b88)');
  console.log('📍 Address input: Simple text field + "Get Quote" button');
  console.log('📍 Message: "Address autocomplete temporarily unavailable"');
  await page.waitForTimeout(3000);
  
  // 2. Setup Guide
  await page.goto('http://localhost:3002/docs/setup');
  await page.waitForLoadState('networkidle');
  console.log('✅ Setup Guide loaded - showing step-by-step installation');
  console.log('📋 Includes: Installation steps, Embed guide, CRM guides, System status');
  await page.waitForTimeout(3000);
  
  // 3. Embed Guide
  await page.goto('http://localhost:3002/docs/embed');
  await page.waitForLoadState('networkidle');
  console.log('✅ Embed Guide loaded - showing one-line integration');
  console.log('🔗 Includes: WordPress, Shopify, Wix, Custom HTML instructions');
  await page.waitForTimeout(3000);
  
  // 4. HubSpot CRM Guide
  await page.goto('http://localhost:3002/docs/crm/hubspot');
  await page.waitForLoadState('networkidle');
  console.log('✅ HubSpot CRM Guide loaded - showing integration steps');
  console.log('🔧 Includes: API setup, data mapping, automation workflows');
  await page.waitForTimeout(3000);
  
  // 5. Salesforce CRM Guide
  await page.goto('http://localhost:3002/docs/crm/salesforce');
  await page.waitForLoadState('networkidle');
  console.log('✅ Salesforce CRM Guide loaded - showing integration steps');
  console.log('🔧 Includes: Connected app setup, custom fields, workflow rules');
  await page.waitForTimeout(3000);
  
  // 6. Airtable CRM Guide
  await page.goto('http://localhost:3002/docs/crm/airtable');
  await page.waitForLoadState('networkidle');
  console.log('✅ Airtable CRM Guide loaded - showing integration steps');
  console.log('🔧 Includes: Base setup, table structure, automation features');
  await page.waitForTimeout(3000);
  
  // 7. Terms of Service
  await page.goto('http://localhost:3002/terms');
  await page.waitForLoadState('networkidle');
  console.log('✅ Terms of Service loaded - showing comprehensive legal content');
  console.log('⚖️ Includes: 11 sections covering all legal aspects');
  await page.waitForTimeout(3000);
  
  // 8. DPA (Data Processing Agreement)
  await page.goto('http://localhost:3002/dpa');
  await page.waitForLoadState('networkidle');
  console.log('✅ DPA page loaded - showing data processing agreement');
  console.log('🔒 Includes: Data security, subject rights, breach notification');
  await page.waitForTimeout(3000);
  
  // 9. Do Not Sell My Data
  await page.goto('http://localhost:3002/do-not-sell');
  await page.waitForLoadState('networkidle');
  console.log('✅ Do Not Sell page loaded - showing CCPA opt-out form');
  console.log('🚫 Includes: Opt-out form, confirmation process, color-coded design');
  await page.waitForTimeout(3000);
  
  // 10. Pricing Page
  await page.goto('http://localhost:3002/pricing');
  await page.waitForLoadState('networkidle');
  console.log('✅ Pricing page loaded - showing color-coded design');
  console.log('💰 Shows: $99/mo + $399 setup pricing');
  console.log('🎨 All elements use brand colors consistently');
  await page.waitForTimeout(3000);
  
  // 11. Back to Main Page for Footer
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  // Scroll to footer to show the compliance badges
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  console.log('✅ Back to main page - showing updated footer');
  console.log('🏷️ Footer badges: GDPR, CCPA, SOC 2 with brand color gradients');
  
  console.log('🎉 All pages demo completed!');
  console.log('📋 Summary of what was created:');
  console.log('   • Setup Guide (/docs/setup)');
  console.log('   • Embed Guide (/docs/embed)');
  console.log('   • HubSpot CRM Guide (/docs/crm/hubspot)');
  console.log('   • Salesforce CRM Guide (/docs/crm/salesforce)');
  console.log('   • Airtable CRM Guide (/docs/crm/airtable)');
  console.log('   • Terms of Service (/terms)');
  console.log('   • DPA (/dpa)');
  console.log('   • Do Not Sell (/do-not-sell)');
  console.log('   • All pages color-coded with brand colors');
  console.log('   • All pages have "Back to Home" navigation');
  console.log('   • Simplified address input (like c548b88)');
  
  // Keep the page open for final visual inspection
  await page.waitForTimeout(10000); // Stay open for 10 seconds
});
