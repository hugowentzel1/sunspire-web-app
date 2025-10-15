import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    ok: true,
    timestamp: new Date().toISOString(),
    apis: {
      nrel: !!process.env.NREL_API_KEY,
      openei: !!process.env.OPENEI_API_KEY,
      airtable: !!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID),
      stripe: !!process.env.STRIPE_SECRET_KEY
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };
  
  return NextResponse.json(checks);
}