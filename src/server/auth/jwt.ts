import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { logger } from '../../lib/logger';

export interface JWTPayload {
  tenantId?: string;
  userId?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function signToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string {
  try {
    return jwt.sign(payload, ENV.ADMIN_TOKEN, {
      algorithm: 'HS256',
      expiresIn: '24h' // Token expires in 24 hours
    });
  } catch (error) {
    logger.error('Error signing JWT token:', error);
    throw new Error('Failed to sign token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const payload = jwt.verify(token, ENV.ADMIN_TOKEN, {
      algorithms: ['HS256']
    }) as JWTPayload;
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      logger.error('Error verifying JWT token:', error);
      throw new Error('Token verification failed');
    }
  }
}

export function createTenantToken(tenantId: string): string {
  return signToken({ tenantId });
}

export function createUserToken(userId: string, tenantId: string, role: string): string {
  return signToken({ userId, tenantId, role });
}
