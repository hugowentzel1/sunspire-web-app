import { NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Check environment variables
  const env = {
    AIRTABLE_API_KEY: ENV.AIRTABLE_API_KEY ? '!!' : '❌',
    AIRTABLE_BASE_ID: ENV.AIRTABLE_BASE_ID ? '!!' : '❌',
    GOOGLE_MAPS: ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '!!' : '❌',
    NREL: ENV.NREL_API_KEY ? '!!' : '❌',
    EIA: ENV.EIA_API_KEY ? '!!' : '❌',
    ADMIN_TOKEN: ENV.ADMIN_TOKEN ? '!!' : '❌',
    STRIPE_PRODUCTION_KEY: process.env.STRIPE_PRODUCTION_KEY ? '!!' : '❌',
    STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY ? '!!' : '❌',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '!!' : '❌',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY ? '!!' : '❌',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '!!' : '❌',
  };

  // Default values
  const defaults = {
    DEFAULT_RATE_ESCALATION: ENV.DEFAULT_RATE_ESCALATION.toString(),
    DEFAULT_OANDM_ESCALATION: ENV.DEFAULT_OANDM_ESCALATION.toString(),
    DISCOUNT_RATE: ENV.DISCOUNT_RATE.toString(),
    OANDM_PER_KW_YEAR: ENV.OANDM_PER_KW_YEAR.toString(),
    DEFAULT_DEGRADATION_PCT: ENV.DEFAULT_DEGRADATION_PCT.toString(),
    DEFAULT_LOSSES_PCT: ENV.DEFAULT_LOSSES_PCT.toString(),
    DEFAULT_COST_PER_WATT: ENV.DEFAULT_COST_PER_WATT.toString(),
  };

  return NextResponse.json({
    ok: true,
    timestamp,
    env,
    defaults,
  });
}
