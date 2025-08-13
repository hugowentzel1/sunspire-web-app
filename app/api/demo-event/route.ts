export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  console.log("demo-event", body);
  return new Response(null, { status: 204 });
}
