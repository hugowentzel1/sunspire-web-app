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

// Stripe instance using live secret key or fallback to regular secret key
const stripe = process.env.STRIPE_LIVE_SECRET_KEY ? new Stripe(process.env.STRIPE_LIVE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

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
    const stripeKey = process.env.STRIPE_LIVE_SECRET_KEY;
    console.log('🔍 Using key starting with:', stripeKey?.substring(0, 10) || 'undefined');
    
    // Non-null assertion since we already checked stripe is not null
    const stripeClient = stripe!;

    // Assert required environment variables
    if (!stripeKey) {
      console.error('❌ No Stripe secret key found');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    // For local development, create test products and prices if not configured
    let monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY_99;
    let setupPriceId = process.env.STRIPE_PRICE_SETUP_399;
    
    if (!monthlyPriceId || !setupPriceId) {
      console.log('🔧 Creating test products and prices for local development...');
      
      // Create test product
      const product = await stripeClient.products.create({
        name: 'Sunspire Solar Intelligence Platform',
        description: 'Monthly subscription for solar intelligence platform',
      });
      
      // Create monthly price
      const monthlyPrice = await stripeClient.prices.create({
        product: product.id,
        unit_amount: 9900, // $99.00
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      
      // Create setup price
      const setupPrice = await stripeClient.prices.create({
        product: product.id,
        unit_amount: 39900, // $399.00
        currency: 'usd',
      });
      
      monthlyPriceId = monthlyPrice.id;
      setupPriceId = setupPrice.id;
      
      console.log('✅ Created test prices:', { monthlyPriceId, setupPriceId });
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
    const { plan = 'starter', token, company, email, utm_source, utm_campaign, tenant_handle } = body;

    console.log('🔍 Creating Stripe checkout session...');
    console.log('🔍 Request data:', { plan, token, company, email, utm_source, utm_campaign, tenant_handle });

    // Build origin for URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    
    // Create Stripe checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: monthlyPriceId!,
          quantity: 1,
        },
        {
          price: setupPriceId!,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { 
          tenant_handle: tenant_handle || company || '',
          plan,
          utm_source: utm_source || '',
          utm_campaign: utm_campaign || '',
        },
      },
      metadata: {
        token: token || '',
        company: company || '',
        tenant_handle: tenant_handle || company || '',
        plan,
        utm_source: utm_source || '',
        utm_campaign: utm_campaign || '',
      },
      success_url: `${origin}/c/${tenant_handle || company || 'success'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/c/${tenant_handle || company || 'cancel'}/cancel`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
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
    
    // Non-null assertion since we already checked stripe is not null
    const stripeClient = stripe!;
    
    // Assert required environment variables
    const stripeKey = process.env.STRIPE_LIVE_SECRET_KEY;
    if (!stripeKey) {
      console.error('❌ No Stripe secret key found');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    // For local development, create test products and prices if not configured
    let monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY_99;
    let setupPriceId = process.env.STRIPE_PRICE_SETUP_399;
    
    if (!monthlyPriceId || !setupPriceId) {
      console.log('🔧 Creating test products and prices for local development...');
      
      // Create test product
      const product = await stripeClient.products.create({
        name: 'Sunspire Solar Intelligence Platform',
        description: 'Monthly subscription for solar intelligence platform',
      });
      
      // Create monthly price
      const monthlyPrice = await stripeClient.prices.create({
        product: product.id,
        unit_amount: 9900, // $99.00
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      
      // Create setup price
      const setupPrice = await stripeClient.prices.create({
        product: product.id,
        unit_amount: 39900, // $399.00
        currency: 'usd',
      });
      
      monthlyPriceId = monthlyPrice.id;
      setupPriceId = setupPrice.id;
      
      console.log('✅ Created test prices:', { monthlyPriceId, setupPriceId });
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
    const tenant_handle = url.searchParams.get('tenant_handle');

    console.log('🔍 Creating Stripe checkout session from GET...');
    console.log('🔍 Request data:', { plan, token, company, email, utm_source, utm_campaign, tenant_handle });

    // Build origin for URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    
    // Create Stripe checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: monthlyPriceId!,
          quantity: 1,
        },
        {
          price: setupPriceId!,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { 
          tenant_handle: tenant_handle || company || '',
          plan,
          utm_source: utm_source || '',
          utm_campaign: utm_campaign || '',
        },
      },
      metadata: {
        token: token || '',
        company: company || '',
        tenant_handle: tenant_handle || company || '',
        plan,
        utm_source: utm_source || '',
        utm_campaign: utm_campaign || '',
      },
      success_url: `${origin}/c/${tenant_handle || company || 'success'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/c/${tenant_handle || company || 'cancel'}/cancel`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
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