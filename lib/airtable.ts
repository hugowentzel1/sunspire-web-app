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
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Table%201`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Name': leadData.name,
          'Notes': `Email: ${leadData.email}
Phone: ${leadData.phone || 'Not provided'}
Address: ${leadData.address}
System Size: ${leadData.systemSizeKW} kW
Estimated Cost: $${leadData.estimatedCost.toLocaleString()}
Year 1 Savings: $${leadData.estimatedSavings.toLocaleString()}
Payback: ${leadData.paybackPeriodYears} years
25-Year Value: $${leadData.npv25Year.toLocaleString()}
CO2 Offset: ${leadData.co2OffsetPerYear.toLocaleString()} lbs/year
Tenant: ${leadData.tenantSlug}
Created: ${leadData.createdAt}

Additional Notes: ${leadData.notes || 'None'}`,
          'Status': 'New Lead'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error Response:', errorText);
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
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

