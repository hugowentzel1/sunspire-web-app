import { z } from 'zod';

const envSchema = z.object({
  // Required environment variables
  AIRTABLE_API_KEY: z.string().min(1, 'AIRTABLE_API_KEY is required'),
  AIRTABLE_BASE_ID: z.string().min(1, 'AIRTABLE_BASE_ID is required'),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required'),
  NREL_API_KEY: z.string().min(1, 'NREL_API_KEY is required'),
  EIA_API_KEY: z.string().min(1, 'EIA_API_KEY is required'),
  ADMIN_TOKEN: z.string().min(1, 'ADMIN_TOKEN is required'),

  // Optional environment variables with defaults
  DEFAULT_RATE_ESCALATION: z.coerce.number().default(0.025), // 2.5% default
  DEFAULT_OANDM_ESCALATION: z.coerce.number().default(0.03), // 3% default
  DISCOUNT_RATE: z.coerce.number().default(0.08), // 8% default
  OANDM_PER_KW_YEAR: z.coerce.number().default(15), // $15/kW/year default
  DEFAULT_DEGRADATION_PCT: z.coerce.number().default(0.5), // 0.5% default
  DEFAULT_LOSSES_PCT: z.coerce.number().default(14), // 14% default
  DEFAULT_COST_PER_WATT: z.coerce.number().default(3.5), // $3.50/W default
});

// Parse and validate environment variables
const envParseResult = envSchema.safeParse(process.env);

// Only validate at runtime, not at build time
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  if (!envParseResult.success) {
    console.error('❌ Environment validation failed:');
    console.error(envParseResult.error.format());
    throw new Error('Environment validation failed');
  }
}

export const ENV = envParseResult.success ? envParseResult.data : {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY || '',
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || '',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  NREL_API_KEY: process.env.NREL_API_KEY || '',
  EIA_API_KEY: process.env.EIA_API_KEY || '',
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || '',
  DEFAULT_RATE_ESCALATION: 0.025,
  DEFAULT_OANDM_ESCALATION: 0.03,
  DISCOUNT_RATE: 0.08,
  OANDM_PER_KW_YEAR: 15,
  DEFAULT_DEGRADATION_PCT: 0.5,
  DEFAULT_LOSSES_PCT: 14,
  DEFAULT_COST_PER_WATT: 3.5
};

// Type-safe environment access
export type Env = typeof ENV;
