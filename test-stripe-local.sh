#!/bin/bash

echo "🧪 Testing Stripe Checkout Locally"
echo "=================================="

# Test the checkout endpoint
echo "🔍 Testing /api/stripe/create-checkout-session..."
curl -sS -X POST "http://localhost:3000/api/stripe/create-checkout-session" \
  -H "Content-Type: application/json" \
  -d '{
    "companyHandle": "test-company",
    "plan": "Starter",
    "payerEmail": "test@example.com"
  }' | jq

echo ""
echo "✅ Test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your local server is running: npm run dev"
echo "2. Add STRIPE_SECRET_KEY to .env.local with your test key"
echo "3. Run: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "4. In another terminal: stripe trigger checkout.session.completed"
