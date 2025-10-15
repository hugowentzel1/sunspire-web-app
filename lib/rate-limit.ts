// lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  limit: number = 1000, // 1000 requests per hour (api.data.gov default)
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { success: boolean; remaining: number; resetTime: number } {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
