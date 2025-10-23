// Stripe webhook with idempotency and email notifications
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { headers } from "next/headers";
import { ENV } from "@/src/config/env";
import Stripe from "stripe";
import {
  upsertTenantByHandle,
  createOrLinkUserOwner,
  setRequestedDomain,
  setTenantDomainStatus,
} from "@/src/lib/airtable";
import {
  getRootDomain,
  buildFixedQuoteDomain,
  extractCompanyWebsite,
} from "@/src/lib/domainRoot";
import { withIdempotency } from "@/lib/webhook-idempotency";
import { sendOnboardingEmail, generateMagicLink } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    // Parse event ID for idempotency
    const eventId = JSON.parse(body).id;
    
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        ENV.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
      // Use idempotency wrapper to prevent duplicate processing
      await withIdempotency(eventId, async () => {
        switch (event.type) {
          case "checkout.session.completed":
            await handleCheckoutCompleted(
              event.data.object as Stripe.Checkout.Session,
            );
            break;

        case "payment_intent.succeeded":
          await handlePaymentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
        }
        
        return { received: true };
      });

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Webhook handler error:", error);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 },
      );
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("✅ Payment success:", session.id);
  console.log("✅ Checkout session completed!");
  console.log("Session ID:", session.id);
  console.log("Customer Email:", session.customer_email);
  console.log("Metadata:", session.metadata);

  const { token, company, plan, utm_source, utm_campaign } =
    session.metadata || {};

  if (!company) {
    console.error("Missing company metadata in checkout session");
    return;
  }

  try {
    // Debug environment variables
    console.log("🔍 Environment check:", {
      hasAirtableKey: !!ENV.AIRTABLE_API_KEY,
      hasAirtableBase: !!ENV.AIRTABLE_BASE_ID,
      airtableKeyLength: ENV.AIRTABLE_API_KEY?.length,
      airtableBase: ENV.AIRTABLE_BASE_ID,
      nextPublicAppUrl: ENV.NEXT_PUBLIC_APP_URL,
    });

    // Generate API key for the tenant
    const apiKey = generateApiKey();
    const baseUrl = ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/c/${company}`;
    const captureUrl = `${baseUrl}/v1/ingest/lead`;

    console.log("🔍 Tenant data:", {
      company,
      plan: plan || "Starter",
      token,
      utm_source,
      utm_campaign,
      apiKey: apiKey.substring(0, 8) + "...",
      loginUrl,
      captureUrl,
    });

    // Create/update tenant in Airtable
    const tenant = await upsertTenantByHandle(company, {
      "Company Handle": company,
      Plan: plan || "Starter",
      Token: token || "",
      "UTM Source": utm_source || "",
      "UTM Campaign": utm_campaign || "",
      "API Key": apiKey,
      "Domain / Login URL": loginUrl,
      "Capture URL": captureUrl,
      "Payment Status": "Paid",
      "Stripe Customer ID": session.customer as string,
      "Last Payment": new Date().toISOString(),
    });

    console.log("✅ Tenant created/updated:", tenant.id);

    // Set up custom domain if company website is available
    let requestedDomain: string | null = null;
    const companyWebsite = extractCompanyWebsite(company);
    if (companyWebsite) {
      const root = getRootDomain(companyWebsite);
      if (root) {
        requestedDomain = buildFixedQuoteDomain(root);
        if (requestedDomain) {
          await setRequestedDomain(company, requestedDomain);
          await setTenantDomainStatus(company, "proposed");
          console.log(`✅ Domain setup initiated: ${requestedDomain}`);
        }
      }
    }

    // Link the payer as owner if email exists
    if (session.customer_email) {
      const userId = await createOrLinkUserOwner(
        tenant.id,
        session.customer_email,
      );
      console.log("✅ User linked as owner:", userId);
    }

    console.log(`✅ Tenant provisioned successfully: ${company}`);

    // Send onboarding email with all access details
    if (session.customer_email) {
      const instantUrl = `${baseUrl}/${company}`;
      const customDomain = requestedDomain || `quote.${company}.com`;
      const embedCode = `<iframe 
  src="${instantUrl}" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="${company} Solar Calculator">
</iframe>`;
      const dashboardUrl = `${baseUrl}/c/${company}`;
      const magicLinkUrl = generateMagicLink(session.customer_email, company);

      await sendOnboardingEmail({
        toEmail: session.customer_email,
        company,
        instantUrl,
        customDomain,
        embedCode,
        apiKey,
        dashboardUrl,
        magicLinkUrl,
      });

      console.log(`✅ Onboarding email sent to: ${session.customer_email}`);
    } else {
      console.warn('⚠️  No customer email - skipping onboarding email');
    }
  } catch (err: unknown) {
    console.error("❌ Failed to provision tenant:", err);
    const meta =
      err instanceof Error
        ? { message: err.message, stack: err.stack, name: err.name }
        : { message: String(err) };
    console.error("❌ Error details:", meta);
    return NextResponse.json(
      { ok: false, error: meta.message },
      { status: 500 },
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("✅ Payment intent succeeded:", paymentIntent.id);
  // Handle any additional payment success logic
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("✅ Invoice payment succeeded:", invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("❌ Invoice payment failed:", invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("✅ Subscription updated:", subscription.id);
  const status =
    subscription.status === "active"
      ? "Active"
      : subscription.status === "past_due"
        ? "PastDue"
        : subscription.status === "canceled"
          ? "Canceled"
          : "Inactive";
  await updateTenantSubscriptionStatus(subscription.id, status, Date.now());
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("❌ Subscription deleted:", subscription.id);
  await updateTenantSubscriptionStatus(subscription.id, "Canceled", Date.now());
}

async function updateTenantSubscriptionStatus(
  subscriptionId: string,
  status: string,
  periodEnd: number,
) {
  try {
    // Find tenant by subscription ID and update status
    // This would require adding a Subscription ID field to your Airtable tenant table
    console.log(
      `Updating tenant subscription status: ${subscriptionId} -> ${status}`,
    );
    // TODO: Implement tenant lookup and update in Airtable
  } catch (error) {
    console.error("Failed to update tenant subscription status:", error);
  }
}

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
