import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check - in production you'd ping KV here
    return NextResponse.json({ 
      ok: true, 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Health check failed' 
    }, { status: 500 });
  }
}