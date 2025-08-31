interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60_000, maxRequests: number = 20) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new window or reset existing one
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return false;
    }

    if (entry.count >= this.maxRequests) {
      return true;
    }

    // Increment count
    entry.count++;
    return false;
  }

  getRemainingTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  // Clean up expired entries (call periodically)
  cleanup(): void {
    const now = Date.now();
    Array.from(this.limits.entries()).forEach(([key, entry]) => {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    });
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

export function checkRateLimit(ip: string, route: string): boolean {
  const key = `${ip}:${route}`;
  return rateLimiter.isRateLimited(key);
}

export function getRateLimitRemainingTime(ip: string, route: string): number {
  const key = `${ip}:${route}`;
  return rateLimiter.getRemainingTime(key);
}

export { rateLimiter };


