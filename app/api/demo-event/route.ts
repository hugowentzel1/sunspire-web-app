export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // TODO: forward to Airtable/Zapier. For now just swallow.
  console.log("demo-event", body);
  return new Response(null, { status: 204 });
}
