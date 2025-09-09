# Sunspire E2E Testing Guide

This document explains how to run end-to-end tests against the live Sunspire deployment to verify demo vs paid mode functionality.

## Setup

### 1. Install Playwright

```bash
npm i -D @playwright/test
npx playwright install
```

### 2. Set Environment Variables

```bash
# Set the live base URL (defaults to Vercel deployment)
export LIVE_BASE="https://sunspire-web-app.vercel.app"

# Set a paid tenant slug for testing (must exist in Airtable with demo=false)
export QA_TENANT_SLUG="qa-acme"
```

### 3. Create QA Tenant

Before running paid mode tests, ensure you have a tenant in Airtable with:
- **Slug**: `qa-acme` (or whatever you set in `QA_TENANT_SLUG`)
- **Demo**: `false`
- **Status**: `active`

## Running Tests

### Run All Tests

```bash
npx playwright test tests/e2e.sunspire.spec.ts --reporter=list
```

### Run Specific Test Suites

```bash
# Demo tests only
npx playwright test tests/e2e.sunspire.spec.ts --grep "DEMO experience"

# Paid tests only  
npx playwright test tests/e2e.sunspire.spec.ts --grep "PAID experience"

# Edge cases
npx playwright test tests/e2e.sunspire.spec.ts --grep "Edge cases"
```

### Run with Debug Mode

```bash
npx playwright test tests/e2e.sunspire.spec.ts --debug
```

## Test Scenarios

### Demo Mode (`?demo=1` or `?demo=true`)

**Homepage (`/?company=testco&demo=1`)**:
- ✅ Shows "Activate on Your Domain" CTA
- ✅ Shows demo quota counter ("Preview: X runs left")
- ✅ Shows countdown timer
- ✅ Shows "How It Works" section
- ✅ Shows FAQ section
- ✅ Footer shows marketing links (Pricing, Partners, Demo)

**Report Page (`/report?company=testco&demo=1&address=...`)**:
- ✅ Shows "Ready to Launch Your Branded Tool?" section
- ✅ Shows "Unlock Full Report" and "Activate on Your Domain" CTAs
- ✅ Shows demo quota counter
- ✅ Shows "Demo for {Company}" watermark

### Paid Mode (`?company=slug` without demo param)

**Homepage (`/?company=qa-acme`)**:
- ❌ NO "Activate on Your Domain" CTA
- ❌ NO demo quota counter
- ❌ NO countdown timer
- ❌ NO "How It Works" section
- ❌ NO FAQ section
- ✅ Shows "✅ Live for {TenantName}. Leads now save to your CRM." bar
- ❌ Footer does NOT show marketing links

**Report Page (`/report?company=qa-acme&address=...`)**:
- ❌ NO "Ready to Launch Your Branded Tool?" section
- ❌ NO "Unlock Full Report" CTAs
- ❌ NO demo quota counter
- ❌ NO "Demo for {Company}" watermark
- ✅ Shows "✅ Live for {TenantName}. Leads now save to your CRM." bar

### Edge Cases

- `?company=testco` (no demo param) → **Paid mode**
- `?company=testco&demo=0` → **Paid mode**
- `?company=testco&demo=false` → **Paid mode**
- `?company=testco&demo=1` → **Demo mode**
- `?company=testco&demo=true` → **Demo mode**

## Troubleshooting

### Common Issues

1. **Tests fail with "Live for" not found**
   - Ensure `QA_TENANT_SLUG` is set to a valid tenant
   - Verify the tenant exists in Airtable with `demo=false`

2. **Tests fail with "Demo" elements still showing**
   - Check that the URL has `demo=1` or `demo=true` for demo tests
   - Verify the tenant has `demo=false` for paid tests

3. **Network timeouts**
   - Increase timeout: `npx playwright test --timeout=60000`
   - Check if the live site is accessible

### Debug Commands

```bash
# Run with headed browser to see what's happening
npx playwright test tests/e2e.sunspire.spec.ts --headed

# Run with slow motion
npx playwright test tests/e2e.sunspire.spec.ts --slow-mo=1000

# Run specific test
npx playwright test tests/e2e.sunspire.spec.ts -g "shows demo CTAs"
```

## Expected Test Results

All tests should pass when:
1. Demo mode correctly shows all demo elements and hides paid elements
2. Paid mode correctly shows all paid elements and hides demo elements
3. Edge cases are handled properly
4. Footer marketing links are conditionally rendered

## CI/CD Integration

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Run E2E Tests
  run: |
    export LIVE_BASE="https://sunspire-web-app.vercel.app"
    export QA_TENANT_SLUG="qa-acme"
    npx playwright test tests/e2e.sunspire.spec.ts --reporter=github
```
