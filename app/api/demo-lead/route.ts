export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, domain, brand, primary, logo, demoLink, source } =
      body;

    // TODO: Call Airtable here with the demo lead data
    // For now, just log the data
    console.log("Demo lead captured:", {
      name,
      email,
      domain,
      brand,
      primary,
      logo,
      demoLink,
      source,
      timestamp: new Date().toISOString(),
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error capturing demo lead:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
