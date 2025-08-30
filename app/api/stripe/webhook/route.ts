// Test redeploy - Stripe webhook integration ready for testing
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { ENV } from '@/src/config/env';
import { upsertTenantByHandle, createOrLinkUserOwner } from '@/src/lib/airtable';

const stripe = ENV.STRIPE_SECRET_KEY ? new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      ENV.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Payment success:', session.id);
  console.log('✅ Checkout session completed!');
  console.log('Session ID:', session.id);
  console.log('Customer Email:', session.customer_email);
  console.log('Metadata:', session.metadata);
  
  const { companyHandle, payerEmail, brandColors, logoURL, plan } = session.metadata || {};
  
  if (!companyHandle || !payerEmail) {
    console.error('Missing metadata in checkout session');
    return;
  }

  try {
    // Generate API key for the tenant
    const apiKey = generateApiKey();
    const loginUrl = `${ENV.NEXT_PUBLIC_APP_URL}/c/${companyHandle}`;
    const captureUrl = `${ENV.NEXT_PUBLIC_APP_URL}/v1/ingest/lead`;

    // Create/update tenant in Airtable
    const tenant = await upsertTenantByHandle(companyHandle, {
      "Company Handle": companyHandle,
      "Plan": plan || "Starter",
      "Brand Colors": brandColors || "",
      "Logo URL": logoURL || "",
      "API Key": apiKey,
      "Domain / Login URL": loginUrl,
      "Capture URL": captureUrl,
      "Payment Status": "Paid",
      "Stripe Customer ID": session.customer as string,
      "Last Payment": new Date().toISOString(),
    });

    // Link the payer as owner
    await createOrLinkUserOwner(tenant.id, payerEmail);

    console.log(`✅ Tenant provisioned successfully: ${companyHandle}`);
    
    // TODO: Send onboarding email with loginUrl, apiKey, captureUrl
    
  } catch (error) {
    console.error('Failed to provision tenant:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);
  // Handle any additional payment success logic
}

function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
