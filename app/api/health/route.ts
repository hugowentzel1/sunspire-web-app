import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables without importing ENV (which would fail at build time)
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      env: {
        AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? '!!' : 'MISSING',
        AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? '!!' : 'MISSING',
        GOOGLE_MAPS: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '!!' : 'MISSING',
        NREL: process.env.NREL_API_KEY ? '!!' : 'MISSING',
        EIA: process.env.EIA_API_KEY ? '!!' : 'MISSING',
        ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '!!' : 'MISSING'
      },
      defaults: {
        DEFAULT_RATE_ESCALATION: process.env.DEFAULT_RATE_ESCALATION || 0.025,
        DEFAULT_OANDM_ESCALATION: process.env.DEFAULT_OANDM_ESCALATION || 0.03,
        DISCOUNT_RATE: process.env.DISCOUNT_RATE || 0.08,
        OANDM_PER_KW_YEAR: process.env.OANDM_PER_KW_YEAR || 15,
        DEFAULT_DEGRADATION_PCT: process.env.DEFAULT_DEGRADATION_PCT || 0.5,
        DEFAULT_LOSSES_PCT: process.env.DEFAULT_LOSSES_PCT || 14,
        DEFAULT_COST_PER_WATT: process.env.DEFAULT_COST_PER_WATT || 3.5
      }
    };
    
    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
