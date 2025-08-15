export const runtime = "edge";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("demo-event", body);
    
    // TODO: Forward to Airtable/Zapier for follow-up and retargeting
    // Include: brand, domain, variant, utm params, deadline, runsUsed, referrer, userAgent, screen size
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("demo-event error:", error);
    return new Response(null, { status: 204 });
  }
}
