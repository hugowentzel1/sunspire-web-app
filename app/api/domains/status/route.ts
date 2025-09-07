import { NextResponse } from 'next/server';
import { getTenantByHandle, updateTenantDomain, setTenantDomainStatus } from '@/src/lib/airtable';
import { ENV } from '@/src/config/env';

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
    if (!tenant?.requested_domain) {
      return NextResponse.json({ ok: false, error: 'no_requested_domain' }, { status: 400 });
    }

    // Check domain status with Vercel
    const response = await fetch(`https://api.vercel.com/v9/projects/${ENV.VERCEL_PROJECT_ID}/domains/${encodeURIComponent(tenant.requested_domain)}`, {
      headers: {
        'Authorization': `Bearer ${ENV.VERCEL_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Vercel status check error:', errorData);
      
      return NextResponse.json({ 
        verified: false, 
        error: 'Failed to check domain status',
        details: errorData 
      });
    }

    const domainData = await response.json();
    const isVerified = !!domainData.verified;

    // If domain is verified, update tenant with the custom domain
    if (isVerified && tenant.domain_status !== 'live') {
      await updateTenantDomain(tenantHandle, `https://${tenant.requested_domain}`);
      await setTenantDomainStatus(tenantHandle, 'live');
    }

    return NextResponse.json({ 
      verified: isVerified, 
      raw: domainData,
      requestedDomain: tenant.requested_domain,
      currentDomain: tenant.domain
    });

  } catch (error) {
    console.error('Error checking domain status:', error);
    return NextResponse.json({ 
      verified: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
