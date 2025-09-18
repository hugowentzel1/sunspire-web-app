import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
);

export async function getLastLeadForTenant(handle: string) {
  const records = await base("Leads")
    .select({
      filterByFormula: `{Company Handle} = "${handle}"`,
      sort: [{ field: "Created", direction: "desc" }],
      pageSize: 1,
    })
    .all();

  const r = records[0];
  if (!r) return null;

  return {
    id: r.id,
    fields: r.fields,
  };
}
