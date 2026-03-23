/**
 * Rate Limiting for Airtable API
 * Prevents exceeding Airtable's 5 requests/second limit
 */

interface RateLimitState {
  requests: number[];
  windowStart: number;
}

const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 5; // Airtable's limit

// In-memory rate limiter (per-instance)
// In production with multiple instances, use Vercel KV or Redis
const rateLimitState: RateLimitState = {
  requests: [],
  windowStart: Date.now(),
};

/**
 * Check if we can make an Airtable request without exceeding rate limit
 * @returns true if request can proceed, false if rate limited
 */
export function canMakeAirtableRequest(): boolean {
  const now = Date.now();
  const state = rateLimitState;

  // Reset window if expired
  if (now - state.windowStart >= RATE_LIMIT_WINDOW) {
    state.requests = [];
    state.windowStart = now;
  }

  // Remove requests outside current window
  state.requests = state.requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  );

  // Check if we're at the limit
  if (state.requests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Record this request
  state.requests.push(now);
  return true;
}

/**
 * Wait until we can make an Airtable request
 * @param maxWaitMs Maximum time to wait in milliseconds
 * @returns true if we can proceed, false if timeout
 */
export async function waitForAirtableRateLimit(
  maxWaitMs: number = 5000,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (canMakeAirtableRequest()) {
      return true;
    }

    // Wait a bit before checking again
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return false;
}

/**
 * Execute an Airtable operation with rate limiting
 */
export async function withAirtableRateLimit<T>(
  operation: () => Promise<T>,
  maxWaitMs: number = 5000,
): Promise<T> {
  const canProceed = await waitForAirtableRateLimit(maxWaitMs);

  if (!canProceed) {
    throw new Error(
      'Airtable rate limit: Unable to proceed within timeout period',
    );
  }

  return operation();
}
