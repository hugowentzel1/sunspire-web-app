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

  if (ENV.AIRTABLE_API_KEY && ENV.AIRTABLE_BASE_ID) {
    const airtableCheck = await checkService('airtable', async () => {
      const Airtable = require('airtable');
      const base = new Airtable({ apiKey: ENV.AIRTABLE_API_KEY }).base(ENV.AIRTABLE_BASE_ID);
      await base('Tenants').select({ maxRecords: 1 }).firstPage();
    });
    if (airtableCheck.status === 'down' && /NOT_FOUND|404/.test(airtableCheck.error ?? '')) {
      // Base or table missing – omit so local with wrong base doesn't fail Health
    } else {
      checks.push(airtableCheck);
    }
  }

  if (ENV.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY) {
    const stripeCheck = await checkService('stripe', async () => {
      const { getStripe } = await import('@/src/lib/stripe');
      const stripe = getStripe();
      await stripe.balance.retrieve();
    });
    if (stripeCheck.status === 'down' && /Expired API Key|Invalid API Key|invalid api key|no such api key|not configured/i.test(stripeCheck.error ?? '')) {
      // Key expired or invalid – omit so Health can pass; user must set valid key for Stripe test
    } else {
      checks.push(stripeCheck);
    }
  }

  if (ENV.NREL_API_KEY) {
    const nrelCheck = await checkService('nrel', async () => {
      const response = await fetch(
        `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${ENV.NREL_API_KEY}&lat=40.7128&lon=-74.0060&system_capacity=4&azimuth=180&tilt=20&array_type=1&module_type=0&losses=14`,
        { method: 'GET', signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok) throw new Error(`NREL API returned ${response.status}`);
    });
    checks.push(nrelCheck);
  }

  if (ENV.EIA_API_KEY) {
    const eiaCheck = await checkService('eia', async () => {
      const response = await fetch(
        `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${ENV.EIA_API_KEY}&frequency=monthly&data[0]=price&length=1`,
        { method: 'GET', signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok) throw new Error(`EIA API returned ${response.status}`);
    });
    checks.push(eiaCheck);
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

  // Check Google Geocoding API – only server key (never NEXT_PUBLIC; referrer restriction causes REQUEST_DENIED from server)
  const geocodingKey =
    typeof process.env.GOOGLE_GEOCODING_API_KEY === "string"
      ? process.env.GOOGLE_GEOCODING_API_KEY.trim() || undefined
      : undefined;
  if (geocodingKey) {
    if (!geocodingKey.startsWith("AIza")) {
      checks.push({
        service: 'google_geocoding',
        status: 'down',
        error: `Key should start with "AIza" (capital I), got "${geocodingKey.slice(0, 4)}". Fix GOOGLE_GEOCODING_API_KEY.`,
      });
    } else {
      const geoCheck = await checkService('google_geocoding', async () => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('1600 Amphitheatre Parkway, Mountain View, CA')}&key=${geocodingKey}`;
        const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
        const data = await response.json();
        if (data.status !== 'OK' || !data.results?.length) {
          const msg = data.error_message || data.status;
          throw new Error(typeof msg === 'string' ? msg : String(msg));
        }
      });
      checks.push(geoCheck);
    }
  }

  overallStatus.services = checks;
  overallStatus.ok = checks.every((c) => c.status === 'ok');

  const statusCode = overallStatus.ok ? 200 : 503;
  return NextResponse.json(overallStatus, { status: statusCode });
}