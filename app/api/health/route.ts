import { NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';

interface HealthCheck {
  service: string;
  status: 'ok' | 'degraded' | 'down';
  latency?: number;
  error?: string;
}

async function checkService(
  name: string,
  checkFn: () => Promise<void>,
  timeoutMs = 5000,
): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await Promise.race([
      checkFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs),
      ),
    ]);
    const latency = Date.now() - start;
    return {
      service: name,
      status: latency < 2000 ? 'ok' : 'degraded',
      latency,
    };
  } catch (error) {
    return {
      service: name,
      status: 'down',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET() {
  const checks: HealthCheck[] = [];
  const overallStatus: { ok: boolean; timestamp: string; services: HealthCheck[] } = {
    ok: true,
    timestamp: new Date().toISOString(),
    services: [],
  };

  // Check Airtable connectivity
  if (ENV.AIRTABLE_API_KEY && ENV.AIRTABLE_BASE_ID) {
    const airtableCheck = await checkService('airtable', async () => {
      // Simple connectivity check - try to access base metadata
      const Airtable = require('airtable');
      const base = new Airtable({ apiKey: ENV.AIRTABLE_API_KEY }).base(ENV.AIRTABLE_BASE_ID);
      // This will fail fast if credentials are invalid
      await base('Tenants').select({ maxRecords: 1 }).firstPage();
    });
    checks.push(airtableCheck);
  } else {
    checks.push({ service: 'airtable', status: 'down', error: 'Missing credentials' });
  }

  // Check Stripe connectivity
  if (ENV.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY) {
    const stripeCheck = await checkService('stripe', async () => {
      const { getStripe } = await import('@/src/lib/stripe');
      const stripe = getStripe();
      // Simple API call to verify connectivity
      await stripe.balance.retrieve();
    });
    checks.push(stripeCheck);
  } else {
    checks.push({ service: 'stripe', status: 'down', error: 'Missing credentials' });
  }

  // Check NREL API (PVWatts)
  if (ENV.NREL_API_KEY) {
    const nrelCheck = await checkService('nrel', async () => {
      const response = await fetch(
        `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${ENV.NREL_API_KEY}&lat=40.7128&lon=-74.0060&system_capacity=4&azimuth=180&tilt=20&array_type=1&module_type=0&losses=14`,
        { method: 'GET', signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok) throw new Error(`NREL API returned ${response.status}`);
    });
    checks.push(nrelCheck);
  } else {
    checks.push({ service: 'nrel', status: 'down', error: 'Missing API key' });
  }

  // Check EIA API
  if (ENV.EIA_API_KEY) {
    const eiaCheck = await checkService('eia', async () => {
      const response = await fetch(
        `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${ENV.EIA_API_KEY}&frequency=monthly&data[0]=price&length=1`,
        { method: 'GET', signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok) throw new Error(`EIA API returned ${response.status}`);
    });
    checks.push(eiaCheck);
  } else {
    checks.push({ service: 'eia', status: 'down', error: 'Missing API key' });
  }

  // Check Resend (if configured)
  if (ENV.RESEND_API_KEY) {
    const resendCheck = await checkService('resend', async () => {
      const response = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: { Authorization: `Bearer ${ENV.RESEND_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error(`Resend API returned ${response.status}`);
    });
    checks.push(resendCheck);
  }

  overallStatus.services = checks;
  overallStatus.ok = checks.every((c) => c.status === 'ok');

  const statusCode = overallStatus.ok ? 200 : 503;
  return NextResponse.json(overallStatus, { status: statusCode });
}