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
  apiVersion: '2025-08-27.basil',
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

    // Assert required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY missing');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    if (!process.env.STRIPE_PRICE_MONTHLY_99) {
      console.error('❌ STRIPE_PRICE_MONTHLY_99 missing');
      return NextResponse.json({ error: 'Monthly price configuration missing' }, { status: 500 });
    }

    if (!process.env.STRIPE_PRICE_SETUP_399) {
      console.error('❌ STRIPE_PRICE_SETUP_399 missing');
      return NextResponse.json({ error: 'Setup price configuration missing' }, { status: 500 });
    }

    if (!stripe) {
      console.error('❌ Stripe not configured');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Read params from POST JSON
    const body = await req.json();
    const { plan = 'starter', token, company, email, utm_source, utm_campaign } = body;

    console.log('🔍 Creating Stripe checkout session...');
    console.log('🔍 Request data:', { plan, token, company, email, utm_source, utm_campaign });

    // Build origin for URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_MONTHLY_99!,
          quantity: 1,
        },
        {
          price: process.env.STRIPE_PRICE_SETUP_399!,
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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      customer_email: email,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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
    console.log('🔍 Stripe checkout GET request received');
    
    // Assert required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY missing');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    if (!process.env.STRIPE_PRICE_MONTHLY_99) {
      console.error('❌ STRIPE_PRICE_MONTHLY_99 missing');
      return NextResponse.json({ error: 'Monthly price configuration missing' }, { status: 500 });
    }

    if (!process.env.STRIPE_PRICE_SETUP_399) {
      console.error('❌ STRIPE_PRICE_SETUP_399 missing');
      return NextResponse.json({ error: 'Setup price configuration missing' }, { status: 500 });
    }
    
    if (!stripe) {
      console.error('❌ Stripe not configured');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Read params from URL query string
    const url = new URL(req.url);
    const plan = url.searchParams.get('plan') || 'starter';
    const token = url.searchParams.get('token');
    const company = url.searchParams.get('company');
    const email = url.searchParams.get('email');
    const utm_source = url.searchParams.get('utm_source');
    const utm_campaign = url.searchParams.get('utm_campaign');

    console.log('🔍 Creating Stripe checkout session from GET...');
    console.log('🔍 Request data:', { plan, token, company, email, utm_source, utm_campaign });

    // Build origin for URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_MONTHLY_99!,
          quantity: 1,
        },
        {
          price: process.env.STRIPE_PRICE_SETUP_399!,
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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      customer_email: email || undefined,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Stripe checkout GET error:', err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


