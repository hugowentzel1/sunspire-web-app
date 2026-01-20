#!/bin/bash

# Verify Checkout Flow - Complete Test Script
# This script verifies all the fixes are in place

echo "=========================================="
echo "CHECKOUT FLOW VERIFICATION"
echo "=========================================="
echo ""

# Check 1: Stripe initialization has logging
echo "✓ Check 1: Stripe initialization logging"
if grep -q "Initialized in.*mode using" src/lib/stripe.ts; then
  echo "  ✅ Stripe mode logging found"
else
  echo "  ❌ Stripe mode logging missing"
fi

# Check 2: Hard fail on missing price IDs
echo ""
echo "✓ Check 2: Hard fail on missing price IDs"
if grep -q "is missing or empty" app/api/stripe/create-checkout-session/route.ts; then
  echo "  ✅ Hard fail on missing prices implemented"
else
  echo "  ❌ Hard fail not implemented"
fi

# Check 3: Webhook logging
echo ""
echo "✓ Check 3: Webhook logging"
if grep -q "\[Webhook\] Received event:" app/api/stripe/webhook/route.ts; then
  echo "  ✅ Webhook event logging found"
else
  echo "  ❌ Webhook event logging missing"
fi

if grep -q "livemode:" app/api/stripe/webhook/route.ts; then
  echo "  ✅ Livemode logging found"
else
  echo "  ❌ Livemode logging missing"
fi

# Check 4: Airtable logging
echo ""
echo "✓ Check 4: Airtable logging"
if grep -q "\[Airtable\] Upserting tenant:" src/lib/airtable.ts; then
  echo "  ✅ Airtable logging found"
else
  echo "  ❌ Airtable logging missing"
fi

# Check 5: Admin replay endpoint
echo ""
echo "✓ Check 5: Admin replay endpoint"
if [ -f "app/api/admin/replay-webhook/route.ts" ]; then
  echo "  ✅ Admin replay endpoint exists"
else
  echo "  ❌ Admin replay endpoint missing"
fi

# Check 6: Error bubbling in Airtable
echo ""
echo "✓ Check 6: Error bubbling"
if grep -q "throw error" src/lib/airtable.ts | grep -v "//"; then
  echo "  ✅ Errors bubble up properly"
else
  echo "  ❌ Errors may be swallowed"
fi

# Check 7: Missing company metadata throws error
echo ""
echo "✓ Check 7: Missing company metadata handling"
if grep -q "throw new Error.*company.*metadata" app/api/stripe/webhook/route.ts; then
  echo "  ✅ Missing company throws error (not silent return)"
else
  echo "  ❌ Missing company may return silently"
fi

echo ""
echo "=========================================="
echo "VERIFICATION COMPLETE"
echo "=========================================="
