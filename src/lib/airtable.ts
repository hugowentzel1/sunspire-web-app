import Airtable from 'airtable';
import { ENV } from '../config/env';
import { logger } from './logger';

// Initialize Airtable (only when API key is available)
let base: Airtable.Base | null = null;

function getBase(): Airtable.Base {
  if (!base) {
    if (!ENV.AIRTABLE_API_KEY || !ENV.AIRTABLE_BASE_ID) {
      throw new Error('Airtable API key and base ID are required');
    }
    
    console.log('🔍 Initializing Airtable client:', {
      hasApiKey: !!ENV.AIRTABLE_API_KEY,
      hasBaseId: !!ENV.AIRTABLE_BASE_ID,
      apiKeyLength: ENV.AIRTABLE_API_KEY?.length,
      baseId: ENV.AIRTABLE_BASE_ID
    });
    
    base = new Airtable({ apiKey: ENV.AIRTABLE_API_KEY }).base(ENV.AIRTABLE_BASE_ID);
  }
  return base;
}

// Table names
const TABLES = {
  LEADS: 'Leads',
  TENANTS: 'Tenants',
  USERS: 'Users',
  LINKS: 'Links'
} as const;

// Field names as defined in requirements
const LEAD_FIELDS = {
  NAME: 'Name',
  EMAIL: 'Email',
  COMPANY: 'Company',
  TENANT: 'Tenant',
  DEMO_URL: 'Demo URL',
  CAMPAIGN_ID: 'Campaign ID',
  STATUS: 'Status',
  NOTES: 'Notes',
  LAST_ACTIVITY: 'Last Activity',
  STREET: 'Street',
  CITY: 'City',
  STATE: 'State',
  POSTAL_CODE: 'Postal Code',
  COUNTRY: 'Country',
  FORMATTED_ADDRESS: 'Formatted Address',
  PLACE_ID: 'Place ID',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  UTILITY_RATE: 'Utility Rate ($/kWh)',
  TOKEN: 'Token'
} as const;

const TENANT_FIELDS = {
  COMPANY_HANDLE: 'Company Handle',
  PLAN: 'Plan',
  DOMAIN_LOGIN_URL: 'Domain / Login URL',
  BRAND_COLORS: 'Brand Colors',
  LOGO_URL: 'Logo URL',
  CRM_KEYS: 'CRM Keys',
  API_KEY: 'API Key',
  CAPTURE_URL: 'Capture URL',
  USERS: 'Users',
  PAYMENT_STATUS: 'Payment Status',
  STRIPE_CUSTOMER_ID: 'Stripe Customer ID',
  LAST_PAYMENT: 'Last Payment',
  SUBSCRIPTION_ID: 'Subscription ID',
  CURRENT_PERIOD_END: 'Current Period End',
  REQUESTED_DOMAIN: 'Requested Domain',
  DOMAIN_STATUS: 'Domain Status',
  DOMAIN: 'Domain'
} as const;

const USER_FIELDS = {
  EMAIL: 'Email',
  ROLE: 'Role',
  TENANT: 'Tenant'
} as const;

const LINK_FIELDS = {
  TOKEN: 'Token',
  TARGET_PARAMS: 'TargetParams',
  TENANT: 'Tenant',
  CLICKS: 'Clicks',
  STATUS: 'Status',
  LAST_CLICKED_AT: 'LastClickedAt',
  PROSPECT_EMAIL: 'ProspectEmail'
} as const;

// Types
export interface Lead {
  id?: string;
  [LEAD_FIELDS.NAME]: string;
  [LEAD_FIELDS.EMAIL]: string;
  [LEAD_FIELDS.COMPANY]?: string;
  [LEAD_FIELDS.TENANT]: string[];
  [LEAD_FIELDS.DEMO_URL]?: string;
  [LEAD_FIELDS.CAMPAIGN_ID]?: string;
  [LEAD_FIELDS.STATUS]: string;
  [LEAD_FIELDS.NOTES]?: string;
  [LEAD_FIELDS.LAST_ACTIVITY]: string;
  [LEAD_FIELDS.STREET]?: string;
  [LEAD_FIELDS.CITY]?: string;
  [LEAD_FIELDS.STATE]?: string;
  [LEAD_FIELDS.POSTAL_CODE]?: string;
  [LEAD_FIELDS.COUNTRY]?: string;
  [LEAD_FIELDS.FORMATTED_ADDRESS]?: string;
  [LEAD_FIELDS.PLACE_ID]?: string;
  [LEAD_FIELDS.LATITUDE]?: number;
  [LEAD_FIELDS.LONGITUDE]?: number;
  [LEAD_FIELDS.UTILITY_RATE]?: number;
  [LEAD_FIELDS.TOKEN]?: string;
}

export interface Tenant {
  id?: string;
  [TENANT_FIELDS.COMPANY_HANDLE]: string;
  [TENANT_FIELDS.PLAN]: string;
  [TENANT_FIELDS.DOMAIN_LOGIN_URL]?: string;
  [TENANT_FIELDS.BRAND_COLORS]?: string;
  [TENANT_FIELDS.LOGO_URL]?: string;
  [TENANT_FIELDS.CRM_KEYS]?: string;
  [TENANT_FIELDS.API_KEY]?: string;
  [TENANT_FIELDS.CAPTURE_URL]?: string;
  [TENANT_FIELDS.USERS]?: string[];
  [TENANT_FIELDS.PAYMENT_STATUS]?: string;
  [TENANT_FIELDS.STRIPE_CUSTOMER_ID]?: string;
  [TENANT_FIELDS.LAST_PAYMENT]?: string;
  [TENANT_FIELDS.SUBSCRIPTION_ID]?: string;
  [TENANT_FIELDS.CURRENT_PERIOD_END]?: string;
  [TENANT_FIELDS.REQUESTED_DOMAIN]?: string;
  [TENANT_FIELDS.DOMAIN_STATUS]?: string;
  [TENANT_FIELDS.DOMAIN]?: string;
}

export interface User {
  id?: string;
  [USER_FIELDS.EMAIL]: string;
  [USER_FIELDS.ROLE]: string;
  [USER_FIELDS.TENANT]: string[];
}

export interface Link {
  id?: string;
  [LINK_FIELDS.TOKEN]: string;
  [LINK_FIELDS.TARGET_PARAMS]: string;
  [LINK_FIELDS.TENANT]: string[];
  [LINK_FIELDS.CLICKS]: number;
  [LINK_FIELDS.STATUS]: string;
  [LINK_FIELDS.LAST_CLICKED_AT]?: string;
  [LINK_FIELDS.PROSPECT_EMAIL]?: string;
}

// Utility function to get current timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Tenant functions
export async function findTenantByHandle(handle: string): Promise<Tenant | null> {
  try {
    const records = await getBase()(TABLES.TENANTS)
      .select({
        filterByFormula: `{${TENANT_FIELDS.COMPANY_HANDLE}} = '${handle}'`,
        maxRecords: 1
      })
      .firstPage();
    
    if (records.length === 0) return null;
    
    const record = records[0];
    return {
      id: record.id,
      ...record.fields
    } as Tenant;
  } catch (error) {
    logger.error('Error finding tenant by handle:', error);
    throw error;
  }
}

export async function findTenantByApiKey(key: string): Promise<Tenant | null> {
  try {
    const records = await getBase()(TABLES.TENANTS)
      .select({
        filterByFormula: `{${TENANT_FIELDS.API_KEY}} = '${key}'`,
        maxRecords: 1
      })
      .firstPage();
    
    if (records.length === 0) return null;
    
    const record = records[0];
    return {
      id: record.id,
      ...record.fields
    } as Tenant;
  } catch (error) {
    logger.error('Error finding tenant by API key:', error);
    throw error;
  }
}

export async function upsertTenantByHandle(handle: string, fields: Record<string, any>) {
  try {
    const existing = await findTenantByHandle(handle);
    
    if (existing && existing.id) {
      const updated = await getBase()(TABLES.TENANTS).update([{ id: existing.id, fields }]);
      return updated[0];
    } else {
      const created = await getBase()(TABLES.TENANTS).create([{ fields }]);
      return created[0];
    }
  } catch (error) {
    logger.error('Error upserting tenant:', error);
    throw error;
  }
}

export async function createOrLinkUserOwner(tenantId: string, email: string) {
  try {
    const base = getBase();
    
    // Check if user already exists
    const existingUsers = await base(TABLES.USERS)
      .select({
        filterByFormula: `AND({${USER_FIELDS.EMAIL}} = '${email}', {${USER_FIELDS.TENANT}} = '${tenantId}')`,
        maxRecords: 1
      })
      .firstPage();
    
    if (existingUsers.length > 0) {
      return existingUsers[0].id;
    }
    
    // Create new user
    const newUser = await base(TABLES.USERS).create([{
      fields: {
        [USER_FIELDS.EMAIL]: email,
        [USER_FIELDS.ROLE]: 'Owner',
        [USER_FIELDS.TENANT]: [tenantId]
      }
    }]);
    
    return newUser[0].id;
  } catch (error) {
    logger.error('Error creating/linking user owner:', error);
    throw error;
  }
}

export async function findOrCreateMasterTenant() {
  try {
    const masterTenant = await findTenantByHandle('sunspire');
    
    if (masterTenant) {
      return masterTenant;
    }
    
    // Create master tenant if it doesn't exist
    const created = await getBase()(TABLES.TENANTS).create([{
      fields: {
        [TENANT_FIELDS.COMPANY_HANDLE]: 'sunspire',
        [TENANT_FIELDS.PLAN]: 'Enterprise',
        [TENANT_FIELDS.API_KEY]: 'master-key-' + Math.random().toString(36).substring(2, 15)
      }
    }]);
    
    return {
      id: created[0].id,
      ...created[0].fields
    } as Tenant;
  } catch (error) {
    logger.error('Error finding/creating master tenant:', error);
    throw error;
  }
}

// Lead functions
export async function upsertLeadByEmailAndTenant(
  email: string, 
  tenantId: string, 
  fields: Record<string, any>
): Promise<Lead> {
  const base = getBase();
  
  // Check if lead already exists
  const found = await base(TABLES.LEADS)
    .select({
      filterByFormula: `AND({${LEAD_FIELDS.EMAIL}} = '${email}', {${LEAD_FIELDS.TENANT}} = '${tenantId}')`,
      maxRecords: 1
    }).firstPage();

  const merged = {
    ...fields,
    [LEAD_FIELDS.EMAIL]: email,
    [LEAD_FIELDS.TENANT]: [tenantId],
    [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp()
  };

  if (found[0]) {
    const updated = await base(TABLES.LEADS).update([{ id: found[0].id!, fields: merged }]);
    return {
      id: updated[0].id,
      ...updated[0].fields
    } as Lead;
  }
  const created = await base(TABLES.LEADS).create([{ fields: merged }]);
  return {
    id: created[0].id,
    ...created[0].fields
  } as Lead;
}

// User functions
export async function createUser(fields: Omit<User, 'id'>): Promise<User> {
  try {
    const record = await getBase()(TABLES.USERS).create(fields);
    return {
      id: record.id,
      ...record.fields
    } as User;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

// Lead functions
export async function findLeadByEmailAndTenant(email: string, tenantId: string): Promise<Lead | null> {
  try {
    const records = await getBase()(TABLES.LEADS)
      .select({
        filterByFormula: `AND({${LEAD_FIELDS.EMAIL}} = '${email}', {${LEAD_FIELDS.TENANT}} = '${tenantId}')`
      })
      .firstPage();
    
    if (records.length === 0) return null;
    
    const record = records[0];
    return {
      id: record.id,
      ...record.fields
    } as Lead;
  } catch (error) {
    logger.error('Error finding lead by email and tenant:', error);
    throw error;
  }
}

export async function updateLead(recordId: string, fields: Partial<Lead>): Promise<Lead> {
  try {
    const record = await getBase()(TABLES.LEADS).update(recordId, {
      ...fields,
      [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp()
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Lead;
  } catch (error) {
    logger.error('Error updating lead:', error);
    throw error;
  }
}

export async function appendLeadNote(recordId: string, text: string): Promise<Lead> {
  try {
    const existing = await getBase()(TABLES.LEADS).find(recordId);
    const currentNotes = existing.fields[LEAD_FIELDS.NOTES] || '';
    const newNotes = currentNotes ? `${currentNotes}\n${text}` : text;
    
    const record = await getBase()(TABLES.LEADS).update(recordId, {
      [LEAD_FIELDS.NOTES]: newNotes,
      [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp()
    });
    
    return {
      id: record.id,
      ...record.fields
    } as Lead;
  } catch (error) {
    logger.error('Error appending lead note:', error);
    throw error;
  }
}

// Link functions for outreach redirects
export async function findLinkByToken(token: string): Promise<{ id: string; targetParams: string } | null> {
  try {
    const records = await getBase()(TABLES.LINKS)
      .select({
        filterByFormula: `{${LINK_FIELDS.TOKEN}} = '${token}'`,
        maxRecords: 1
      })
      .firstPage();
    
    if (records.length === 0) return null;
    
    const record = records[0];
    return {
      id: record.id,
      targetParams: String(record.fields[LINK_FIELDS.TARGET_PARAMS] || '')
    };
  } catch (error) {
    logger.error('Error finding link by token:', error);
    return null;
  }
}

export async function markLinkClicked(id: string): Promise<void> {
  try {
    const record = await getBase()(TABLES.LINKS).find(id);
    const currentClicks = record.fields[LINK_FIELDS.CLICKS] as number || 0;
    await getBase()(TABLES.LINKS).update(id, {
      [LINK_FIELDS.CLICKS]: currentClicks + 1,
      [LINK_FIELDS.LAST_CLICKED_AT]: getCurrentTimestamp()
    });
  } catch (error) {
    logger.error('Error marking link clicked:', error);
  }
}

// Additional functions for backward compatibility
export async function upsertLead(leadData: {
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
  token?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const tenant = await findTenantByHandle(leadData.tenantSlug);
    if (!tenant) {
      return { success: false, error: 'Tenant not found' };
    }
    
    await upsertLeadByEmailAndTenant(leadData.email, tenant.id!, {
      [LEAD_FIELDS.NAME]: leadData.name,
      [LEAD_FIELDS.EMAIL]: leadData.email,
      [LEAD_FIELDS.FORMATTED_ADDRESS]: leadData.address,
      [LEAD_FIELDS.NOTES]: leadData.notes || '',
      [LEAD_FIELDS.TENANT]: [tenant.id!],
      [LEAD_FIELDS.STATUS]: 'New',
      [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp(),
      [LEAD_FIELDS.UTILITY_RATE]: 0.12, // Default value
      [LEAD_FIELDS.TOKEN]: leadData.token || ''
    });
    
    return { success: true };
  } catch (error) {
    logger.error('Failed to upsert lead:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function logEvent(eventData: {
  type: string;
  tenantId: string;
  userId?: string;
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, just log to console. In production, you might want to store events in Airtable
    logger.info('Event logged:', eventData);
    return { success: true };
  } catch (error) {
    logger.error('Failed to log event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function storeLead(leadData: {
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
  token?: string;
}): Promise<{ success: boolean; error?: string }> {
  return upsertLead(leadData);
}

export async function storeLeadFallback(leadData: {
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
  token?: string;
}): Promise<{ success: boolean; error?: string }> {
  // Fallback implementation - same as storeLead for now
  return upsertLead(leadData);
}

// Lead suppression functions
export async function upsertLeadSuppressionByEmail(email: string, source: string): Promise<void> {
  try {
    const base = getBase();
    
    // Find all leads with this email across all tenants
    const leads = await base(TABLES.LEADS)
      .select({
        filterByFormula: `{${LEAD_FIELDS.EMAIL}} = '${email}'`
      })
      .all();
    
    if (leads.length === 0) {
      // Create a suppression record if no leads found
      await base(TABLES.LEADS).create([{
        fields: {
          [LEAD_FIELDS.EMAIL]: email,
          [LEAD_FIELDS.STATUS]: 'Suppression',
          [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp(),
          [LEAD_FIELDS.NOTES]: `Suppressed via ${source} on ${getCurrentTimestamp()}`
        }
      }]);
      logger.info(`Created suppression record for email: ${email}`);
      return;
    }
    
    // Update all leads to suppressed status
    const updates = leads.map(lead => ({
      id: lead.id,
      fields: {
        [LEAD_FIELDS.STATUS]: 'Suppression',
        [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp(),
        [LEAD_FIELDS.NOTES]: `${lead.fields[LEAD_FIELDS.NOTES] || ''}\nSuppressed via ${source} on ${getCurrentTimestamp()}`.trim()
      }
    }));
    
    await base(TABLES.LEADS).update(updates);
    logger.info(`Suppressed ${leads.length} lead(s) for email: ${email} via ${source}`);
    
  } catch (error) {
    logger.error('Error suppressing lead by email:', error);
    throw error;
  }
}

export async function suppressByHash(hash: string): Promise<void> {
  try {
    // This would need to be implemented based on your hash system
    // For now, we'll just log it
    logger.info(`Suppression requested for hash: ${hash}`);
    // TODO: Implement hash-to-email resolution
  } catch (error) {
    logger.error('Error suppressing by hash:', error);
    throw error;
  }
}

// Domain management functions
export async function getTenantByHandle(handle: string): Promise<Tenant | null> {
  return findTenantByHandle(handle);
}

export async function updateTenantDomain(handle: string, domain: string): Promise<void> {
  try {
    const tenant = await findTenantByHandle(handle);
    if (!tenant || !tenant.id) {
      throw new Error('Tenant not found');
    }
    
    await getBase()(TABLES.TENANTS).update([{
      id: tenant.id,
      fields: {
        [TENANT_FIELDS.DOMAIN]: domain
      }
    }]);
    
    logger.info(`Updated domain for tenant ${handle}: ${domain}`);
  } catch (error) {
    logger.error('Error updating tenant domain:', error);
    throw error;
  }
}

export async function setTenantDomainStatus(handle: string, status: string): Promise<void> {
  try {
    const tenant = await findTenantByHandle(handle);
    if (!tenant || !tenant.id) {
      throw new Error('Tenant not found');
    }
    
    await getBase()(TABLES.TENANTS).update([{
      id: tenant.id,
      fields: {
        [TENANT_FIELDS.DOMAIN_STATUS]: status
      }
    }]);
    
    logger.info(`Updated domain status for tenant ${handle}: ${status}`);
  } catch (error) {
    logger.error('Error setting tenant domain status:', error);
    throw error;
  }
}

export async function setRequestedDomain(handle: string, domain: string): Promise<void> {
  try {
    const tenant = await findTenantByHandle(handle);
    if (!tenant || !tenant.id) {
      throw new Error('Tenant not found');
    }
    
    await getBase()(TABLES.TENANTS).update([{
      id: tenant.id,
      fields: {
        [TENANT_FIELDS.REQUESTED_DOMAIN]: domain
      }
    }]);
    
    logger.info(`Set requested domain for tenant ${handle}: ${domain}`);
  } catch (error) {
    logger.error('Error setting requested domain:', error);
    throw error;
  }
}
