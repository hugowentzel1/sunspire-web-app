import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { checkRateLimit } from "@/src/lib/ratelimit";

// Helper function to extract client IP
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(req);
  if (checkRateLimit(clientIP, "stripe-checkout")) {
    console.warn(`Rate limited: ${clientIP} for stripe-checkout`);
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const stripeClient = getStripe();
    console.log("🔍 Stripe checkout request received");

    // Get price IDs from environment
    const price =
      process.env.STRIPE_PRICE_STARTER || 
      process.env.STRIPE_PRICE_MONTHLY ||
      process.env.STRIPE_PRICE_MONTHLY_99;
    
    if (!price) {
      console.error("❌ Missing STRIPE price env");
      return NextResponse.json({ error: "Stripe price configuration missing" }, { status: 500 });
    }

    // Read params from POST JSON
    const body = await req.json();
    const {
      plan = "starter",
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      tenant_handle,
    } = body;

    console.log("🔍 Creating Stripe checkout session...");
    console.log("🔍 Request data:", {
      plan,
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      tenant_handle,
    });

    // Build URLs
    const base =
      process.env.NEXT_PUBLIC_APP_URL || "https://demo.sunspiredemo.com";

    // Create Stripe checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          tenant_handle: tenant_handle || company || "",
          plan,
          utm_source: utm_source || "",
          utm_campaign: utm_campaign || "",
        },
      },
      metadata: {
        token: token || "",
        company: company || "",
        tenant_handle: tenant_handle || company || "",
        plan,
        utm_source: utm_source || "",
        utm_campaign: utm_campaign || "",
      },
      success_url: `${base}/activate?session_id={CHECKOUT_SESSION_ID}&company=${encodeURIComponent(company || '')}&plan=${plan}`,
      cancel_url: `${base}/?canceled=1&company=${encodeURIComponent(company || '')}`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    console.log("✅ Stripe checkout session created:", checkoutSession.id);
    console.log("✅ Checkout URL:", checkoutSession.url);
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(req);
  if (checkRateLimit(clientIP, "stripe-checkout")) {
    console.warn(`Rate limited: ${clientIP} for stripe-checkout`);
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const stripeClient = getStripe();
    console.log("🔍 Stripe checkout GET request received");

    // Get price IDs from environment
    const price =
      process.env.STRIPE_PRICE_STARTER || 
      process.env.STRIPE_PRICE_MONTHLY ||
      process.env.STRIPE_PRICE_MONTHLY_99;
    
    if (!price) {
      console.error("❌ Missing STRIPE price env");
      return NextResponse.json({ error: "Stripe price configuration missing" }, { status: 500 });
    }

    // Read params from URL query string
    const url = new URL(req.url);
    const plan = url.searchParams.get("plan") || "starter";
    const token = url.searchParams.get("token");
    const company = url.searchParams.get("company");
    const email = url.searchParams.get("email");
    const utm_source = url.searchParams.get("utm_source");
    const utm_campaign = url.searchParams.get("utm_campaign");
    const tenant_handle = url.searchParams.get("tenant_handle");

    console.log("🔍 Creating Stripe checkout session from GET...");
    console.log("🔍 Request data:", {
      plan,
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      tenant_handle,
    });

    // Build URLs
    const base =
      process.env.NEXT_PUBLIC_APP_URL || "https://demo.sunspiredemo.com";

    // Create Stripe checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          tenant_handle: tenant_handle || company || "",
          plan,
          utm_source: utm_source || "",
          utm_campaign: utm_campaign || "",
        },
      },
      metadata: {
        token: token || "",
        company: company || "",
        tenant_handle: tenant_handle || company || "",
        plan,
        utm_source: utm_source || "",
        utm_campaign: utm_campaign || "",
      },
      success_url: `${base}/activate?session_id={CHECKOUT_SESSION_ID}&company=${encodeURIComponent(company || '')}&plan=${plan}`,
      cancel_url: `${base}/?canceled=1&company=${encodeURIComponent(company || '')}`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    console.log("✅ Stripe checkout session created:", checkoutSession.id);
    console.log("✅ Checkout URL:", checkoutSession.url);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout GET error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
