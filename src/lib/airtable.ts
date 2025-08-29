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
    base = new Airtable({ apiKey: ENV.AIRTABLE_API_KEY }).base(ENV.AIRTABLE_BASE_ID);
  }
  return base;
}

// Table names
const TABLES = {
  LEADS: 'Leads',
  TENANTS: 'Tenants',
  USERS: 'Users'
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
  UTILITY_RATE: 'Utility Rate ($/kWh)'
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
  USERS: 'Users'
} as const;

const USER_FIELDS = {
  EMAIL: 'Email',
  ROLE: 'Role',
  TENANT: 'Tenant'
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
}

export interface Tenant {
  id?: string;
  [TENANT_FIELDS.COMPANY_HANDLE]: string;
  [TENANT_FIELDS.PLAN]?: string;
  [TENANT_FIELDS.DOMAIN_LOGIN_URL]?: string;
  [TENANT_FIELDS.BRAND_COLORS]?: string;
  [TENANT_FIELDS.LOGO_URL]?: string;
  [TENANT_FIELDS.CRM_KEYS]?: string;
  [TENANT_FIELDS.API_KEY]: string;
  [TENANT_FIELDS.CAPTURE_URL]: string;
  [TENANT_FIELDS.USERS]?: string[];
}

export interface User {
  id?: string;
  [USER_FIELDS.EMAIL]: string;
  [USER_FIELDS.ROLE]: string;
  [USER_FIELDS.TENANT]: string[];
}

// Helper function to get current timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Tenant functions
export async function findTenantByHandle(handle: string): Promise<Tenant | null> {
  try {
    const records = await getBase()(TABLES.TENANTS)
      .select({
        filterByFormula: `{${TENANT_FIELDS.COMPANY_HANDLE}} = '${handle}'`
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
        filterByFormula: `{${TENANT_FIELDS.API_KEY}} = '${key}'`
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
  const found = await getBase()(TABLES.TENANTS).select({
    filterByFormula: `{${TENANT_FIELDS.COMPANY_HANDLE}} = "${handle}"`
  }).firstPage();
  if (found[0]) {
    const updated = await getBase()(TABLES.TENANTS).update([{ id: found[0].id, fields }]);
    return { id: updated[0].id };
  }
  const created = await getBase()(TABLES.TENANTS).create([{ fields }]);
  return { id: created[0].id };
}

export async function createOrLinkUserOwner(tenantId: string, email: string) {
  const users = await getBase()(TABLES.USERS).select({
    filterByFormula: `AND({${USER_FIELDS.EMAIL}} = "${email}", {${USER_FIELDS.TENANT}} = "${tenantId}")`,
    maxRecords: 1
  }).firstPage();

  if (users[0]) return users[0].id;

  const created = await getBase()(TABLES.USERS).create([{
    fields: {
      [USER_FIELDS.EMAIL]: email,
      [USER_FIELDS.ROLE]: "Owner",
      [USER_FIELDS.TENANT]: [tenantId],
    }
  }]);

  return created[0].id;
}

export async function findOrCreateMasterTenant() {
  // Adjust "sunspire-master" to whatever you want your master handle to be
  const handle = "sunspire-master";
  const found = await getBase()(TABLES.TENANTS).select({
    filterByFormula: `{${TENANT_FIELDS.COMPANY_HANDLE}} = "${handle}"`,
    maxRecords: 1
  }).firstPage();
  if (found[0]) return { id: found[0].id };
  const created = await getBase()(TABLES.TENANTS).create([{
    fields: { [TENANT_FIELDS.COMPANY_HANDLE]: handle, [TENANT_FIELDS.PLAN]: "Scale" }
  }]);
  return { id: created[0].id };
}

export async function upsertLeadByEmailAndTenant(
  email: string,
  tenantId: string,
  fields: Record<string, any>
): Promise<Lead> {
  const found = await getBase()(TABLES.LEADS).select({
    filterByFormula: `AND(LOWER({${LEAD_FIELDS.EMAIL}}) = "${email.toLowerCase()}", ARRAYJOIN({${LEAD_FIELDS.TENANT}}) = "${tenantId}")`,
    maxRecords: 1
  }).firstPage();

  const merged = {
    ...fields,
    [LEAD_FIELDS.EMAIL]: email,
    [LEAD_FIELDS.TENANT]: [tenantId],
    [LEAD_FIELDS.LAST_ACTIVITY]: getCurrentTimestamp()
  };

  if (found[0]) {
    const updated = await getBase()(TABLES.LEADS).update([{ id: found[0].id, fields: merged }]);
    return {
      id: updated[0].id,
      ...updated[0].fields
    } as Lead;
  }
  const created = await getBase()(TABLES.LEADS).create([{ fields: merged }]);
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
