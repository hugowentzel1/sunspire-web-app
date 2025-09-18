import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyHandle = searchParams.get("company");

    if (!companyHandle) {
      return NextResponse.json(
        { error: "Company handle required" },
        { status: 400 },
      );
    }

    // Verify API key for security
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // Fetch leads from Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads?filterByFormula={Company Handle}='${companyHandle}'&sort[0][field]=Created&sort[0][direction]=desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!airtableResponse.ok) {
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }

    const data = await airtableResponse.json();

    const leads = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields["Name"] || "",
      email: record.fields["Email"] || "",
      address: record.fields["Address"] || "",
      phone: record.fields["Phone"] || "",
      created: record.fields["Created"] || record.createdTime,
    }));

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
