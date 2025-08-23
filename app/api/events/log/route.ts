import { NextRequest, NextResponse } from 'next/server';

interface EventData {
  email?: string;
  companyHandle: string;
  type: 'demo_open' | 'address_selected' | 'activation_clicked' | 'signup_complete';
  metadata?: Record<string, any>;
  campaignId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventData = await request.json();
    
    // Validate required fields
    if (!body.companyHandle || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Company handle and event type are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes = ['demo_open', 'address_selected', 'activation_clicked', 'signup_complete'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // TODO: Implement actual Airtable integration
    console.log('Event log request:', body);
    
    // Mock successful response
    return NextResponse.json({
      success: true,
      message: 'Event logged successfully',
      data: {
        id: `event_${Date.now()}`,
        companyHandle: body.companyHandle,
        type: body.type,
        loggedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Event log error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
