import 'server-only';

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    // Throwing here makes the error obvious in Vercel function logs
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string): string | undefined {
  return process.env[name];
}

export const ENV = {
  NREL_API_KEY: required('NREL_API_KEY'),
  EIA_API_KEY: optional('EIA_API_KEY'),
  OPENEI_API_KEY: optional('OPENEI_API_KEY'),
};

