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
  const tableNames = ['Table 1', 'Leads', 'tblybSQVPXv2GbwUq']; // Try multiple possible names
  
  for (const tableName of tableNames) {
    try {
      const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
      console.log(`Trying Airtable table: ${tableName}, URL: ${url}`);
      
      const payload = {
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

Additional Notes: ${leadData.notes || 'None'}`
        }
      };
      
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`Successfully stored lead using table name: ${tableName}`);
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error(`Failed with table ${tableName}:`, response.status, errorText);
        
        // If this is the last table name, throw the error
        if (tableName === tableNames[tableNames.length - 1]) {
          throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.error(`Error with table ${tableName}:`, error);
      
      // If this is the last table name, return the error
      if (tableName === tableNames[tableNames.length - 1]) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }
  }
  
  return { success: false, error: 'All table names failed' };
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

