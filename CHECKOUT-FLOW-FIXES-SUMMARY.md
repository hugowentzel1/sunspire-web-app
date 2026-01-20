# Checkout Flow Fixes - Summary

## Changes Made

### Step A: Enforce One Stripe Mode ✅

**File:** `src/lib/stripe.ts`

**Changes:**
- Enforces single canonical mode: `STRIPE_LIVE_SECRET_KEY` (production) or `STRIPE_SECRET_KEY` (test/dev)
- Priority: Live key takes precedence
- Startup logging: `[Stripe] Initialized in {live|test} mode using {KEY_NAME}`
- No secrets logged, only mode and key name

**Before:** Used fallback `STRIPE_SECRET_KEY || STRIPE_LIVE_SECRET_KEY` with no logging
**After:** Explicit mode selection with startup log

---

### Step B: Hard Fail on Missing Price IDs ✅

**File:** `app/api/stripe/create-checkout-session/route.ts`

**Changes:**
- Removed silent fallback through 3 different env vars
- Hard fail with clear error message if monthly price missing/empty
- Hard fail with clear error message if setup price missing/empty
- Logs which price IDs are being used (safe - only first 8 chars)

**Before:** Silent fallback, could use wrong price
**After:** Explicit error if price IDs missing, logs which ones are used

**Error Response:**
```json
{
  "error": "Stripe monthly price ID is missing or empty. Set STRIPE_PRICE_STARTER, STRIPE_PRICE_MONTHLY, or STRIPE_PRICE_MONTHLY_99",
  "required": ["STRIPE_PRICE_STARTER | STRIPE_PRICE_MONTHLY | STRIPE_PRICE_MONTHLY_99"]
}
```

---

### Step C: Webhook Reliability & Logging ✅

**File:** `app/api/stripe/webhook/route.ts`

**Changes:**
1. **Enhanced Logging:**
   - Logs: `event.id`, `event.type`, `livemode` on receipt
   - Logs side effects: Airtable upsert success/failure, email success/failure
   - Logs processing duration
   - Structured log format: `[Webhook]`, `[CheckoutCompleted]`, `[Airtable]`

2. **Error Handling:**
   - Always returns `200` for successfully processed events
   - Returns `500` with error details if processing fails (so Stripe retries)
   - Idempotent events return `200` with `idempotent: true`

3. **Response Format:**
   - Success: `{ received: true, eventId, eventType, livemode }`
   - Error: `{ error: "...", eventId, eventType }`

4. **Admin Replay Endpoint:**
   - New route: `GET /api/admin/replay-webhook?event_id=evt_xxx`
   - Protected by `x-admin-token` header
   - Fetches event from Stripe and reprocesses it
   - Useful for recovery when webhook fails

**Before:** Minimal logging, unclear error responses
**After:** Comprehensive logging, clear success/failure tracking

---

### Step D: Airtable Error Handling ✅

**File:** `src/lib/airtable.ts` (function: `upsertTenantByHandle`)

**Changes:**
1. **Enhanced Logging:**
   - Logs tenant handle being upserted
   - Logs Airtable base ID presence (safe - only first 8 chars)
   - Logs whether creating new or updating existing
   - Logs success with tenant ID

2. **Error Bubbling:**
   - Errors are re-thrown (not swallowed)
   - Webhook handler catches and returns 500, triggering Stripe retry

**Before:** Errors logged but unclear what happened
**After:** Clear logging at each step, errors bubble up properly

---

### Step E: Test Script ✅

**File:** `test-checkout-flow.md`

**Created comprehensive test guide:**
- Prerequisites checklist
- Step-by-step test instructions
- Expected log patterns
- Success/failure indicators
- Admin replay endpoint usage

---

## Key Log Patterns to Look For

### ✅ Success Pattern:
```
[Stripe] Initialized in test mode using STRIPE_SECRET_KEY
[Checkout] Using price IDs - Monthly: price_xxx..., Setup: price_yyy...
✅ Stripe checkout session created: cs_test_xxx (mode: test)
[Webhook] Received event: checkout.session.completed (id: evt_xxx, livemode: false)
[CheckoutCompleted] Processing session: cs_test_xxx (livemode: false)
[Airtable] Upserting tenant: "test-company" in base: appxxx...
[Airtable] ✅ Tenant "test-company" created successfully (ID: recxxx)
[CheckoutCompleted] ✅ Airtable upsert successful - tenant ID: recxxx
[Webhook] Airtable upsert: ✅ success
[Webhook] Event evt_xxx processed successfully in XXXms
```

### ❌ Failure Patterns:

**Missing Price ID:**
```
❌ Stripe monthly price ID is missing or empty...
```

**Airtable Failure:**
```
[Airtable] ❌ Error upserting tenant "test-company": ...
[Webhook] Handler error for evt_xxx: Airtable upsert failed: ...
```

**Missing Company Metadata:**
```
[CheckoutCompleted] Missing or empty company metadata in checkout session
```

---

## What to Test

1. **Create checkout session** - Should log Stripe mode and price IDs
2. **Complete payment** - Should trigger webhook
3. **Check webhook logs** - Should show event received, Airtable success, email success
4. **Verify Airtable** - Should have new tenant record
5. **Check Stripe dashboard** - Webhook delivery should show "Succeeded"

---

## Next Steps

1. Run the test flow from `test-checkout-flow.md`
2. Paste the 3 key logs here:
   - Webhook received log (with livemode)
   - Airtable upsert success/failure log
   - Confirmation that Airtable has the record
3. If all 3 are good → system is working
4. If any fail → I'll provide exact fix
