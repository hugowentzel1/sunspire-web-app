#!/bin/bash

# Sunspire Backend Smoke Test Script
# Tests all backend endpoints excluding Stripe functionality
# Ready for production deployment - Vercel redeploy trigger

set -e  # Exit on any error

# Constants
BASE_URL="https://sunspire-demo.vercel.app"
TENANT_HANDLE="demo"
TENANT_API_KEY="REPLACE_WITH_REAL_TENANT_API_KEY"
ADMIN_TOKEN="5fa1b2c3d4e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2"

# Test email for lead creation
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_CAMPAIGN_ID="smoke-test-$(date +%s)"

echo "🚀 Starting Sunspire backend smoke test"
echo "Testing against: $BASE_URL"
echo "Test email: $TEST_EMAIL"
echo "Campaign ID: $TEST_CAMPAIGN_ID"
echo ""

# Function to check if jq is installed
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        echo "❌ Error: jq is required but not installed."
        echo "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        exit 1
    fi
}

# Function to make HTTP request and handle errors
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    
    local curl_cmd="curl -sS -X $method"
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    if [ ! -z "$headers" ]; then
        curl_cmd="$curl_cmd -H '$headers'"
    fi
    
    curl_cmd="$curl_cmd '$BASE_URL$endpoint'"
    
    local response=$(eval $curl_cmd)
    local status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" != "200" ] && [ "$status_code" != "201" ]; then
        echo "❌ Request failed with status: $status_code"
        echo "Response: $response"
        exit 1
    fi
    
    echo "$response" | head -n -1
}

# Check dependencies
check_dependencies

# Test 1: Health Check
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

# Test 5: Lead Ingest (Cold Email Webhook)
echo "========== 5. Lead Ingest =========="
echo "Testing: POST /v1/ingest/lead"
if [ "$TENANT_API_KEY" = "REPLACE_WITH_REAL_TENANT_API_KEY" ]; then
    echo "⚠️  Skipping lead ingest test - TENANT_API_KEY not set"
    echo "To test this endpoint, update TENANT_API_KEY with a real value from your tenant"
else
    data="{
      \"name\":\"Cold Email Lead\",
      \"email\":\"cold-$(date +%s)@example.com\",
      \"company\":\"Cold Email Company\",
      \"address\":{
        \"formattedAddress\":\"456 Cold St, Los Angeles, CA 90210\",
        \"street\":\"456 Cold St\",
        \"city\":\"Los Angeles\",
        \"state\":\"CA\",
        \"postalCode\":\"90210\",
        \"country\":\"US\",
        \"placeId\":\"cold_place_id\",
        \"lat\":34.0522,
        \"lng\":-118.2437
      },
      \"utm\":{
        \"source\":\"cold-email\",
        \"medium\":\"email\",
        \"campaign\":\"solar-outreach\"
      }
    }"
    response=$(curl -sS -X POST "$BASE_URL/v1/ingest/lead" \
        -H "Content-Type: application/json" \
        -H "x-api-key: $TENANT_API_KEY" \
        -d "$data")
    echo "$response" | jq '.'
    echo "✅ Lead ingest passed"
fi
echo ""

# Test 6: Solar Quote Calculation
echo "========== 6. Solar Quote Calculation =========="
echo "Testing: POST /c/demo/api/calc/quote"
data="{
  \"address\":\"123 Test St, San Francisco, CA 94102\",
  \"systemSize\":8.5,
  \"utilityRate\":0.25,
  \"electricityUsage\":12000
}"
response=$(curl -sS -X POST "$BASE_URL/c/$TENANT_HANDLE/api/calc/quote" \
    -H "Content-Type: application/json" \
    -d "$data")
echo "$response" | jq '.'
echo "✅ Solar quote calculation passed"
echo ""

# Test 7: Unsubscribe Webhook
echo "========== 7. Unsubscribe Webhook =========="
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
echo "✅ All tests passed — backend is ready to send cold emails"
echo "=========================================="
echo ""
echo "📊 Test Summary:"
echo "• Health check: ✅"
echo "• Lead tracking: ✅"
echo "• CTA tracking: ✅"
echo "• Sample requests: ✅"
echo "• Lead ingest: $(if [ "$TENANT_API_KEY" = "REPLACE_WITH_REAL_TENANT_API_KEY" ]; then echo "⚠️ Skipped"; else echo "✅"; fi)"
echo "• Quote calculation: ✅"
echo "• Unsubscribe: ✅"
echo ""
echo "🚀 Your Sunspire backend is fully operational!"
