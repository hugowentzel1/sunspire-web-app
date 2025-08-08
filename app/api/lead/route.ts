import { NextRequest, NextResponse } from 'next/server';
import { storeLead, storeLeadFallback, LeadData } from '@/lib/airtable';
import { sendEmail, generateLeadNotificationEmail, generateUserConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, address, tenantSlug, systemSizeKW, netCostAfterITC, year1Savings, paybackYear, npv25Year, co2OffsetPerYear } = body;
    
    if (!name || !email || !address || !tenantSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare lead data with updated field names
    const leadData: LeadData = {
      name,
      email,
      phone: body.phone || '',
      address,
      notes: body.notes || '',
      tenantSlug,
      systemSizeKW,
      estimatedCost: netCostAfterITC, // Map new field to old for Airtable compatibility
      estimatedSavings: year1Savings, // Map new field to old for Airtable compatibility
      paybackPeriodYears: paybackYear, // Map new field to old for Airtable compatibility
      npv25Year,
      co2OffsetPerYear,
      createdAt: new Date().toISOString(),
    };

    // Store lead in Airtable (or fallback)
    let storeResult;
    console.log('Environment check:', {
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
      airtableKeyLength: process.env.AIRTABLE_API_KEY?.length,
      airtableBase: process.env.AIRTABLE_BASE_ID
    });
    
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      console.log('Attempting to store lead in Airtable...');
      storeResult = await storeLead(leadData);
    } else {
      console.log('Using fallback storage (missing Airtable credentials)');
      storeResult = await storeLeadFallback(leadData);
    }

    if (!storeResult.success) {
      console.error('Failed to store lead:', storeResult.error);
      return NextResponse.json(
        { error: `Failed to store lead information: ${storeResult.error}` },
        { status: 500 }
      );
    }

    // Send email notifications
    const tenantName = tenantSlug === 'acme' ? 'ACME Solar' : 'Sunspire';
    
    // Send notification to tenant (if Resend API key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const tenantEmail = tenantSlug === 'acme' ? 'info@acmesolar.com' : 'hello@sunspire.com';
        const notificationEmail = generateLeadNotificationEmail(tenantName, {
          name,
          email,
          phone: body.phone,
          address,
          systemSizeKW,
          estimatedCost: netCostAfterITC,
          estimatedSavings: year1Savings,
        });

        await sendEmail({
          to: tenantEmail,
          from: 'noreply@sunspire.com',
          ...notificationEmail,
        });
      } catch (emailError) {
        console.error('Failed to send tenant notification:', emailError);
        // Don't fail the request if email fails
      }

      // Send confirmation to user
      try {
        const userEmail = generateUserConfirmationEmail(tenantName, {
          name,
          address,
          systemSizeKW,
          estimatedCost: netCostAfterITC,
          estimatedSavings: year1Savings,
        });

        await sendEmail({
          to: email,
          from: 'noreply@sunspire.com',
          ...userEmail,
        });
      } catch (emailError) {
        console.error('Failed to send user confirmation:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Lead submitted successfully'
    });

  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

