import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { plan, domain, email, utm } = await request.json();
    
    if (!plan || !domain || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: plan, domain, email' },
        { status: 400 }
      );
    }

    // For now, return a mock checkout URL
    // In production, this would create a real Stripe Checkout Session
    const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}#fid=${Math.random().toString(36).substr(2, 9)}`;
    
    return NextResponse.json({
      url: checkoutUrl,
      sessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
