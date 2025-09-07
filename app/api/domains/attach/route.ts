import { NextResponse } from 'next/server';
import { getTenantByHandle, setTenantDomainStatus } from '@/src/lib/airtable';
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
    if (!tenant?.requested_domain) {
      return NextResponse.json({ ok: false, error: 'no_requested_domain' }, { status: 400 });
    }

    // Attach domain to Vercel
    const response = await fetch(`https://api.vercel.com/v10/projects/${ENV.VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: tenant.requested_domain })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Vercel API error:', errorData);
      
      // Set status to waiting-dns if domain already exists or other attachment issues
      await setTenantDomainStatus(tenantHandle, 'waiting-dns');
      
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to attach domain',
        details: errorData 
      }, { status: response.status });
    }

    // Domain attached successfully
    await setTenantDomainStatus(tenantHandle, 'attached');
    
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error attaching domain:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
