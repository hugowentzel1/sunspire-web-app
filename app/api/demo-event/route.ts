export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    
    // TODO: forward to your analytics or Airtable here
    console.log("demo-event", body);
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error processing demo event:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
