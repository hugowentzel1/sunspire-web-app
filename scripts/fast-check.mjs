#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

let exitCode = 0;

function log(symbol, message) {
  console.log(`${symbol} ${message}`);
}

function fail(message) {
  log('❌', message);
  exitCode = 1;
}

function pass(message) {
  log('✅', message);
}

console.log('\n🚀 Running Fast Check...\n');

// ============================================================================
// PART 1: Environment Variables
// ============================================================================
console.log('📋 Checking required environment variables...');

const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'NREL_API_KEY',
  'EIA_API_KEY',
];

// Optional env vars (warn but don't fail)
const optionalEnvVars = [
  'STRIPE_PRICE_ID',
];

// Load .env.local if it exists
try {
  const envLocalPath = join(rootDir, '.env.local');
  if (existsSync(envLocalPath)) {
    const envContent = readFileSync(envLocalPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      // Trim whitespace and skip comments/empty lines
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const match = trimmed.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  }
} catch (e) {
  // Silent fail - env vars might be set another way
}

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    pass(`${varName} is set`);
  } else {
    fail(`${varName} is missing`);
  }
});

optionalEnvVars.forEach(varName => {
  if (process.env[varName]) {
    pass(`${varName} is set (optional)`);
  } else {
    log('⚠️ ', `${varName} is missing (optional)`);
  }
});

// ============================================================================
// PART 2: Critical Files
// ============================================================================
console.log('\n📁 Checking critical files exist...');

const criticalFiles = [
  'src/lib/checkout.ts',
  'app/page.tsx',
  'app/report/page.tsx',
  'components/Footer.tsx',
];

criticalFiles.forEach(filePath => {
  const fullPath = join(rootDir, filePath);
  if (existsSync(fullPath)) {
    pass(`${filePath} exists`);
  } else {
    fail(`${filePath} is missing`);
  }
});

// ============================================================================
// PART 3: Static Checks
// ============================================================================
console.log('\n🔍 Running static code checks...');

// Check that startCheckout() exists in checkout.ts
try {
  const checkoutPath = join(rootDir, 'src/lib/checkout.ts');
  const checkoutContent = readFileSync(checkoutPath, 'utf-8');
  
  if (checkoutContent.includes('export async function startCheckout')) {
    pass('startCheckout() function exists in src/lib/checkout.ts');
  } else {
    fail('startCheckout() function not found in src/lib/checkout.ts');
  }
  
  if (checkoutContent.includes('export function attachCheckoutHandlers')) {
    pass('attachCheckoutHandlers() function exists in src/lib/checkout.ts');
  } else {
    fail('attachCheckoutHandlers() function not found in src/lib/checkout.ts');
  }
} catch (e) {
  fail(`Error reading checkout.ts: ${e.message}`);
}

// Check that [data-cta="primary"] is bound somewhere
try {
  const checkoutPath = join(rootDir, 'src/lib/checkout.ts');
  const checkoutContent = readFileSync(checkoutPath, 'utf-8');
  
  if (checkoutContent.includes('[data-cta="primary"]')) {
    pass('[data-cta="primary"] selector is referenced in checkout binding');
  } else {
    fail('[data-cta="primary"] selector not found in checkout logic');
  }
} catch (e) {
  fail(`Error checking CTA binding: ${e.message}`);
}

// Check that Footer component uses dynamic branding
try {
  const footerPath = join(rootDir, 'components/Footer.tsx');
  const footerContent = readFileSync(footerPath, 'utf-8');
  
  if (footerContent.includes('useBrandTakeover')) {
    pass('Footer uses useBrandTakeover for dynamic branding');
  } else {
    fail('Footer does not use useBrandTakeover hook');
  }
  
  if (footerContent.includes('b.brand') || footerContent.includes('{b.brand}')) {
    pass('Footer uses dynamic company name');
  } else {
    fail('Footer does not use dynamic company name');
  }
  
  if (footerContent.includes('b.primary')) {
    pass('Footer uses dynamic company color');
  } else {
    fail('Footer does not use dynamic company color');
  }
} catch (e) {
  fail(`Error checking Footer: ${e.message}`);
}

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
if (exitCode === 0) {
  console.log('🎉 All checks passed!');
} else {
  console.log('💥 Some checks failed. Please fix the issues above.');
}
console.log('='.repeat(60) + '\n');

process.exit(exitCode);
