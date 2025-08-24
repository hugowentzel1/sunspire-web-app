// Server-only Airtable client with batching and throttling

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

interface AirtableRecord {
  id?: string;
  fields: Record<string, any>;
}

// Lead data interface for the API route
export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  notes?: string;
  tenantSlug: string;
  systemSizeKW?: number;
  estimatedCost?: number;
  estimatedSavings?: number;
  paybackPeriodYears?: number;
  npv25Year?: number;
  co2OffsetPerYear?: number;
  createdAt: string;
}

class AirtableClient {
  private config: AirtableConfig;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly minInterval = 250; // 4 requests per second

  constructor(config: AirtableConfig) {
    this.config = config;
  }

  // Throttled request method
  private async throttledRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    return requestFn();
  }

  // Create or update records with batching
  async upsertRecords(records: AirtableRecord[]): Promise<void> {
    if (records.length === 0) return;

    // Split into batches of 10 (Airtable limit)
    const batches = [];
    for (let i = 0; i < records.length; i += 10) {
      batches.push(records.slice(i, i + 10));
    }

    // Process batches with throttling
    for (const batch of batches) {
      await this.throttledRequest(async () => {
        await this.processBatch(batch);
      });
    }
  }

  private async processBatch(records: AirtableRecord[]): Promise<void> {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${this.config.baseId}/${this.config.tableName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: records.map(record => ({
              fields: record.fields
            }))
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - implement exponential backoff
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          await new Promise(resolve => setTimeout(resolve, delay));
          // Retry the batch
          await this.processBatch(records);
        } else {
          throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Airtable batch processing error:', error);
      throw error;
    }
  }

  // Queue a record for processing
  async queueRecord(record: AirtableRecord): Promise<void> {
    this.requestQueue.push(async () => {
      await this.upsertRecords([record]);
    });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process the request queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();
        if (request) {
          await request();
        }
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

// Export singleton instance
export const airtableClient = new AirtableClient({
  apiKey: process.env.AIRTABLE_API_KEY || '',
  baseId: process.env.AIRTABLE_BASE_ID || '',
  tableName: process.env.AIRTABLE_TABLE_NAME || 'Leads'
});

// Helper functions
export async function upsertLead(leadData: {
  email: string;
  companyHandle: string;
  fullName?: string;
  company?: string;
  address?: string;
  lat?: number;
  lng?: number;
  crm?: string;
  source?: string;
  campaignId?: string;
}): Promise<void> {
  await airtableClient.queueRecord({
    fields: {
      Email: leadData.email,
      CompanyHandle: leadData.companyHandle,
      FullName: leadData.fullName || '',
      Company: leadData.company || '',
      Address: leadData.address || '',
      Latitude: leadData.lat || '',
      Longitude: leadData.lng || '',
      CRM: leadData.crm || '',
      Source: leadData.source || '',
      CampaignID: leadData.campaignId || '',
      CreatedAt: new Date().toISOString()
    }
  });
}

export async function logEvent(eventData: {
  companyHandle: string;
  type: string;
  email?: string;
  metadata?: Record<string, any>;
  campaignId?: string;
}): Promise<void> {
  await airtableClient.queueRecord({
    fields: {
      CompanyHandle: eventData.companyHandle,
      EventType: eventData.type,
      Email: eventData.email || '',
      Metadata: JSON.stringify(eventData.metadata || {}),
      CampaignID: eventData.campaignId || '',
      Timestamp: new Date().toISOString()
    }
  });
}

// Store lead function for the API route
export async function storeLead(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    await airtableClient.queueRecord({
      fields: {
        Name: leadData.name,
        Email: leadData.email,
        Phone: leadData.phone || '',
        Address: leadData.address,
        Notes: leadData.notes || '',
        TenantSlug: leadData.tenantSlug,
        SystemSizeKW: leadData.systemSizeKW || '',
        EstimatedCost: leadData.estimatedCost || '',
        EstimatedSavings: leadData.estimatedSavings || '',
        PaybackPeriodYears: leadData.paybackPeriodYears || '',
        NPV25Year: leadData.npv25Year || '',
        CO2OffsetPerYear: leadData.co2OffsetPerYear || '',
        CreatedAt: leadData.createdAt
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error storing lead in Airtable:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fallback storage function when Airtable is not available
export async function storeLeadFallback(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    // Log to console as fallback
    console.log('Lead stored in fallback mode:', {
      ...leadData,
      storedAt: new Date().toISOString(),
      fallback: true
    });
    
    // You could also store in a local file or database here
    return { success: true };
  } catch (error) {
    console.error('Error in fallback storage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

