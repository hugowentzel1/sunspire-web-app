import { z } from "zod";

const envSchema = z.object({
  AIRTABLE_API_KEY: z.string(),
  AIRTABLE_BASE_ID: z.string(),

  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  NREL_API_KEY: z.string(),
  EIA_API_KEY: z.string(),

  // Non-Stripe app secrets
  ADMIN_TOKEN: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Optional numeric defaults (strings OK in env)
  DEFAULT_RATE_ESCALATION: z.coerce.number().default(0.025),
  DEFAULT_OANDM_ESCALATION: z.coerce.number().default(0.03),
  DISCOUNT_RATE: z.coerce.number().default(0.08),
  OANDM_PER_KW_YEAR: z.coerce.number().default(15),
  DEFAULT_DEGRADATION_PCT: z.coerce.number().default(0.5),
  DEFAULT_LOSSES_PCT: z.coerce.number().default(14),
  DEFAULT_COST_PER_WATT: z.coerce.number().default(3.5),

  // Stripe keys are validated in the Stripe section; keep optional here so non-Stripe builds still run
  STRIPE_LIVE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_MONTHLY_99: z.string().optional(),
  STRIPE_PRICE_SETUP_399: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
