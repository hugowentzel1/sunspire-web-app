export const runtime = "edge";
export async function POST(req: Request) {
  await req.text(); // ignore payload for now
  return new Response(null, { status: 204 });
}
