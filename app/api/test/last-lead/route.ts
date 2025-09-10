import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const baseId = process.env.AIRTABLE_BASE_ID!;
const apiKey = process.env.AIRTABLE_API_KEY!;

async function getLastLeadForTenant(handle: string) {
  const base = new Airtable({ apiKey }).base(baseId);
  const records = await base('Leads').select({
    filterByFormula: `{Company Handle} = "${handle}"`,
    sort: [{ field: 'Created', direction: 'desc' }],
    pageSize: 1
  }).all();
  const r = records[0];
  if (!r) return null;
  return { id: r.id, fields: r.fields };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = req.headers.get('x-test-token') || url.searchParams.get('token');
  if (!process.env.TEST_API_TOKEN || token !== process.env.TEST_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  const tenant = url.searchParams.get('tenant');
  if (!tenant) return NextResponse.json({ ok: false, error: 'tenant required' }, { status: 400 });
  try {
    const last = await getLastLeadForTenant(tenant);
    return NextResponse.json({ ok: true, last }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
