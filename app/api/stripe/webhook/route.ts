// Test redeploy - Stripe webhook integration ready for testing
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { ENV } from '@/src/config/env';
import { upsertTenantByHandle, createOrLinkUserOwner } from '@/src/lib/airtable';

const stripe = ENV.STRIPE_LIVE_SECRET_KEY ? new Stripe(ENV.STRIPE_LIVE_SECRET_KEY, {
  apiVersion: '2023-10-16',
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
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
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
  
  const { token, company, plan, utm_source, utm_campaign } = session.metadata || {};
  
  if (!company) {
    console.error('Missing company metadata in checkout session');
    return;
  }

  try {
    // Debug environment variables
    console.log('🔍 Environment check:', {
      hasAirtableKey: !!ENV.AIRTABLE_API_KEY,
      hasAirtableBase: !!ENV.AIRTABLE_BASE_ID,
      airtableKeyLength: ENV.AIRTABLE_API_KEY?.length,
      airtableBase: ENV.AIRTABLE_BASE_ID,
      nextPublicAppUrl: ENV.NEXT_PUBLIC_APP_URL
    });

    // Generate API key for the tenant
    const apiKey = generateApiKey();
    const baseUrl = ENV.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl}/c/${company}`;
    const captureUrl = `${baseUrl}/v1/ingest/lead`;

    console.log('🔍 Tenant data:', {
      company,
      plan: plan || "Starter",
      token,
      utm_source,
      utm_campaign,
      apiKey: apiKey.substring(0, 8) + '...',
      loginUrl,
      captureUrl
    });

    // Create/update tenant in Airtable
    const tenant = await upsertTenantByHandle(company, {
      "Company Handle": company,
      "Plan": plan || "Starter",
      "Token": token || "",
      "UTM Source": utm_source || "",
      "UTM Campaign": utm_campaign || "",
      "API Key": apiKey,
      "Domain / Login URL": loginUrl,
      "Capture URL": captureUrl,
      "Payment Status": "Paid",
      "Stripe Customer ID": session.customer as string,
      "Last Payment": new Date().toISOString(),
    });

    console.log('✅ Tenant created/updated:', tenant.id);

    // Link the payer as owner if email exists
    if (session.customer_email) {
      const userId = await createOrLinkUserOwner(tenant.id, session.customer_email);
      console.log('✅ User linked as owner:', userId);
    }

    console.log(`✅ Tenant provisioned successfully: ${company}`);
    
    // TODO: Send onboarding email with loginUrl, apiKey, captureUrl
    
  } catch (err: unknown) {
    console.error('❌ Failed to provision tenant:', err);
    const meta =
      err instanceof Error
        ? { message: err.message, stack: err.stack, name: err.name }
        : { message: String(err) };
    console.error('❌ Error details:', meta);
    return NextResponse.json({ ok: false, error: meta.message }, { status: 500 });
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);
  // Handle any additional payment success logic
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('✅ Invoice payment succeeded:', invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('✅ Subscription updated:', subscription.id);
  const status = subscription.status === 'active' ? 'Active' : 
                 subscription.status === 'past_due' ? 'PastDue' : 
                 subscription.status === 'canceled' ? 'Canceled' : 'Inactive';
  await updateTenantSubscriptionStatus(subscription.id, status, Date.now());
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription deleted:', subscription.id);
  await updateTenantSubscriptionStatus(subscription.id, 'Canceled', Date.now());
}

async function updateTenantSubscriptionStatus(subscriptionId: string, status: string, periodEnd: number) {
  try {
    // Find tenant by subscription ID and update status
    // This would require adding a Subscription ID field to your Airtable tenant table
    console.log(`Updating tenant subscription status: ${subscriptionId} -> ${status}`);
    // TODO: Implement tenant lookup and update in Airtable
  } catch (error) {
    console.error('Failed to update tenant subscription status:', error);
  }
}

function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
