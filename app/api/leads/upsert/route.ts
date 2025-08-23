import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  email: string;
  fullName?: string;
  company?: string;
  companyHandle: string;
  address?: string;
  lat?: number;
  lng?: number;
  crm?: string;
  source?: string;
  campaignId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();
    
    // Validate required fields
    if (!body.email || !body.companyHandle) {
      return NextResponse.json(
        { success: false, error: 'Email and companyHandle are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual Airtable integration
    console.log('Lead upsert request:', body);
    
    // Mock successful response
    return NextResponse.json({
      success: true,
      message: 'Lead upserted successfully',
      data: {
        id: `lead_${Date.now()}`,
        email: body.email,
        companyHandle: body.companyHandle,
        upsertedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Lead upsert error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
