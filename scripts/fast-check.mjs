#!/usr/bin/env node
/**
 * Fast Check - Verifies critical env vars and files exist
 * Part C of Sunspire upgrade requirements
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from .env.local if it exists
const envPath = join(projectRoot, '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !line.trim().startsWith('#')) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'NREL_API_KEY',
  'EIA_API_KEY',
];

// At least one of these Stripe price vars should exist
const STRIPE_PRICE_VARS = [
  'STRIPE_PRICE_ID',
  'STRIPE_PRICE_STARTER', 
  'STRIPE_PRICE_MONTHLY',
  'STRIPE_PRICE_MONTHLY_99',
];

// Critical files that must exist
const CRITICAL_FILES = [
  'src/lib/checkout.ts',
  'app/page.tsx',
  'app/report/page.tsx',
  'components/Footer.tsx',
];

let hasErrors = false;

console.log('🔍 Running Fast Check...\n');

// Check environment variables
console.log('📋 Checking Environment Variables:');
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.log(`❌ Missing: ${envVar}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${envVar}`);
  }
}

// Check for at least one Stripe price variable (optional - warn only)
const hasStripePriceVar = STRIPE_PRICE_VARS.some(v => process.env[v]);
if (hasStripePriceVar) {
  const foundVars = STRIPE_PRICE_VARS.filter(v => process.env[v]);
  console.log(`✅ Found Stripe Price: ${foundVars.join(', ')}`);
} else {
  console.log(`⚠️  Warning: No Stripe Price ID found (one of ${STRIPE_PRICE_VARS.join(', ')})`);
  console.log(`   Checkout may use fallback prices`);
}

console.log('\n📁 Checking Critical Files:');
for (const file of CRITICAL_FILES) {
  const filePath = join(projectRoot, file);
  if (!existsSync(filePath)) {
    console.log(`❌ Missing: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

// Static checks
console.log('\n🔎 Running Static Checks:');

// Check 1: startCheckout exists in checkout.ts
try {
  const checkoutPath = join(projectRoot, 'src/lib/checkout.ts');
  const checkoutContent = readFileSync(checkoutPath, 'utf-8');
  
  if (checkoutContent.includes('export async function startCheckout')) {
    console.log('✅ startCheckout() function found in src/lib/checkout.ts');
  } else {
    console.log('❌ startCheckout() function not found in src/lib/checkout.ts');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Error reading src/lib/checkout.ts:', error.message);
  hasErrors = true;
}

// Check 2: data-cta="primary" selector exists
try {
  const pageContent = readFileSync(join(projectRoot, 'app/page.tsx'), 'utf-8');
  
  if (pageContent.includes('data-cta="primary"') || pageContent.includes('attachCheckoutHandlers')) {
    console.log('✅ Primary CTA binding logic found');
  } else {
    console.log('❌ Primary CTA binding logic not found (missing data-cta="primary" or attachCheckoutHandlers)');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Error checking CTA binding:', error.message);
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Fast Check FAILED - Please fix the errors above');
  process.exit(1);
} else {
  console.log('✅ Fast Check PASSED - All checks successful!');
  process.exit(0);
}
