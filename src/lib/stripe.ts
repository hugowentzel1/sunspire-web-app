import Stripe from "stripe";

export function getStripe() {
  const secret =
    process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

  if (!secret) throw new Error("Missing STRIPE_SECRET_KEY");

  // Either omit apiVersion or pin to a real one:
  return new Stripe(secret /*, { apiVersion: '2024-06-20' }*/);
}
