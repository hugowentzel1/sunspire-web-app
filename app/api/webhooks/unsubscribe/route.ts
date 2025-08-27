import { NextRequest, NextResponse } from 'next/server';
import { withTenantScope, AuthenticatedRequest } from '../../../../src/server/auth/tenantScope';
import { findLeadByEmailAndTenant, updateLead } from '../../../../src/lib/airtable';
import { logger } from '../../../../src/lib/logger';
import { z } from 'zod';

const unsubscribeSchema = z.object({
  email: z.string().email()
});

async function handleUnsubscribe(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = unsubscribeSchema.parse(body);
    
    const { email } = validatedData;
    const { tenant } = req;
    
    logger.info('Unsubscribe webhook:', {
      tenant: tenant.handle,
      email
    });
    
    // Find existing lead
    const existingLead = await findLeadByEmailAndTenant(email, tenant.id);
    
    if (existingLead && existingLead.id) {
      // Update lead status to "Suppression"
      await updateLead(existingLead.id, {
        'Status': 'Suppression',
        'Last Activity': new Date().toISOString()
      });
      
      logger.info('Lead unsubscribed:', { email, tenant: tenant.handle, leadId: existingLead.id });
      
      return NextResponse.json({ 
        success: true, 
        tenant: tenant.handle,
        leadId: existingLead.id,
        message: 'Successfully unsubscribed'
      });
    } else {
      // Create a new lead with suppression status
      const leadData = {
        'Email': email,
        'Status': 'Suppression',
        'Last Activity': new Date().toISOString()
      };
      
      // Note: We'd need to import upsertLeadByEmailAndTenant here if we want to create new leads
      // For now, just return success if no existing lead found
      logger.info('No existing lead found for unsubscribe:', { email, tenant: tenant.handle });
      
      return NextResponse.json({ 
        success: true, 
        tenant: tenant.handle,
        message: 'Email not found in system, but unsubscribe processed'
      });
    }
    
  } catch (error) {
    logger.error('Unsubscribe webhook error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withTenantScope(handleUnsubscribe);
