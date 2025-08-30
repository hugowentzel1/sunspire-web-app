import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ENV } from '@/src/config/env';

// Force complete redeploy - clear all caches - $(date)

// Try multiple environment variable names
const stripe = (process.env.STRIPE_KEY || ENV.STRIPE_SECRET_KEY) ? 
  new Stripe(process.env.STRIPE_KEY || ENV.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  }) : null;

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Stripe checkout request received');
    console.log('🔍 Stripe instance:', !!stripe);
    console.log('🔍 ENV.STRIPE_SECRET_KEY exists:', !!ENV.STRIPE_SECRET_KEY);
    console.log('🔍 ENV.STRIPE_SECRET_KEY length:', ENV.STRIPE_SECRET_KEY?.length || 0);
    console.log('🔍 ENV.STRIPE_SECRET_KEY starts with:', ENV.STRIPE_SECRET_KEY?.substring(0, 10) || 'undefined');
    
    if (!stripe) {
      console.error('❌ Stripe not configured');
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

    console.log('🔍 Creating Stripe checkout session...');
    console.log('🔍 Request data:', { companyHandle, plan, payerEmail, brandColors, logoURL });
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Use 'subscription' for recurring plans
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Sunspire ${plan} Plan`,
              description: `Solar lead generation platform for ${companyHandle}`,
              images: logoURL ? [logoURL] : [],
            },
            unit_amount: getPlanPrice(plan), // Amount in cents
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
      success_url: `${ENV.NEXT_PUBLIC_APP_URL}/c/${companyHandle}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.NEXT_PUBLIC_APP_URL}/c/${companyHandle}/cancel`,
      customer_email: payerEmail,
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
