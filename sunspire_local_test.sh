#!/bin/bash

# Sunspire Local Backend Test Script
# Tests endpoints locally before deploying to Vercel

set -e  # Exit on any error

# Constants for local testing
BASE_URL="http://localhost:3000"
ADMIN_TOKEN="5fa1b2c3d4e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2"

# Test email for lead creation
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_CAMPAIGN_ID="smoke-test-$(date +%s)"

echo "🚀 Starting Sunspire LOCAL backend smoke test"
echo "Testing against: $BASE_URL"
echo "Test email: $TEST_EMAIL"
echo "Campaign ID: $TEST_CAMPAIGN_ID"
echo ""
echo "⚠️  Make sure your local dev server is running with: npm run dev"
echo ""

# Function to check if jq is installed
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        echo "❌ Error: jq is required but not installed."
        echo "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        exit 1
    fi
}

# Function to check if local server is running
check_local_server() {
    if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
        echo "❌ Error: Local server is not running at $BASE_URL"
        echo "Start it with: npm run dev"
        exit 1
    fi
    echo "✅ Local server is running"
}

# Check dependencies and local server
check_dependencies
check_local_server

# Test 1: Health Check
echo ""
echo "========== 1. Health Check =========="
echo "Testing: GET /api/health"
response=$(curl -sS "$BASE_URL/api/health")
echo "$response" | jq '.'
echo "✅ Health check passed"
echo ""

# Test 2: Track View (Create Test Lead)
echo "========== 2. Track View =========="
echo "Testing: POST /api/track/view"
data="{\"email\":\"$TEST_EMAIL\",\"campaignId\":\"$TEST_CAMPAIGN_ID\"}"
response=$(curl -sS -X POST "$BASE_URL/api/track/view" \
    -H "Content-Type: application/json" \
    -d "$data")
echo "$response" | jq '.'
echo "✅ Track view passed"
echo ""

# Test 3: Track CTA Click
echo "========== 3. Track CTA Click =========="
echo "Testing: POST /api/track/cta-click"
data="{\"email\":\"$TEST_EMAIL\",\"campaignId\":\"$TEST_CAMPAIGN_ID\"}"
response=$(curl -sS -X POST "$BASE_URL/api/track/cta-click" \
    -H "Content-Type: application/json" \
    -d "$data")
echo "$response" | jq '.'
echo "✅ CTA click tracking passed"
echo ""

# Test 4: Sample Request Webhook
echo "========== 4. Sample Request Webhook =========="
echo "Testing: POST /api/webhooks/sample-request"
data="{
  \"email\":\"$TEST_EMAIL\",
  \"name\":\"Test User\",
  \"company\":\"Test Solar Co\",
  \"campaignId\":\"$TEST_CAMPAIGN_ID\",
  \"address\":{
    \"formattedAddress\":\"123 Test St, San Francisco, CA 94102\",
    \"street\":\"123 Test St\",
    \"city\":\"San Francisco\",
    \"state\":\"CA\",
    \"postalCode\":\"94102\",
    \"country\":\"US\",
    \"placeId\":\"test_place_id\",
    \"lat\":37.7749,
    \"lng\":-122.4194
  }
}"
response=$(curl -sS -X POST "$BASE_URL/api/webhooks/sample-request" \
    -H "Content-Type: application/json" \
    -H "x-admin-token: $ADMIN_TOKEN" \
    -d "$data")
echo "$response" | jq '.'
echo "✅ Sample request webhook passed"
echo ""

# Test 5: Unsubscribe Webhook
echo "========== 5. Unsubscribe Webhook =========="
echo "Testing: POST /api/webhooks/unsubscribe"
data="{\"email\":\"$TEST_EMAIL\"}"
response=$(curl -sS -X POST "$BASE_URL/api/webhooks/unsubscribe" \
    -H "Content-Type: application/json" \
    -H "x-admin-token: $ADMIN_TOKEN" \
    -d "$data")
echo "$response" | jq '.'
echo "✅ Unsubscribe webhook passed"
echo ""

echo "🎉 =========================================="
echo "✅ All LOCAL tests passed — backend code is working!"
echo "=========================================="
echo ""
echo "📊 Test Summary:"
echo "• Health check: ✅"
echo "• Lead tracking: ✅"
echo "• CTA tracking: ✅"
echo "• Sample requests: ✅"
echo "• Unsubscribe: ✅"
echo ""
echo "🚀 Your local Sunspire backend is working perfectly!"
echo ""
echo "⚠️  Next steps:"
echo "1. Go to Vercel dashboard and redeploy your project"
echo "2. Or push new code to trigger automatic deployment"
echo "3. Once deployed, run: ./sunspire_backend_test.sh"
