import { NextRequest, NextResponse } from 'next/server';
import { upsertLead, logEvent } from '@/src/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // TODO: Verify Stripe webhook signature
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    // For now, parse the body as JSON for development
    let event;
    try {
      event = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const companyHandle = session.metadata?.companyHandle;
      const email = session.customer_details?.email;
      const plan = session.metadata?.plan || 'standard';

      if (companyHandle) {
        // Mark as activated in Airtable
        await upsertLead({
          name: companyHandle, // Use companyHandle as name for now
          email: email || '',
          address: 'Stripe Activation',
          tenantSlug: companyHandle, // Map companyHandle to tenantSlug
          notes: 'Source: stripe_activation'
        });

        // Log activation event
        await logEvent({
          tenantId: companyHandle, // Use companyHandle as tenantId for now
          type: 'activation_clicked',
          metadata: {
            plan,
            sessionId: session.id,
            amount: session.amount_total,
            email
          }
        });

        // TODO: Enqueue provisioner task
        // await queueProvisioner({
        //   companyHandle,
        //   email,
        //   plan,
        //   sessionId: session.id
        // });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
