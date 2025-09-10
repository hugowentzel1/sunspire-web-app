import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { slug, company } = await request.json();
    
    if (!slug || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Log to Airtable (fail silently if it fails)
    try {
      await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Slug': slug,
            'Company Handle': company,
            'User Agent': userAgent,
            'IP Address': ip,
            'Timestamp': new Date().toISOString(),
            'Status': 'opened'
          }
        })
      });
    } catch (error) {
      // Fail silently - don't break the redirect
      console.log('Failed to log outreach click:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fail silently - don't break the redirect
    return NextResponse.json({ success: true });
  }
}
