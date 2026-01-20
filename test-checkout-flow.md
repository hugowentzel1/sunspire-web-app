# Test Checkout Flow - Step by Step

## Prerequisites

1. **Stripe Test Mode Setup:**
   - Set `STRIPE_SECRET_KEY` (test mode key starting with `sk_test_`)
   - Set `STRIPE_WEBHOOK_SECRET` (test webhook secret)
   - Set `STRIPE_PRICE_MONTHLY_99` (test price ID)
   - Set `STRIPE_PRICE_SETUP_399` (test setup price ID)

2. **Airtable Setup:**
   - Set `AIRTABLE_API_KEY`
   - Set `AIRTABLE_BASE_ID`
   - Ensure "Tenants" table exists with required fields

3. **Email Setup (Optional):**
   - Set `SMTP_USER` and `SMTP_PASS` for email testing

## Test Steps

### 1. Start the dev server
```bash
npm run dev
```

### 2. Create a test checkout session

**Option A: Using curl**
```bash
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "company": "test-company-123",
    "plan": "starter",
    "email": "test@example.com"
  }'
```

**Option B: Using the UI**
- Navigate to http://localhost:3000
- Enter an address
- Click checkout button

### 3. Complete the checkout in Stripe

- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC
- Complete the payment

### 4. Check the logs

**Expected logs in order:**

1. **Checkout creation:**
```
[Stripe] Initialized in test mode using STRIPE_SECRET_KEY
[Checkout] Using price IDs - Monthly: price_xxx..., Setup: price_yyy...
✅ Stripe checkout session created: cs_test_xxx (mode: test)
```

2. **Webhook received:**
```
[Webhook] Received event: checkout.session.completed (id: evt_xxx, livemode: false)
[CheckoutCompleted] Processing session: cs_test_xxx (livemode: false)
[CheckoutCompleted] Customer email: test@example.com
[CheckoutCompleted] Airtable config check: { hasApiKey: true, hasBaseId: true, baseIdPrefix: 'appxxx...' }
[Airtable] Upserting tenant: "test-company-123" in base: appxxx...
[Airtable] Tenant "test-company-123" not found, creating new record...
[Airtable] ✅ Tenant "test-company-123" created successfully (ID: recxxx)
[CheckoutCompleted] ✅ Airtable upsert successful - tenant ID: recxxx
[CheckoutCompleted] ✅ Onboarding email sent to: test@example.com
[CheckoutCompleted] ✅ Tenant provisioned successfully: test-company-123
[Webhook] Airtable upsert: ✅ success
[Webhook] Email send: ✅ success
[Webhook] Event evt_xxx processed successfully in XXXms
```

### 5. Verify in Airtable

- Open Airtable base
- Check "Tenants" table
- Should see record with "Company Handle" = "test-company-123"
- Fields should be populated: Plan, Payment Status: "Paid", API Key, etc.

### 6. Verify in Stripe Dashboard

- Go to Stripe Dashboard → Webhooks
- Check latest delivery for `checkout.session.completed`
- Should show "Succeeded" status
- Response should be `{ received: true, eventId: "evt_xxx", eventType: "checkout.session.completed", livemode: false }`

## What to Check

### ✅ Success Indicators

1. **Webhook log shows:**
   - `[Webhook] Received event: checkout.session.completed`
   - `livemode: false` (or `true` for live)
   - `[Webhook] Airtable upsert: ✅ success`
   - `[Webhook] Event evt_xxx processed successfully`

2. **Airtable has record:**
   - New tenant record with "Company Handle" = test company name
   - "Payment Status" = "Paid"
   - "API Key" populated

3. **Stripe webhook delivery:**
   - Status: "Succeeded"
   - Response: 200 OK

### ❌ Failure Indicators

1. **Missing price IDs:**
   - Error: "Stripe monthly price ID is missing or empty"
   - Fix: Set `STRIPE_PRICE_MONTHLY_99` or `STRIPE_PRICE_STARTER`

2. **Webhook signature fails:**
   - Error: "Invalid signature"
   - Fix: Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

3. **Airtable fails:**
   - Error: "Airtable upsert failed: ..."
   - Check: `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are correct
   - Check: "Tenants" table exists with correct field names

4. **Missing company metadata:**
   - Error: "Missing or empty company metadata"
   - Fix: Ensure checkout session includes `company` in metadata

## Admin Replay Endpoint (Recovery)

If webhook fails, you can replay it:

```bash
curl -X GET "http://localhost:3000/api/admin/replay-webhook?event_id=evt_xxx" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

This will:
1. Fetch the event from Stripe
2. Re-process it
3. Return the result

## Expected Log Format

When successful, you should see these exact log patterns:

```
[Webhook] Received event: checkout.session.completed (id: evt_xxx, livemode: false)
[CheckoutCompleted] Processing session: cs_test_xxx (livemode: false)
[Airtable] Upserting tenant: "test-company-123" in base: appxxx...
[Airtable] ✅ Tenant "test-company-123" created successfully (ID: recxxx)
[CheckoutCompleted] ✅ Airtable upsert successful - tenant ID: recxxx
[Webhook] Airtable upsert: ✅ success
[Webhook] Event evt_xxx processed successfully in XXXms
```
