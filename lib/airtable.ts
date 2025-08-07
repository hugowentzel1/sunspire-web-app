export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  notes?: string;
  tenantSlug: string;
  systemSizeKW: number;
  estimatedCost: number;
  estimatedSavings: number;
  paybackPeriodYears: number;
  npv25Year: number;
  co2OffsetPerYear: number;
  createdAt: string;
}

export async function storeLead(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Name': leadData.name,
          'Email': leadData.email,
          'Phone': leadData.phone || '',
          'Address': leadData.address,
          'Notes': leadData.notes || '',
          'Tenant Slug': leadData.tenantSlug,
          'System Size (kW)': leadData.systemSizeKW,
          'Estimated Cost': leadData.estimatedCost,
          'Estimated Savings': leadData.estimatedSavings,
          'Payback Period (Years)': leadData.paybackPeriodYears,
          '25-Year NPV': leadData.npv25Year,
          'CO2 Offset/Year': leadData.co2OffsetPerYear,
          'Created At': leadData.createdAt,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error storing lead in Airtable:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Fallback storage for development/testing
export async function storeLeadFallback(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    // In production, this would store to a database
    console.log('Lead stored (fallback):', leadData);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

