import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ENV } from '@/src/config/env';
import { checkRateLimit } from '@/src/lib/ratelimit';

// Helper function to extract client IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// Stripe instance using standardized environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(req);
  if (checkRateLimit(clientIP, 'stripe-checkout')) {
    console.warn(`Rate limited: ${clientIP} for stripe-checkout`);
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429 }
    );
  }

  try {
    console.log('🔍 Stripe checkout request received');
    console.log('🔍 Stripe instance:', !!stripe);
    console.log('🔍 Using key starting with:', process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'undefined');

    if (!stripe) {
      console.error('❌ Stripe not configured');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { plan = 'starter', token, company, email, utm_source, utm_campaign } = body;

    console.log('🔍 Creating Stripe checkout session...');
    console.log('🔍 Request data:', { plan, token, company, email, utm_source, utm_campaign });

    // Map plan to Stripe Price IDs (recurring + setup fee)
    const monthlyPrice = process.env.STRIPE_PRICE_MONTHLY_99!;
    const setupPrice = process.env.STRIPE_PRICE_SETUP_399!;
    
    console.log('🔍 Stripe Price IDs:', { monthlyPrice, setupPrice });
    console.log('🔍 Environment check:', {
      hasMonthlyPrice: !!monthlyPrice,
      hasSetupPrice: !!setupPrice,
      monthlyPriceLength: monthlyPrice?.length,
      setupPriceLength: setupPrice?.length
    });
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: monthlyPrice,
          quantity: 1,
        },
        {
          price: setupPrice,
          quantity: 1,
        },
      ],
      metadata: {
        token: token || '',
        company: company || '',
        plan,
        utm_source: utm_source || '',
        utm_campaign: utm_campaign || '',
      },
      success_url: `${ENV.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/cancel`,
      customer_email: email,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}


