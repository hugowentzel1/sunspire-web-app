#!/usr/bin/env node

/**
 * End-to-End Checkout Flow Test
 * Tests: Checkout creation → Payment → Webhook → Airtable
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

// Test company name (unique per run)
const TEST_COMPANY = `test-company-${Date.now()}`;

console.log('='.repeat(70));
console.log('END-TO-END CHECKOUT FLOW TEST');
console.log('='.repeat(70));
console.log(`Test Company: ${TEST_COMPANY}`);
console.log(`Base URL: ${BASE_URL}`);
console.log('');

async function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testCheckoutCreation() {
  console.log('📝 STEP 1: Creating checkout session...');
  
  const response = await makeRequest('POST', '/api/stripe/create-checkout-session', {
    company: TEST_COMPANY,
    plan: 'starter',
    email: `test-${TEST_COMPANY}@example.com`,
  });

  if (response.status === 200 && response.body.url) {
    console.log(`✅ Checkout session created: ${response.body.sessionId || 'unknown'}`);
    console.log(`   Livemode: ${response.body.livemode ? 'live' : 'test'}`);
    console.log(`   URL: ${response.body.url.substring(0, 50)}...`);
    return { success: true, sessionId: response.body.sessionId, url: response.body.url };
  } else {
    console.log(`❌ Checkout creation failed: ${response.status}`);
    console.log(`   Error: ${JSON.stringify(response.body)}`);
    return { success: false, error: response.body };
  }
}

async function testHealthEndpoint() {
  console.log('\n📝 STEP 0: Checking health endpoint...');
  
  const response = await makeRequest('GET', '/api/health');
  
  if (response.status === 200) {
    console.log('✅ Health check passed');
    console.log(`   APIs configured:`, response.body.apis);
    return true;
  } else {
    console.log(`❌ Health check failed: ${response.status}`);
    return false;
  }
}

async function testStripeInitialization() {
  console.log('\n📝 STEP 0.5: Checking Stripe initialization...');
  
  // Check if server logs show Stripe initialization
  // This is a placeholder - actual check would require parsing server logs
  console.log('   (Check server logs for: [Stripe] Initialized in ... mode)');
  return true;
}

async function main() {
  console.log('Starting end-to-end test...\n');

  // Test 0: Health check
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.log('\n❌ Health check failed - server may not be running');
    process.exit(1);
  }

  // Test 0.5: Stripe init (informational)
  await testStripeInitialization();

  // Test 1: Create checkout
  const checkoutResult = await testCheckoutCreation();
  
  if (!checkoutResult.success) {
    console.log('\n❌ Checkout creation failed - cannot continue');
    console.log('\nCommon issues:');
    console.log('  - Missing STRIPE_PRICE_MONTHLY_99 or STRIPE_PRICE_SETUP_399');
    console.log('  - Missing STRIPE_SECRET_KEY or STRIPE_LIVE_SECRET_KEY');
    console.log('  - Server not running on port 3000');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ CHECKOUT CREATION SUCCESSFUL');
  console.log('='.repeat(70));
  console.log('\n📋 NEXT STEPS (Manual):');
  console.log('1. Open the checkout URL in a browser');
  console.log('2. Complete payment with test card: 4242 4242 4242 4242');
  console.log('3. Check server logs for webhook processing');
  console.log('4. Verify Airtable has tenant record');
  console.log('\nExpected webhook log:');
  console.log(`  [Webhook] Received event: checkout.session.completed (id: evt_xxx, livemode: false)`);
  console.log(`  [Airtable] ✅ Tenant "${TEST_COMPANY}" created successfully`);
  console.log('\nCheckout URL:', checkoutResult.url);
}

main().catch(console.error);
