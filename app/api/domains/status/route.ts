import { NextResponse } from 'next/server';
import { getTenantByHandle, updateTenantDomain, setTenantDomainStatus, TENANT_FIELDS } from '@/src/lib/airtable';
import { ENV } from '@/src/config/env';

const PID = ENV.VERCEL_PROJECT_ID!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantHandle = url.searchParams.get('tenant');
    
    if (!tenantHandle) {
      return NextResponse.json({ ok: false, error: 'tenant parameter is required' }, { status: 400 });
    }

    if (!ENV.VERCEL_TOKEN || !ENV.VERCEL_PROJECT_ID) {
      return NextResponse.json({ ok: false, error: 'Vercel configuration missing' }, { status: 500 });
    }

    const tenant = await getTenantByHandle(tenantHandle);
    if (!tenant?.[TENANT_FIELDS.REQUESTED_DOMAIN]) {
      return NextResponse.json({ ok: false, error: 'no_requested_domain' }, { status: 400 });
    }

    const name = tenant[TENANT_FIELDS.REQUESTED_DOMAIN]!;
    const r = await fetch(`https://api.vercel.com/v9/projects/${PID}/domains/${encodeURIComponent(name)}`, { 
      headers: { Authorization: `Bearer ${ENV.VERCEL_TOKEN}` } 
    });
    
    const j = await r.json();
    const verified = !!j.verified;
    
    if (verified) { 
      await updateTenantDomain(tenantHandle, `https://${name}`); 
      await setTenantDomainStatus(tenantHandle, 'live'); 
    }
    
    return NextResponse.json({ verified, raw: j });
  } catch (error) {
    console.error('Error checking domain status:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}