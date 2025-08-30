import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// COMPLETELY NEW ROUTE - BYPASS ALL CACHING
// Using direct process.env access only

const stripe = process.env.STRIPE_LIVE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_LIVE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  }) : null;

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 NEW STRIPE ROUTE - checkout request received');
    console.log('🚀 Stripe instance:', !!stripe);
    console.log('🚀 STRIPE_LIVE_SECRET_KEY exists:', !!process.env.STRIPE_LIVE_SECRET_KEY);
    console.log('🚀 STRIPE_LIVE_SECRET_KEY length:', process.env.STRIPE_LIVE_SECRET_KEY?.length || 0);
    console.log('🚀 STRIPE_LIVE_SECRET_KEY starts with:', process.env.STRIPE_LIVE_SECRET_KEY?.substring(0, 10) || 'undefined');

    if (!stripe) {
      console.error('❌ Stripe not configured in new route');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { companyHandle, plan, payerEmail, brandColors, logoURL } = body;

    if (!companyHandle || !payerEmail || !plan) {
      return NextResponse.json(
        { error: 'companyHandle, payerEmail, and plan are required' },
        { status: 400 }
      );
    }

    console.log('🚀 Creating Stripe checkout session in new route...');
    console.log('🚀 Request data:', { companyHandle, plan, payerEmail, brandColors, logoURL });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Sunspire ${plan} Plan`,
              description: `Solar lead generation platform for ${companyHandle}`,
              images: logoURL ? [logoURL] : [],
            },
            unit_amount: getPlanPrice(plan),
          },
          quantity: 1,
        },
      ],
      metadata: {
        companyHandle,
        payerEmail,
        brandColors: brandColors || '',
        logoURL: logoURL || '',
        plan,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app'}/c/${companyHandle}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app'}/c/${companyHandle}/cancel`,
      customer_email: payerEmail,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('🚀 NEW ROUTE Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

function getPlanPrice(plan: string): number {
  switch (plan.toLowerCase()) {
    case 'starter':
      return 9900; // $99.00
    case 'growth':
      return 19900; // $199.00
    case 'scale':
      return 49900; // $499.00
    default:
      return 9900; // Default to starter
  }
}
