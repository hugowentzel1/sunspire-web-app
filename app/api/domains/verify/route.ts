import { NextResponse } from 'next/server';
import { getTenantByHandle, setTenantDomainStatus, TENANT_FIELDS } from '@/src/lib/airtable';
import { ENV } from '@/src/config/env';

export async function POST(req: Request) {
  try {
    const { tenantHandle } = await req.json();
    
    if (!tenantHandle) {
      return NextResponse.json({ ok: false, error: 'tenantHandle is required' }, { status: 400 });
    }

    if (!ENV.VERCEL_TOKEN || !ENV.VERCEL_PROJECT_ID) {
      return NextResponse.json({ ok: false, error: 'Vercel configuration missing' }, { status: 500 });
    }

    const tenant = await getTenantByHandle(tenantHandle);
    if (!tenant?.[TENANT_FIELDS.REQUESTED_DOMAIN]) {
      return NextResponse.json({ ok: false, error: 'no_requested_domain' }, { status: 400 });
    }

    // Verify domain with Vercel
    const requestedDomain = tenant[TENANT_FIELDS.REQUESTED_DOMAIN]!;
    const response = await fetch(`https://api.vercel.com/v10/projects/${ENV.VERCEL_PROJECT_ID}/domains/${encodeURIComponent(requestedDomain)}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Vercel verification error:', errorData);
      
      // Set status to waiting-dns if verification fails
      await setTenantDomainStatus(tenantHandle, 'waiting-dns');
      
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to verify domain',
        details: errorData 
      }, { status: response.status });
    }

    // Domain verification initiated successfully
    await setTenantDomainStatus(tenantHandle, 'verified');
    
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error verifying domain:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
